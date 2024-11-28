import { AccountProvider, AccountProviderId } from "@/entities/account";
import { UserEmail, UserImage, UserName } from "@/entities/user";
import { env } from "@/env";
import { type AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import {
	effectReaderTaskEither,
	effectReaderTaskEitherBoth,
	effectReaderTaskEitherError,
} from "@/helpers/fp-ts";
import { getLogErrorMessage, getLogSuccessMessage } from "@/helpers/logger";
import { zodValidate } from "@/helpers/schema";
import { O, pipe, RT, RTE, TE, type Option } from "@/packages/fp-ts";
import {
	decodeIdToken,
	generateCodeVerifier,
	generateState,
	GitHub,
	Google,
	type OAuth2Tokens,
} from "arctic";
import { z } from "zod";
import {
	createAccount,
	getAccountByProviderAndId,
} from "../data-access/account";
import { createUseCaseLogger } from "./common";
import { createSession, generateSessionToken } from "./session";
import { createUser } from "./user";

export const github = new GitHub(
	env.GITHUB_CLIENT_ID,
	env.GITHUB_CLIENT_SECRET,
	`${env.PUBLIC_BASE_URL}/api/auth/sign-in/github/callback`,
);

export const google = new Google(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	`${env.PUBLIC_BASE_URL}/api/auth/sign-in/google/callback`,
);

interface CreateUserWithProviderParams {
	accountProvider: AccountProvider;
	accountProviderId: AccountProviderId;
	userName: UserName;
	userEmail: UserEmail;
	userImage?: UserImage;
}

export const createUserWithProvider = (params: CreateUserWithProviderParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.map((context) => ({
			logger: createUseCaseLogger(
				context.logger,
				"CREATE USER WITH PROVIDER",
			),
		})),
		RTE.chainW((context) =>
			pipe(
				getAccountByProviderAndId({
					provider: params.accountProvider,
					providerId: params.accountProviderId,
				}),
				effectReaderTaskEitherError((error) =>
					context.logger.error(
						error,
						getLogErrorMessage(
							"Getting account by provider and id",
						),
					),
				),
				RTE.chainW((optionalAccount) =>
					pipe(
						optionalAccount,
						O.foldW(
							() =>
								pipe(
									RTE.fromIO(() =>
										context.logger.info(
											"No such user provider found",
										),
									),
									RTE.chainW(() =>
										pipe(
											createUser({
												userName: params.userName,
												userEmail: params.userEmail,
												userImage: params.userImage,
											}),
											effectReaderTaskEitherBoth(
												(error) =>
													context.logger.error(
														error,
														getLogErrorMessage(
															"Creating user",
														),
													),
												(value) =>
													context.logger.info(
														value,
														getLogErrorMessage(
															"Creating user",
														),
													),
											),
										),
									),
									RTE.chainW((user) =>
										pipe(
											createAccount({
												providerId:
													params.accountProviderId,
												provider:
													params.accountProvider,
												userId: user.id,
											}),
											effectReaderTaskEitherBoth(
												(error) =>
													context.logger.error(
														error,
														getLogErrorMessage(
															"Creating user account",
														),
													),
												(value) =>
													context.logger.info(
														value,
														getLogErrorMessage(
															"Creating user account",
														),
													),
											),
										),
									),
								),
							(value) =>
								pipe(
									RTE.of(value),
									effectReaderTaskEither((value) =>
										context.logger.info(
											value,
											getLogSuccessMessage(
												"Getting account by provider and id",
											),
										),
									),
								),
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

				RTE.local(() => context),
			),
		),
	);

interface HandleOAuthCallbackContructor<T extends Record<string, unknown>> {
	validateAuthorizationCode: (
		params: T & {
			code: string;
			state: string;
		},
	) => Promise<OAuth2Tokens>;
	fetchOAuthUser: (
		params: T & {
			code: string;
			state: string;
			tokens: OAuth2Tokens;
		},
	) => Promise<{
		accountProviderId: AccountProviderId;
		userName: UserName;
		userEmail: UserEmail;
		userImage?: UserImage;
	}>;
	accountProvider: AccountProvider;
}

export const handleOAuthCallback =
	<T extends Record<string, unknown>>(
		constructor: HandleOAuthCallbackContructor<T>,
	) =>
	(
		data: Option<
			T & {
				storedState: string;
				state: string;
				code: string;
			}
		>,
	) =>
		pipe(
			RTE.ask<AppLoggerContext>(),
			RTE.map((context) => ({
				logger: createUseCaseLogger(
					context.logger,
					"HANDLE OAUTH CALLBACK",
				),
			})),
			RTE.chainW((context) =>
				pipe(
					data,

					O.filter(({ state, storedState }) => state === storedState),
					RTE.fromOption(() =>
						createCodeError({
							code: "invalid-state",
							message: "Missing or mismatched state parameter",
						}),
					),

					effectReaderTaskEitherBoth(
						(error) =>
							context.logger.error(
								error,
								getLogErrorMessage("Checking valid state"),
							),
						(value) =>
							context.logger.info(
								value,
								getLogSuccessMessage("Checking valid state"),
							),
					),

					RTE.chainW((data) =>
						pipe(
							// Step 2: Validate the authorization code
							RTE.fromTaskEither(
								TE.tryCatch(
									() =>
										constructor.validateAuthorizationCode(
											data,
										),
									(error) =>
										createCodeError({
											code: "invalid-auth-code",
											message:
												"Authorization code validation failed",
											cause: error,
										}),
								),
							),

							effectReaderTaskEitherBoth(
								(error) =>
									context.logger.error(
										error,
										getLogErrorMessage(
											"Validating authorization code",
										),
									),
								(value) =>
									context.logger.info(
										value,
										getLogSuccessMessage(
											"Validating authorization code",
										),
									),
							),

							RTE.map((tokens) => ({ tokens, ...data })),
						),
					),

					RTE.chainW((data) =>
						// Step 3: Fetch oauth user info
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

							effectReaderTaskEitherBoth(
								(error) =>
									context.logger.error(
										error,
										getLogErrorMessage(
											"Fetching OAuth user info",
										),
									),
								(value) =>
									context.logger.info(
										value,
										getLogSuccessMessage(
											"Fetching OAuth user info",
										),
									),
							),

							RTE.chainEitherKW((data) =>
								zodValidate(
									z.object({
										accountProviderId: AccountProviderId,
										userName: UserName,
										userEmail: UserEmail,
										userImage: UserImage,
									}),
									data,
								),
							),
						),
					),

					RTE.chainW((oauthUser) =>
						pipe(
							createUserWithProvider({
								...oauthUser,
								accountProvider: constructor.accountProvider,
							}),
						),
					),
					RTE.local(() => context),
				),
			),
		);

export const handleGithubOAuthCallback = handleOAuthCallback({
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
				userImage: data.avatar_url,
				accountProviderId: data.id,
			})),
	accountProvider: "github",
});

export const getGithubOAuthUrl = () =>
	pipe(
		RT.Do,
		RT.apS("state", RT.of(generateState())),
		RT.bind("url", (data) =>
			RT.of(github.createAuthorizationURL(data.state, ["user:email"])),
		),
	);

export const handleGoogleOAuthCallback = handleOAuthCallback<{
	codeVerifier: string;
}>({
	validateAuthorizationCode: ({ code, codeVerifier }) =>
		google.validateAuthorizationCode(code, codeVerifier),
	fetchOAuthUser: async ({ tokens }) => {
		const data = decodeIdToken(tokens.idToken()) as unknown as {
			sub: string;
			name: string;
			email: string;
			picture: string;
		};

		return {
			accountProviderId: data.sub,
			userName: data.name,
			userEmail: data.email,
			userImage: data.picture,
		};
	},
	accountProvider: "google",
});

export const getGoogleOAuthUrl = () =>
	pipe(
		RT.Do,
		RT.apS("state", RT.of(generateState())),
		RT.apS("codeVerifier", RT.of(generateCodeVerifier())),
		RT.bind("url", (data) =>
			RT.of(
				google.createAuthorizationURL(data.state, data.codeVerifier, [
					"openid",
					"email",
					"profile",
				]),
			),
		),
	);
