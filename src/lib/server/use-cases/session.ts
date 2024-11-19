import type { SessionId, SessionToken } from "@/entities/session";
import type { UserId } from "@/entities/user";
import type { AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import {
	effectReader,
	effectReaderTaskEitherBoth,
	effectReaderTaskEitherError,
} from "@/helpers/fp-ts";
import { getLogErrorMessage, getLogSuccessMessage } from "@/helpers/logger";
import { O, pipe, R, RTE, TE } from "@/packages/fp-ts";
import { sha256 } from "@oslojs/crypto/sha2";
import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase,
} from "@oslojs/encoding";
import {
	deleteSessionById,
	getUserSessionById,
	createSession as primitiveCreateSession,
	updateSessionById,
} from "../data-access/session";
import { createUseCaseLogger } from "./common";

export const generateSessionToken = () =>
	pipe(
		R.ask<AppLoggerContext>(),
		R.local((context: AppLoggerContext) => ({
			logger: createUseCaseLogger(
				context.logger,
				"GENERATE SESSION TOKEN",
			),
		})),
		R.chainW((context) =>
			pipe(
				R.of(new Uint8Array(20)),
				R.tap((bytes) => TE.of(crypto.getRandomValues(bytes))),
				effectReader((bytes) =>
					context.logger.info(bytes, "Generated random bytes"),
				),
				R.map((bytes) => encodeBase32LowerCaseNoPadding(bytes)),
				effectReader((token) =>
					context.logger.info(token, "Generated base32 string"),
				),
			),
		),
	);

interface GetSessionIdFromSessionTokenParams {
	sessionToken: SessionToken;
}

export const getSessionIdFromSessionToken = (
	params: GetSessionIdFromSessionTokenParams,
) =>
	pipe(
		R.ask<AppLoggerContext>(),
		R.local((context: AppLoggerContext) => ({
			logger: createUseCaseLogger(
				context.logger,
				"GET SESSION ID FROM SESSION TOKEN",
			),
		})),
		R.chainW((context) =>
			pipe(
				R.of(new TextEncoder().encode(params.sessionToken)),
				effectReader((encoded) =>
					context.logger.info(encoded, "Encoded session token"),
				),
				R.map((encoded) => encodeHexLowerCase(sha256(encoded))),
				effectReader((value) =>
					context.logger.info(
						value,
						"Got Session Id from Session token",
					),
				),
			),
		),
	);

interface CreateSessionParams {
	userId: UserId;
	sessionToken: string;
}

export const createSession = (params: CreateSessionParams) =>
	RTE.local((context: AppLoggerContext) => ({
		logger: createUseCaseLogger(context.logger, "CREATE SESSION"),
	}))(
		pipe(
			RTE.ask<AppLoggerContext>(),
			RTE.chainW((context) =>
				pipe(
					RTE.fromReader(getSessionIdFromSessionToken(params)),
					RTE.chainW((sessionId) =>
						pipe(
							primitiveCreateSession({
								id: sessionId,
								userId: params.userId,
								expiresAt: new Date(
									Date.now() + 1000 * 60 * 60 * 24 * 30,
								),
							}),
							effectReaderTaskEitherBoth(
								(error) =>
									context.logger.error(
										error,
										getLogErrorMessage("Creating session"),
									),
								(value) =>
									context.logger.info(
										value,
										getLogSuccessMessage(
											"Creating session",
										),
									),
							),
						),
					),
				),
			),
		),
	);

interface ValidateSessionTokenParams {
	sessionToken: SessionToken;
}

export const validateSessionToken = (params: ValidateSessionTokenParams) =>
	RTE.local((context: AppLoggerContext) => ({
		logger: createUseCaseLogger(context.logger, "VALIDATE SESSION TOKEN"),
	}))(
		pipe(
			RTE.ask<AppLoggerContext>(),
			RTE.chainW((context) =>
				pipe(
					RTE.fromReader(getSessionIdFromSessionToken(params)),
					RTE.chainW((sessionId) =>
						pipe(
							getUserSessionById({ id: sessionId }),
							effectReaderTaskEitherBoth(
								(error) =>
									context.logger.error(
										error,
										getLogErrorMessage(
											"Getting user session by id",
										),
									),
								(value) =>
									context.logger.info(
										value,
										getLogSuccessMessage(
											"Getting user session by id",
										),
									),
							),
						),
					),
					RTE.chainW((optionalUserSession) =>
						pipe(
							optionalUserSession,
							O.matchW(
								() =>
									RTE.left(
										createCodeError({
											code: "session-not-found",
											message: "Session not found",
										}),
									),
								(userSession) => RTE.right(userSession),
							),
						),
					),
					RTE.chainW((userSession) => {
						if (
							Date.now() >=
							userSession.session.expiresAt.getTime()
						) {
							return pipe(
								invalidateSession({
									sessionId: userSession.session.id,
								}),
								effectReaderTaskEitherBoth(
									(error) =>
										context.logger.error(
											error,
											getLogErrorMessage(
												"Invalidating session",
											),
										),
									(value) =>
										context.logger.info(
											value,
											getLogSuccessMessage(
												"Invalidating session",
											),
										),
								),
								RTE.chainW(() =>
									pipe(
										RTE.left(
											createCodeError({
												code: "session-expired",
												message: "Session expired",
											}),
										),
										effectReaderTaskEitherError((error) =>
											context.logger.error(
												error,
												"Session expired",
											),
										),
									),
								),
							);
						}

						return RTE.right(userSession);
					}),
					RTE.chainW((userSession) => {
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
								effectReaderTaskEitherBoth(
									(error) =>
										context.logger.error(
											error,
											getLogErrorMessage(
												"Updating session by id",
											),
										),
									(value) =>
										context.logger.info(
											value,
											getLogSuccessMessage(
												"Updating session by id",
											),
										),
								),
								RTE.map(() => userSession),
							);
						}

						return RTE.right(userSession);
					}),
				),
			),
		),
	);

interface InvalidateSessionParams {
	sessionId: SessionId;
}

export const invalidateSession = (params: InvalidateSessionParams) =>
	RTE.local((context: AppLoggerContext) => ({
		logger: createUseCaseLogger(context.logger, "INVALIDATE SESSION"),
	}))(
		pipe(
			RTE.ask<AppLoggerContext>(),
			RTE.chainW((context) =>
				pipe(
					deleteSessionById({ id: params.sessionId }),
					effectReaderTaskEitherBoth(
						(error) =>
							context.logger.error(
								error,
								getLogErrorMessage("Deleting session by id"),
							),
						(value) =>
							context.logger.info(
								value,
								getLogSuccessMessage("Deleting session by id"),
							),
					),
				),
			),
		),
	);
