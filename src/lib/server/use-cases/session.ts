import type { SessionId } from '@/entities/session';
import type { UserId } from '@/entities/user';
import { createCodeError } from '@/helpers/error';
import { O, pipe, TE } from '@/packages/fp-ts';
import { sha256 } from '@oslojs/crypto/sha2';
import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase,
} from '@oslojs/encoding';
import {
	deleteSessionById,
	getUserSessionById,
	createSession as primitiveCreateSession,
	updateSessionById,
} from '../data-access/session';

export const generateSessionToken = () => {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
};

interface GetSessionIdFromSessionTokenParams {
	sessionToken: string;
}

export const getSessionIdFromSessionToken = (
	params: GetSessionIdFromSessionTokenParams,
) => {
	return encodeHexLowerCase(
		sha256(new TextEncoder().encode(params.sessionToken)),
	);
};

interface GenerateSessionTokenParams {
	sessionToken: string;
}

export const generateSessionId = (params: GenerateSessionTokenParams) => {
	return encodeHexLowerCase(
		sha256(new TextEncoder().encode(params.sessionToken)),
	);
};

interface CreateSessionParams {
	userId: UserId;
	sessionToken: string;
}

export const createSession = (params: CreateSessionParams) =>
	pipe(
		primitiveCreateSession({
			id: generateSessionId(params),
			userId: params.userId,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		}),
	);

interface ValidateSessionTokenParams {
	sessionToken: string;
}

export const validateSessionToken = (params: ValidateSessionTokenParams) =>
	pipe(
		TE.of(getSessionIdFromSessionToken(params)),
		TE.chainW((sessionId) => getUserSessionById({ id: sessionId })),
		TE.chainW((optionalUserSession) =>
			pipe(
				optionalUserSession,
				O.foldW(
					() =>
						TE.left(
							createCodeError({
								code: 'session-not-found',
								message: 'Session not found',
							}),
						),
					(userSession) => TE.right(userSession),
				),
			),
		),
		TE.chainW((userSession) => {
			if (Date.now() >= userSession.session.expiresAt.getTime()) {
				return pipe(
					invalidateSession({
						sessionId: userSession.session.id,
					}),
					TE.chainW(() =>
						TE.left(
							createCodeError({
								code: 'session-expired',
								message: 'Session expired',
							}),
						),
					),
				);
			}

			return TE.right(userSession);
		}),
		TE.chainW((userSession) => {
			if (
				Date.now() >=
				userSession.session.expiresAt.getTime() -
					1000 * 60 * 60 * 24 * 15
			) {
				return pipe(
					updateSessionById({
						id: userSession.session.id,
						expiresAt: new Date(
							Date.now() + 1000 * 60 * 60 * 24 * 30,
						),
					}),
					TE.map(() => userSession),
				);
			}

			return TE.right(userSession);
		}),
	);

interface InvalidateSessionParams {
	sessionId: SessionId;
}

export const invalidateSession = (params: InvalidateSessionParams) =>
	pipe(deleteSessionById({ id: params.sessionId }));
