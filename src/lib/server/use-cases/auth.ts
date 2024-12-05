import { AccountProvider, AccountProviderId } from "@/entities/account";
import { UserEmail, UserId, UserImage, UserName } from "@/entities/user";
import { type AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import {
	effectReaderTaskEither,
	effectReaderTaskEitherBoth,
	effectReaderTaskEitherError,
} from "@/helpers/fp-ts";
import { getLogErrorMessage, getLogSuccessMessage } from "@/helpers/logger";
import { zodValidate } from "@/helpers/schema";
import { E, O, pipe, RT, RTE, TE, type Option } from "@/packages/fp-ts";
import { env } from "@/server/env";
import {
	decodeIdToken,
	generateCodeVerifier,
	generateState,
	GitHub,
	Google,
	type OAuth2Tokens,
} from "arctic";
import jwt from "jsonwebtoken";
import {
	createAccount,
	getAccountByProviderAndId,
} from "../data-access/account";
import {
	getMagicLinkCodeEmail,
	getSignUpWithMagicLinkEmail,
	getWelcomeUserEmail,
} from "../data-access/email";
import {
	createUser as createUserPrimitive,
	getUserByEmail as getUserByEmailPrimitve,
} from "../data-access/user";
import { createUseCaseLogger } from "./common";
import { sendEmail } from "./email";
import { createSession, generateSessionToken } from "./session";
import { createUser, getUserByEmail } from "./user";

interface CreateAuthSessionParams {
	userId: UserId;
}

export const createAuthSession = (params: CreateAuthSessionParams) =>
	pipe(
		RTE.Do,
		RTE.apSW("sessionToken", RTE.fromReader(generateSessionToken())),
		RTE.bindW("session", ({ sessionToken }) =>
			createSession({
				sessionToken,
				userId: params.userId,
			}),
		),
	);

interface VerifyMagicLinkTokenParams {
	token: string;
}

export const verifyMagicLinkToken = (params: VerifyMagicLinkTokenParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW(() =>
			pipe(
				RTE.fromEither(
					E.tryCatch(
						() =>
							jwt.verify(params.token, env.SECRET, {
								maxAge: 60 * 5,
							}) as unknown as { data: string },
						(error) =>
							createCodeError({
								code: "jwt-verifying-failed",
								cause: error,
								message: "JWT Verifying failed",
							}),
					),
				),
				RTE.chainEitherKW((data) => zodValidate(UserEmail, data.data)),
			),
		),
	);

interface SignMagicLinkParams {
	userEmail: UserEmail;
}

export const signMagicLink = (params: SignMagicLinkParams) =>
	pipe(
		RTE.fromEither(
			E.tryCatch(
				() =>
					jwt.sign({ data: params.userEmail }, env.SECRET, {
						expiresIn: 60 * 5,
					}),
				(error) =>
					createCodeError({
						code: "jwt-signing-failed",
						cause: error,
						message: "JWT Signing failed",
					}),
			),
		),
	);

interface SignUpWithMagicLinkParams {
	userName: UserName;
	token: string;
}

export const signUpWithMagicLink = (params: SignUpWithMagicLinkParams) =>
	pipe(
		verifyMagicLinkToken({ token: params.token }),
		RTE.chainW((userEmail) =>
			createUser({ userEmail, userName: params.userName }),
		),
		RTE.chainW((user) => createAuthSession({ userId: user.id })),
	);

interface SignInWithMagicLinkTokenParams {
	token: string;
}

export const signInWithMagicLinkToken = (
	params: SignInWithMagicLinkTokenParams,
) =>
	pipe(
		verifyMagicLinkToken(params),
		RTE.chainW((userEmail) => getUserByEmail({ userEmail })),
		RTE.chainW((user) =>
			pipe(
				RTE.Do,
				RTE.apSW(
					"sessionToken",
					RTE.fromReader(generateSessionToken()),
				),
				RTE.bindW("session", ({ sessionToken }) =>
					createSession({
						sessionToken,
						userId: user.id,
					}),
				),
			),
		),
	);

interface SignInWithMagicLinkParams {
	userEmail: UserEmail;
}

export const signInWithMagicLink = (params: SignInWithMagicLinkParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				getUserByEmailPrimitve({ email: params.userEmail }),
				RTE.chainW((optionalUser) =>
					pipe(
						optionalUser,
						O.foldW(
							() =>
								pipe(
									signMagicLink(params),
									RTE.chainW((token) =>
										getSignUpWithMagicLinkEmail({ token }),
									),
									RTE.chainTaskEitherKW((data) =>
										sendEmail({
											to: params.userEmail,
											...data,
										}),
									),
									RTE.map(() => ({ isSigninUp: true })),
								),
							() =>
								pipe(
									signMagicLink(params),
									RTE.chainW((token) =>
										getMagicLinkCodeEmail({ token }),
									),
									RTE.chainTaskEitherKW((data) =>
										sendEmail({
											to: params.userEmail,
											...data,
										}),
									),
									RTE.map(() => ({ isSigninUp: false })),
								),
						),
						effectReaderTaskEitherBoth(
							(error) => context.logger.error(error),
							(value) => context.logger.info(value),
						),
					),
				),
			),
		),
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
											getUserByEmailPrimitve({
												email: params.userEmail,
											}),
											effectReaderTaskEitherBoth(
												(error) =>
													context.logger.error(
														error,
														getLogErrorMessage(
															"Getting user by email",
														),
													),
												(value) =>
													context.logger.info(
														value,
														getLogErrorMessage(
															"Getting user by email",
														),
													),
											),
											RTE.chainW((optionalUser) =>
												pipe(
													optionalUser,
													O.foldW(
														() =>
															createUserPrimitive(
																{
																	name: params.userName,
																	email: params.userEmail,
																	image: params.userImage,
																},
															),
														RTE.of,
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
					createAuthSession({ userId: account.userId }),
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
						),
					),

					RTE.chainW((oauthUser) =>
						pipe(
							createUserWithProvider({
								...oauthUser,
								accountProvider: constructor.accountProvider,
							}),
							RTE.tap(() =>
								pipe(
									getWelcomeUserEmail({
										userName: oauthUser.userName,
										userEmail: oauthUser.userEmail,
										userImage: oauthUser.userImage,
									}),
									effectReaderTaskEither((data) =>
										sendEmail({
											to: oauthUser.userEmail,
											...data,
										}),
									),
									effectReaderTaskEither(() =>
										context.logger.info(
											`Send welcome email to the user of ${oauthUser.userName}`,
										),
									),
								),
							),
						),
					),

					RTE.local(() => context),
				),
			),
		);

const github = new GitHub(
	env.GITHUB_CLIENT_ID,
	env.GITHUB_CLIENT_SECRET,
	`${env.PUBLIC_BASE_URL}/api/auth/sign-in/github/callback`,
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

const google = new Google(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	`${env.PUBLIC_BASE_URL}/api/auth/sign-in/google/callback`,
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
