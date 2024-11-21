import type { SessionExpiresAt } from "@/entities/session";
import { createCodeError } from "@/helpers/error";
import { O, pipe, RTE, T, TE } from "@/packages/fp-ts";
import type { RequestEvent } from "@sveltejs/kit";
import { generateState } from "arctic";
import {
	createAccount,
	getAccountByProviderAndId,
} from "./data-access/account";
import { createGithubAuthorizationUrl, github } from "./use-cases/auth";
import { createSession, generateSessionToken } from "./use-cases/session";
import { createUser } from "./use-cases/user";

interface SetSessionTokenCookieParams {
	event: RequestEvent;
	sessionToken: string;
	sessionExpiresAt: SessionExpiresAt;
}

export function setSessionTokenCookie(params: SetSessionTokenCookieParams) {
	params.event.cookies.set("session", params.sessionToken, {
		httpOnly: true,
		sameSite: "lax",
		expires: params.sessionExpiresAt,
		path: "/",
	});
}

interface DeleteSessionTokenCookieParams {
	event: RequestEvent;
}

export function deleteSessionTokenCookie(
	params: DeleteSessionTokenCookieParams,
) {
	params.event.cookies.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 0,
		path: "/",
	});
}

interface GetSessionTokenCookieParams {
	event: RequestEvent;
}

export function getSessionTokenCookie(params: GetSessionTokenCookieParams) {
	return params.event.cookies.get("session");
}

interface SetOauthStateParams {
	event: RequestEvent;
	name: string;
	state: string;
}

export const setOauthState = (params: SetOauthStateParams) => {
	params.event.cookies.set(params.name, params.state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	});
};

interface HandleGithubOauthParams {
	event: RequestEvent;
}

export const handleGithubOauth = (params: HandleGithubOauthParams) =>
	pipe(
		T.Do,
		T.apS("state", T.of(generateState())),
		T.bind("url", (data) => T.of(createGithubAuthorizationUrl(data))),
		T.tap(({ state }) =>
			TE.of(
				setOauthState({
					event: params.event,
					state,
					name: "github_oauth_state",
				}),
			),
		),
		T.map(
			({ url }) =>
				new Response(null, {
					status: 302,
					headers: {
						Location: url.toString(),
					},
				}),
		),
	);

interface HandleGithubOauthCallbackParams {
	event: RequestEvent;
}

export const handleGithubOauthCallback = (
	params: HandleGithubOauthCallbackParams,
) =>
	pipe(
		// Step 1: Extract required parameters and validate state
		O.Do,
		O.apS(
			"code",
			O.fromNullable(params.event.url.searchParams.get("code")),
		),
		O.apS(
			"state",
			O.fromNullable(params.event.url.searchParams.get("state")),
		),
		O.apS(
			"storedState",
			O.fromNullable(params.event.cookies.get("github_oauth_state")),
		),
		O.filter(({ state, storedState }) => state === storedState),
		RTE.fromOption(() =>
			createCodeError({
				code: "invalid-state",
				message: "Missing or mismatched state parameter",
			}),
		), // Converts missing/invalid state into a CodeError

		RTE.chainTaskEitherKW(({ code }) =>
			// Step 2: Validate the authorization code
			pipe(
				TE.tryCatch(
					() => github.validateAuthorizationCode(code),
					(error) =>
						createCodeError({
							code: "invalid-auth-code",
							message: "Authorization code validation failed",
							cause: error,
						}),
				),
			),
		),

		RTE.chainTaskEitherKW((tokens) =>
			// Step 3: Fetch GitHub user info
			pipe(
				TE.tryCatch(
					() =>
						fetch("https://api.github.com/user", {
							headers: {
								Authorization: `Bearer ${tokens.accessToken()}`,
							},
						}).then((res) => res.json()),
					(error) =>
						createCodeError({
							code: "fetch-oauth-user-failed",
							message: "Failed to fetch user info from GitHub",
							cause: error,
						}),
				),
				TE.map((githubUser) => ({
					githubUserId: githubUser.id,
					githubUsername: githubUser.login,
					tokens,
				})),
			),
		),

		RTE.chainW(({ githubUserId, githubUsername, tokens }) =>
			// Step 4: Find or create user in the database
			pipe(
				getAccountByProviderAndId({
					provider: "github",
					providerId: githubUserId,
				}),
				RTE.chainW((optionalAccount) =>
					pipe(
						optionalAccount,
						O.foldW(
							() =>
								pipe(
									createUser({
										userName: githubUsername,
										userEmail: githubUsername,
									}),
									RTE.chainW((user) =>
										createAccount({
											providerId: githubUserId,
											provider: "github",
											userId: user.id,
										}),
									),
								),
							RTE.of,
						),
					),
				),
				RTE.map((account) => ({ account, tokens })),
			),
		),

		RTE.chainW(({ account }) =>
			// Step 5: Create session and set cookie
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
				RTE.tap(({ sessionToken, session }) =>
					RTE.of(
						setSessionTokenCookie({
							event: params.event,
							sessionToken: sessionToken,
							sessionExpiresAt: session.expiresAt,
						}),
					),
				),
			),
		),
	);
