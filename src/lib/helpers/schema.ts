import { E, pipe, TE, type Either, type TaskEither } from "@/packages/fp-ts";
import type { ZodError, ZodType } from "zod";
import { createCodeError } from "./error";

export const createValidationError = <T extends ZodError>(error: T) =>
	createCodeError({
		code: "schema-validation-error",
		message: "Schema validation failed",
		cause: error,
	});

export const zodValidate = <T>(
	schema: ZodType<T>,
	input: unknown,
): Either<ReturnType<typeof createValidationError<ZodError<T>>>, T> => {
	const result = schema.safeParse(input);
	return result.success
		? E.right(result.data)
		: E.left(createValidationError(result.error));
};

export const zodValidateAsync = <T>(
	schema: ZodType<T>,
	input: unknown,
): TaskEither<ReturnType<typeof createValidationError<ZodError<T>>>, T> =>
	pipe(
		TE.of(schema.safeParse(input)),
		TE.chainW((result) =>
			result.success
				? TE.right(result.data)
				: TE.left(createValidationError(result.error)),
		),
	);
