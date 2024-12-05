import { pipe, TE } from "@/packages/fp-ts";
import {
	setError,
	superValidate,
	type SuperValidated,
} from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { z } from "zod";
import { createCodeError } from "./error";

export const setFormErrorsFromZodError = <
	T extends SuperValidated<Record<string, unknown>>,
	E extends z.ZodError,
>(
	form: T,
	zodError: E,
) => {
	const flattened = zodError.flatten();
	for (const [field, fieldError] of Object.entries(flattened)) {
		setError(form, field, fieldError as unknown as Record<string, string>);
	}
};

export const validateForm = <S extends z.ZodSchema>(
	request: Request,
	schema: S,
) =>
	pipe(
		TE.tryCatch(
			() => superValidate(request, zod(schema)),
			(error) =>
				createCodeError({
					code: "form-validation-failed",
					message: "Form Validation Operation failed",
					cause: error,
				}),
		),

		TE.chainW((form) =>
			form.valid
				? TE.right(form)
				: TE.left(
						createCodeError({
							code: "form-validation-error",
							message:
								"Cannot process unrecognized form data format",
							cause: form.errors,
							details: { form },
						}),
					),
		),
	);
