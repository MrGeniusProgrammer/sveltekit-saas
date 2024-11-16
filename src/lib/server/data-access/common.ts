import { createCodeError } from '@/helpers/error';
import { effectEitherBoth, effectTaskEitherBoth } from '@/helpers/fp-ts';
import { getLogErrorMessage, getLogSuccessMessage } from '@/helpers/logger';
import { pipe, type Either, type TaskEither } from '@/packages/fp-ts';
import type pino from 'pino';

export const createDataAcessError = <D>(error: unknown, details?: D) =>
	createCodeError({
		code: 'data-acces-failed',
		message: 'Error while executing queries to the Database',
		cause: error,
		details: details,
	});

export const createDataAccessLogger = (logger: pino.Logger, name: string) =>
	logger.child({}, { msgPrefix: `[DATA ACCESS ${name}]: ` });

export const logDataAccessQuery =
	(logger: pino.Logger) =>
	<E, A>(a: TaskEither<E, A>) =>
		pipe(
			a,
			effectTaskEitherBoth(
				(value) =>
					logger.fatal(
						value,
						getLogErrorMessage('Database query execution'),
					),
				(value) =>
					logger.info(
						value,
						getLogSuccessMessage('Database query execution'),
					),
			),
		);

export const logDataAccessSchema =
	(logger: pino.Logger) =>
	<E, A>(a: Either<E, A>) =>
		pipe(
			a,
			effectEitherBoth(
				(value) =>
					logger.fatal(
						value,
						getLogErrorMessage(
							'Entity validate agains database result',
						),
					),
				(value) =>
					logger.info(
						value,
						getLogSuccessMessage(
							'Entity validate agains database result',
						),
					),
			),
		);
