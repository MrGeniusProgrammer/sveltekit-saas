import { runEither } from "@/helpers/fp-ts";
import { logger } from "@/helpers/logger";
import { O, pipe, RTE, sequenceS } from "@/packages/fp-ts";
import { setSessionTokenCookie } from "@/server/auth";
import { handleGithubOAuthCallback } from "@/server/use-cases/auth";
import type { RequestEvent } from "./$types";

export const GET = (event: RequestEvent) =>
	pipe(
		sequenceS(O.Apply)({
			code: O.fromNullable(event.url.searchParams.get("code")),
			state: O.fromNullable(event.url.searchParams.get("state")),
			storedState: O.fromNullable(
				event.cookies.get("github_oauth_state"),
			),
		}),
		handleGithubOAuthCallback,
		RTE.mapError(
			(error) =>
				new Response(error.message, {
					status: 500,
				}),
		),
		RTE.map((data) => {
			setSessionTokenCookie({
				sessionToken: data.sessionToken,
				sessionExpiresAt: data.session.expiresAt,
				event,
			});

			return new Response(null, {
				status: 302,
				headers: {
					Location: "/",
				},
			});
		}),
	)({ logger })().then(runEither);
