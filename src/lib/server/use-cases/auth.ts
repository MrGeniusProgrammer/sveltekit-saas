import { AccountProvider, AccountProviderId } from "@/entities/account";
import { UserEmail, UserName } from "@/entities/user";
import { env } from "@/env";
import { createCodeError } from "@/helpers/error";
import { zodValidate } from "@/helpers/schema";
import { flow, O, pipe, RT, RTE, TE, type Option } from "@/packages/fp-ts";
import {
	decodeIdToken,
	generateCodeVerifier,
	generateState,
	GitHub,
	Google,
	OAuth2Tokens,
} from "arctic";
import { z } from "zod";
import {
	createAccount,
	getAccountByProviderAndId,
} from "../data-access/account";
import { createSession, generateSessionToken } from "./session";
import { createUser } from "./user";

export const github = new GitHub(
	env.GITHUB_CLIENT_ID,
	env.GITHUB_CLIENT_SECRET,
	"http://localhost:5173/api/auth/sign-in/github/callback",
);

export const google = new Google(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	"http://localhost:5173/api/auth/sign-in/google/callback",
);

interface CreateUserWithProviderParams {
	accountProvider: AccountProvider;
	accountProviderId: AccountProviderId;
	userName: UserName;
	userEmail: UserEmail;
}

export const createUserWithProvider = (params: CreateUserWithProviderParams) =>
	pipe(
		getAccountByProviderAndId({
			provider: params.accountProvider,
			providerId: params.accountProviderId,
		}),
		RTE.chainW((optionalAccount) =>
			pipe(
				optionalAccount,
				O.foldW(
					() =>
						pipe(
							createUser({
								userName: params.userName,
								userEmail: params.userEmail,
							}),
							RTE.chainW((user) =>
								createAccount({
									providerId: params.accountProviderId,
									provider: params.accountProvider,
									userId: user.id,
								}),
							),
						),
					RTE.of,
				),
			),
		),

		RTE.chainW((account) =>
			pipe(
				RTE.Do,
				RTE.apSW(
					"sessionToken",
					RTE.fromReader(generateSessionToken()),
				),
				RTE.bindW("session", ({ sessionToken }) =>
					createSession({
						sessionToken,
						userId: account.userId,
					}),
				),
			),
		),
	);

interface HandleOAuthCallbackParams {
	code: Option<string>;
	state: Option<string>;
	storedState: Option<string>;
}

interface HandleOAuthCallbackContructor {
	validateAuthorizationCode: (params: {
		code: string;
		state: string;
	}) => Promise<OAuth2Tokens>;
	fetchOAuthUser: (params: {
		code: string;
		state: string;
		tokens: OAuth2Tokens;
	}) => Promise<{
		accountProviderId: AccountProviderId;
		userName: UserName;
		userEmail: UserEmail;
	}>;
	accountProvider: AccountProvider;
}

export const handleOAuthCallback =
	(constructor: HandleOAuthCallbackContructor) =>
	(params: HandleOAuthCallbackParams) =>
		pipe(
			// Step 1: Extract required parameters and validate state
			O.Do,
			O.apS("code", params.code),
			O.apS("state", params.state),
			O.apS("storedState", params.storedState),
			O.filter(({ state, storedState }) => state === storedState),
			RTE.fromOption(() =>
				createCodeError({
					code: "invalid-state",
					message: "Missing or mismatched state parameter",
				}),
			), // Converts missing/invalid state into a CodeError

			RTE.bindW("tokens", (data) =>
				// Step 2: Validate the authorization code
				RTE.fromTaskEither(
					TE.tryCatch(
						() => constructor.validateAuthorizationCode(data),
						(error) =>
							createCodeError({
								code: "invalid-auth-code",
								message: "Authorization code validation failed",
								cause: error,
							}),
					),
				),
			),

			RTE.bindW("oauthUser", (data) =>
				// Step 3: Fetch GitHub user info
				pipe(
					RTE.fromTaskEither(
						TE.tryCatch(
							() => constructor.fetchOAuthUser(data),
							(error) =>
								createCodeError({
									code: "fetch-oauth-user-failed",
									message:
										"Failed to fetch user info from GitHub",
									cause: error,
								}),
						),
					),
					RTE.chainEitherKW((data) =>
						zodValidate(
							z.object({
								accountProviderId: AccountProviderId,
								userName: UserName,
								userEmail: UserEmail,
							}),
							data,
						),
					),
				),
			),

			RTE.chainW(({ oauthUser }) =>
				pipe(
					createUserWithProvider({
						userEmail: oauthUser.userEmail,
						userName: oauthUser.userName,
						accountProviderId: oauthUser.accountProviderId,
						accountProvider: constructor.accountProvider,
					}),
				),
			),
		);

