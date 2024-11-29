import { formAction } from "@/helpers/actions";
import { runEither } from "@/helpers/fp-ts";
import { logger } from "@/helpers/logger";
import { pipe, RTE } from "@/packages/fp-ts";
import { signInWithMagicLink } from "@/server/use-cases/auth";
import type { Action } from "@sveltejs/kit";
import { formSchema } from "./schema";

export const actions: Record<string, Action> = {
	"sign-in": (event) =>
		pipe(
			formAction({
				schema: formSchema,
				event,
			}),
			RTE.tap((data) =>
				pipe(
					signInWithMagicLink(data.form.data),
					RTE.map((data) => data.isSigninUp),
				),
			),
		)({ logger: logger })().then(runEither),
};
