import {
	E,
	pipe,
	RTE,
	TE,
	type Either,
	type ReaderTaskEither,
} from '@/packages/fp-ts';
import type { TaskEither } from 'fp-ts/lib/TaskEither';

export const effectTaskEitherBoth =
	<E, A>(onError: (e: E) => void, onSucces: (a: A) => void) =>
	(fa: TaskEither<E, A>): TaskEither<E, A> =>
		pipe(fa, effectTaskEitherError(onError), effectTaskEither(onSucces));

export const effectTaskEither =
	<A>(fn: (a: A) => void) =>
	<E>(fa: TaskEither<E, A>): TaskEither<E, A> =>
		pipe(
			fa,
			TE.tap((value) => TE.fromIO(() => fn(value))),
		);

export const effectTaskEitherError =
	<E>(fn: (a: E) => void) =>
	<A>(fa: TaskEither<E, A>): TaskEither<E, A> =>
		pipe(
			fa,
			TE.tapError((value) => TE.fromIO(() => fn(value))),
		);

export const effectReaderTaskEitherBoth =
	<E, A>(onError: (e: E) => void, onSucces: (a: A) => void) =>
	<R>(fa: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, A> =>
		pipe(
			fa,
			effectReaderTaskEitherError(onError),
			effectReaderTaskEither(onSucces),
		);

export const effectReaderTaskEither =
	<A>(fn: (a: A) => void) =>
	<E, R>(fa: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, A> =>
		pipe(
			fa,
			RTE.tap((value) => RTE.fromIO(() => fn(value))),
		);

export const effectReaderTaskEitherError =
	<E>(fn: (a: E) => void) =>
	<A, R>(fa: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, A> =>
		pipe(
			fa,
			RTE.tapError((value) => RTE.fromIO(() => fn(value))),
		);

export const effectEitherBoth =
	<E, A>(onError: (e: E) => void, onSucces: (a: A) => void) =>
	(fa: Either<E, A>): Either<E, A> =>
		pipe(fa, effectEitherError(onError), effectEither(onSucces));

export const effectEither =
	<A>(fn: (a: A) => void) =>
	<E>(fa: Either<E, A>): Either<E, A> =>
		pipe(
			fa,
			E.map((value) => {
				fn(value);
				return value;
			}),
		);

export const effectEitherError =
	<E>(fn: (a: E) => void) =>
	<A>(fa: Either<E, A>): Either<E, A> =>
		pipe(
			fa,
			E.mapLeft((value) => {
				fn(value);
				return value;
			}),
		);
