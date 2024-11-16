import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { typeToFlattenedError, ZodError } from 'zod';
import type { Context } from './context';

export interface ValidationError {
	type: 'validation-error';
	data: typeToFlattenedError<ZodError>;
}

export type TrpcError = ValidationError;

export const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter(opts) {
		const { shape, error } = opts;
		const cause = error.cause as TrpcError | undefined;
		return {
			...shape,
			data: {
				...shape.data,
				cause,
			},
		};
	},
});

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
export const createCallerFactory = t.createCallerFactory;
