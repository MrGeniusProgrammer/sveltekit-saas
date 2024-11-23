import { pipe, RT } from "@/packages/fp-ts";
import { setOauthCookie } from "@/server/auth";
import { getGoogleOAuthUrl } from "@/server/use-cases/auth";
import type { RequestEvent } from "./$types";

export const GET = (event: RequestEvent) =>
	pipe(
		getGoogleOAuthUrl(),
		RT.map((data) => {
			setOauthCookie({
				name: "google_oauth_state",
				value: data.state,
				event,
			});

			setOauthCookie({
				name: "google_code_verifier",
				value: data.codeVerifier,
				event,
			});

			return new Response(null, {
				status: 302,
				headers: { Location: data.url.toString() },
			});
		}),
	);