interface HandleOAuthCallbackWithVerifierParams {
	code: Option<string>;
	state: Option<string>;
	storedState: Option<string>;
	codeVerifier: Option<string>;
}

interface HandleOAuthCallbackWithVerifierContructor {
	validateAuthorizationCode: (params: {
		code: string;
		state: string;
		codeVerifier: string;
	}) => Promise<OAuth2Tokens>;
	getOAuthUser: (params: {
		code: string;
		state: string;
		codeVerifier: string;
		tokens: OAuth2Tokens;
	}) => {
		accountProviderId: AccountProviderId;
		userName: UserName;
		userEmail: UserEmail;
	};
	accountProvider: AccountProvider;
}

export const handleOAuthCallbackWithVerifier =
	(constructor: HandleOAuthCallbackWithVerifierContructor) =>
	(params: HandleOAuthCallbackWithVerifierParams) =>
		pipe(
			// Step 1: Extract required parameters and validate state
			O.Do,
			O.apS("code", params.code),
			O.apS("state", params.state),
			O.apS("storedState", params.storedState),
			O.apS("codeVerifier", params.codeVerifier),
			O.filter(({ state, storedState }) => state === storedState),
			RTE.fromOption(() =>
				createCodeError({
					code: "invalid-state",
					message: "Missing or mismatched state parameter",
				}),
			), // Converts missing/invalid state into a CodeError

			RTE.bindW("tokens", (data) =>
				// Step 2: Validate the authorization code
				RTE.fromTaskEither(
					TE.tryCatch(
						() => constructor.validateAuthorizationCode(data),
						(error) =>
							createCodeError({
								code: "invalid-auth-code",
								message: "Authorization code validation failed",
								cause: error,
							}),
					),
				),
			),

			RTE.bindW("oauthUser", (data) =>
				// Step 3: Fetch oauth user info
				RTE.fromEither(
					zodValidate(
						z.object({
							accountProviderId: AccountProviderId,
							userName: UserName,
							userEmail: UserEmail,
						}),
						constructor.getOAuthUser(data),
					),
				),
			),

			RTE.chainW(({ oauthUser }) =>
				pipe(
					createUserWithProvider({
						userEmail: oauthUser.userEmail,
						userName: oauthUser.userName,
						accountProviderId: oauthUser.accountProviderId,
						accountProvider: constructor.accountProvider,
					}),
				),
			),
		);

export const handleGithubOAuthCallback = flow(
	handleOAuthCallback({
		validateAuthorizationCode: ({ code }) =>
			github.validateAuthorizationCode(code),
		fetchOAuthUser: ({ tokens }) =>
			fetch("https://api.github.com/user", {
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`,
				},
			})
				.then((res) => res.json())
				.then((data) => ({
					userEmail: data.email,
					userName: data.login,
					accountProviderId: data.id,
				})),
		accountProvider: "github",
	}),
);

export const getGithubOAuthUrl = () =>
	pipe(
		RT.Do,
		RT.apS("state", RT.of(generateState())),
		RT.bind("url", (data) =>
			RT.of(github.createAuthorizationURL(data.state, [])),
		),
	);

export const handleGoogleOAuthCallback = flow(
	handleOAuthCallbackWithVerifier({
		validateAuthorizationCode: ({ code, codeVerifier }) =>
			google.validateAuthorizationCode(code, codeVerifier),
		getOAuthUser: ({ tokens }) => {
			const claims = decodeIdToken(tokens.idToken()) as unknown as {
				sub: string;
				name: string;
				email: string;
			};
			const googleUserId = claims.sub;
			const username = claims.name;
			const email = claims.email;

			return {
				accountProviderId: googleUserId,
				userName: username,
				userEmail: email,
			};
		},
		accountProvider: "google",
	}),
);

export const getGoogleOAuthUrl = () =>
	pipe(
		RT.Do,
		RT.apS("state", RT.of(generateState())),
		RT.apS("codeVerifier", RT.of(generateCodeVerifier())),
		RT.bind("url", (data) =>
			RT.of(
				google.createAuthorizationURL(data.state, data.codeVerifier, [
					"openid",
					"profile",
				]),
			),
		),
	);
