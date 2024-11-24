import {
	E,
	isLeft,
	pipe,
	R,
	RE,
	RTE,
	TE,
	type Either,
	type Reader,
	type ReaderEither,
	type ReaderTaskEither,
	type TaskEither,
} from "@/packages/fp-ts";

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

export const effectReaderEitherBoth =
	<E, A>(onError: (e: E) => void, onSucces: (a: A) => void) =>
	<R>(fa: ReaderEither<R, E, A>): ReaderEither<R, E, A> =>
		pipe(
			fa,
			effectReaderEitherError(onError),
			effectReaderEither(onSucces),
		);

export const effectReaderEither =
	<A>(fn: (a: A) => void) =>
	<E, R>(fa: ReaderEither<R, E, A>): ReaderEither<R, E, A> =>
		pipe(
			fa,
			RE.tap((value) => RE.right(fn(value))),
		);

export const effectReaderEitherError =
	<E>(fn: (a: E) => void) =>
	<A, R>(fa: ReaderEither<R, E, A>): ReaderEither<R, E, A> =>
		pipe(
			fa,
			RE.tapError((value) => RE.right(fn(value))),
		);

export const effectReader =
	<A>(fn: (a: A) => void) =>
	<R>(fa: Reader<R, A>): Reader<R, A> =>
		pipe(
			fa,
			R.tap((value) => R.of(fn(value))),
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

export const runEither = <E, A>(value: Either<E, A>) => {
	if (isLeft(value)) {
		return value.left;
	} else {
		return value.right;
	}
};
