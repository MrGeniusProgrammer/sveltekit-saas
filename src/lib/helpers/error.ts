interface CreateCodeErrorParams<C extends string, M extends string, D, O> {
	code: C;
	message?: M;
	details?: D;
	cause?: O;
}

export const createCodeError = <C extends string, M extends string, D, O>(
	params: CreateCodeErrorParams<C, M, D, O>,
) =>
	({
		code: params.code,
		message: params.message ?? "An error occurred", // Default message if not provided
		details: params.details,
		stack: new Error(params.message).stack,
		cause: params.cause,
	}) as CodeError<C, M, D, O>;

export type CodeError<
	C extends string = any,
	M extends string = any,
	D extends unknown = any,
	O extends unknown = any,
> = {
	code: C;
	message: M;
	details: D;
	stack: string | undefined;
	cause: O;
};
