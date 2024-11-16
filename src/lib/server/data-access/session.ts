import { Session, type SessionExpiresAt, type SessionId } from '@/entities/session';
import { User, type UserId } from '@/entities/user';
import { zodValidate } from '@/helpers/schema';
import { O, pipe, TE } from '@/packages/fp-ts';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { sessions, users } from '../db/schema';
import { createDataAcessError } from './types';

interface CreateSessionParams {
	userId: UserId;
	id: SessionId;
	expiresAt: SessionExpiresAt;
}

export const createSession = (params: CreateSessionParams) =>
	pipe(
		TE.tryCatch(() => db.insert(sessions).values(params).returning(), createDataAcessError),
		TE.map((value) => value[0]),
		TE.chainEitherKW((data) => zodValidate(Session, data))
	);

interface GetUserSessionByIdParams {
	id: SessionId;
}

export const getUserSessionById = (params: GetUserSessionByIdParams) =>
	pipe(
		TE.tryCatch(
			() =>
				db
					.select({ user: users, session: sessions })
					.from(sessions)
					.innerJoin(users, eq(users.id, sessions.userId))
					.where(eq(sessions.id, params.id)),
			createDataAcessError
		),
		TE.chainEitherKW((data) =>
			zodValidate(z.array(z.object({ user: User, session: Session })), data)
		),
		TE.map((value) => O.fromNullable(value[0]))
	);

interface DeleteSessionByIdParams {
	id: SessionId;
}

export const deleteSessionById = (params: DeleteSessionByIdParams) =>
	pipe(
		TE.tryCatch(() => db.delete(sessions).where(eq(sessions.id, params.id)), createDataAcessError)
	);

interface UpdateSessionByIdParams {
	id: SessionId;
	userId?: UserId;
	expiresAt?: SessionExpiresAt;
}

export const updateSessionById = (params: UpdateSessionByIdParams) =>
	pipe(
		TE.tryCatch(
			() => db.update(sessions).set(params).where(eq(sessions.id, params.id)).returning(),
			createDataAcessError
		),
		TE.map((value) => value[0]),
		TE.chainEitherKW((data) => zodValidate(Session, data))
	);
