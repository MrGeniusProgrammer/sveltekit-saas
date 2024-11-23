import { pipe, RTE } from "@/packages/fp-ts";
import { fail, type RequestEvent } from "@sveltejs/kit";
import type { z } from "zod";
import type { AppLoggerContext } from "./app";
import { validateForm } from "./form";
import { effectReaderTaskEither } from "./fp-ts";

interface FormActionParams<S extends z.ZodSchema> {
	schema: S;
	event: RequestEvent;
}

export const formAction = <S extends z.ZodSchema>(
	params: FormActionParams<S>,
) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				RTE.fromTaskEither(
					validateForm(params.event.request, params.schema),
				),
				RTE.bindTo("form"),
				effectReaderTaskEither(({ form }) => {
					context.logger.info("Form successfully posted");
					if (!form.valid) {
						context.logger.info(
							form.errors,
							"Form Validation Errors",
						);
					} else {
						context.logger.setBindings({
							formId: form.id,
							formData: form.data,
						});
						context.logger.info("Form validated");
					}
				}),
				RTE.tap(({ form }) =>
					!form.valid
						? RTE.left(fail(400, { form }))
						: RTE.right(null),
				),
			),
		),
	);
