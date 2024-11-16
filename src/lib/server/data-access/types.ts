import { createCodeError } from '@/helpers/error';

export const createDataAcessError = <D>(error: unknown, details?: D) =>
	createCodeError({
		code: 'data-acces-failed',
		message: 'Error while executing queries to the Database',
		cause: error,
		details: details
	});
