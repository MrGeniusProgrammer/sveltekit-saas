import { O, pipe, RTE } from "@/packages/fp-ts";
import { setSessionTokenCookie } from "@/server/auth";
import { handleGoogleOAuthCallback } from "@/server/use-cases/auth";
import type { RequestEvent } from "./$types";

export const GET = (event: RequestEvent) =>
	pipe(
		handleGoogleOAuthCallback({
			code: O.fromNullable(event.url.searchParams.get("code")),
			state: O.fromNullable(event.url.searchParams.get("state")),
			storedState: O.fromNullable(
				event.cookies.get("google_oauth_state"),
			),
			codeVerifier: O.fromNullable(
				event.cookies.get("google_code_verifier"),
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
