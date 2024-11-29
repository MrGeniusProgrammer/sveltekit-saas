import { runEither } from "@/helpers/fp-ts";
import { logger } from "@/helpers/logger";
import { pipe, RTE } from "@/packages/fp-ts";
import { setSessionTokenCookie } from "@/server/auth";
import { signInWithMagicLinkToken } from "@/server/use-cases/auth";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = (event) =>
	pipe(
		signInWithMagicLinkToken({ token: event.params.token }),
		RTE.mapError((codeError) => {
			switch (codeError.code) {
				case "jwt-verifying-failed":
					return new Response(
						JSON.stringify({ message: codeError.message }),
						{ status: 403 },
					);

				default:
					return new Response(
						JSON.stringify({ message: codeError.message }),
						{ status: 500 },
					);
			}
		}),
		RTE.map((data) => {
			setSessionTokenCookie({
				event,
				sessionToken: data.sessionToken,
				sessionExpiresAt: data.session.expiresAt,
			});

			return new Response("Succesfully signed with magic link", {
				status: 302,
				headers: {
					Location: "/",
				},
			});
		}),
	)({ logger })().then(runEither);
