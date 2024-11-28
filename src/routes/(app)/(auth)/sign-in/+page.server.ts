import { formAction } from "@/helpers/actions";
import { runEither } from "@/helpers/fp-ts";
import { logger } from "@/helpers/logger";
import { pipe } from "@/packages/fp-ts";
import type { Action } from "@sveltejs/kit";
import { formSchema } from "./schema";

export const actions: Record<string, Action> = {
	"sign-in": (event) =>
		pipe(
			formAction({
				schema: formSchema,
				event,
			}),
		)({ logger: logger })().then(runEither),
};
