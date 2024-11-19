import { pipe, TE } from "@/packages/fp-ts";
import { fail, type RequestEvent } from "@sveltejs/kit";
import type { z } from "zod";
import type { AppLoggerContext } from "./app";
import { validateForm } from "./form";

interface FormActionParams<S extends z.ZodSchema> {
	schema: S;
	event: RequestEvent;
}

export const formAction =
	<S extends z.ZodSchema>(params: FormActionParams<S>) =>
	(context: AppLoggerContext) =>
		pipe(
			validateForm(params.event.request, params.schema),
			TE.bindTo("form"),
			TE.tap(({ form }) =>
				TE.fromIO(() => {
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
			),
			TE.chainFirstW(({ form }) =>
				!form.valid ? TE.left(fail(400, { form })) : TE.right(null),
			),
		);
