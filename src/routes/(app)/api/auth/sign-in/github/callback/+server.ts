import { O, pipe, RTE } from "@/packages/fp-ts";
import { setSessionTokenCookie } from "@/server/auth";
import { handleGithubOAuthCallback } from "@/server/use-cases/auth";
import type { RequestEvent } from "./$types";

export const GET = (event: RequestEvent) =>
	pipe(
		handleGithubOAuthCallback({
			code: O.fromNullable(event.url.searchParams.get("code")),
			state: O.fromNullable(event.url.searchParams.get("state")),
			storedState: O.fromNullable(
				event.cookies.get("github_oauth_state"),
			),
		}),
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
	);
