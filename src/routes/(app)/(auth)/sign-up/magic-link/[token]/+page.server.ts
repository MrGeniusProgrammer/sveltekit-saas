import { formAction } from "@/helpers/actions";
import { effectReaderTaskEither, runEither } from "@/helpers/fp-ts";
import { logger } from "@/helpers/logger";
import { pipe, RTE } from "@/packages/fp-ts";
import { setSessionTokenCookie } from "@/server/auth";
import {
	signUpWithMagicLink,
	verifyMagicLinkToken,
} from "@/server/use-cases/auth";
import { error, fail } from "@sveltejs/kit";
import type { Action, PageServerLoad } from "./$types";
import { formSchema } from "./schema";

export const prerender = false;

export const load: PageServerLoad = (event) =>
	pipe(
		verifyMagicLinkToken({ token: event.params.token }),
		RTE.mapError((codeError) => {
			switch (codeError.code) {
				case "jwt-verifying-failed":
					return error(403, { message: codeError.message });

				default:
					return error(500, { message: codeError.message });
			}
		}),
		RTE.map((userEmail) => ({ userEmail })),
	)({ logger })().then(runEither);

export const actions: Record<string, Action> = {
	"sign-up-with-magic-link": (event) =>
		pipe(
			formAction({
				schema: formSchema,
				event,
			}),
			RTE.tap((data) =>
				pipe(
					signUpWithMagicLink({
						token: event.params.token,
						userName: data.form.data.userName,
					}),
					RTE.mapLeft((codeError) => {
						switch (codeError.code) {
							case "jwt-verifying-failed":
								return fail(403, {
									message: codeError.message,
								});

							default:
								return fail(500, {
									message: codeError.message,
								});
						}
					}),
					effectReaderTaskEither((data) => {
						setSessionTokenCookie({
							event,
							sessionToken: data.sessionToken,
							sessionExpiresAt: data.session.expiresAt,
						});
					}),
				),
			),
		)({ logger })().then(runEither),
};
