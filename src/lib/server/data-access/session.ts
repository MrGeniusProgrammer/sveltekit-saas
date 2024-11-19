import {
	Session,
	type SessionExpiresAt,
	type SessionId,
} from "@/entities/session";
import { User, type UserId } from "@/entities/user";
import type { AppLoggerContext } from "@/helpers/app";
import { zodValidate } from "@/helpers/schema";
import { O, pipe, RTE, TE } from "@/packages/fp-ts";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import {
	createDataAccessLogger,
	createDataAcessError,
	logDataAccessQuery,
	logDataAccessSchema,
} from "./common";

interface CreateSessionParams {
	userId: UserId;
	id: SessionId;
	expiresAt: SessionExpiresAt;
}

export const createSession = (params: CreateSessionParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.local((context: AppLoggerContext) => ({
			logger: createDataAccessLogger(context.logger, "CREATE SESSION"),
		})),
		RTE.chainTaskEitherKW((context) =>
			pipe(
				TE.tryCatch(
					() => db.insert(sessions).values(params).returning(),
					createDataAcessError,
				),
				logDataAccessQuery(context.logger),
				TE.chainEitherKW((data) =>
					pipe(
						zodValidate(Session, data[0]),
						logDataAccessSchema(context.logger),
					),
				),
			),
		),
	);

interface GetUserSessionByIdParams {
	id: SessionId;
}

export const getUserSessionById = (params: GetUserSessionByIdParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.local((context: AppLoggerContext) => ({
			logger: createDataAccessLogger(
				context.logger,
				"GET USER SESSION BY ID",
			),
		})),
		RTE.chainTaskEitherKW((context) =>
			pipe(
				TE.tryCatch(
					() =>
						db
							.select({ user: users, session: sessions })
							.from(sessions)
							.innerJoin(users, eq(users.id, sessions.userId))
							.where(eq(sessions.id, params.id)),
					createDataAcessError,
				),
				logDataAccessQuery(context.logger),
				TE.chainEitherKW((data) =>
					pipe(
						zodValidate(
							z.array(z.object({ user: User, session: Session })),
							data,
						),
						logDataAccessSchema(context.logger),
					),
				),
				TE.map((value) => O.fromNullable(value[0])),
			),
		),
	);

interface DeleteSessionByIdParams {
	id: SessionId;
}

export const deleteSessionById = (params: DeleteSessionByIdParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.local((context: AppLoggerContext) => ({
			logger: createDataAccessLogger(
				context.logger,
				"DELETE SESSION BY ID",
			),
		})),
		RTE.chainTaskEitherKW((context) =>
			pipe(
				TE.tryCatch(
					() =>
						db
							.delete(sessions)
							.where(eq(sessions.id, params.id))
							.returning(),
					createDataAcessError,
				),
				logDataAccessQuery(context.logger),
				TE.chainEitherKW((sessions) =>
					pipe(
						zodValidate(Session, sessions[0]),
						logDataAccessSchema(context.logger),
					),
				),
			),
		),
	);

interface UpdateSessionByIdParams {
	id: SessionId;
	userId?: UserId;
	expiresAt?: SessionExpiresAt;
}

export const updateSessionById = (params: UpdateSessionByIdParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.local((context: AppLoggerContext) => ({
			logger: createDataAccessLogger(
				context.logger,
				"UPDATE SESSION BY ID",
			),
		})),
		RTE.chainTaskEitherKW((context) =>
			pipe(
				TE.tryCatch(
					() =>
						db
							.update(sessions)
							.set(params)
							.where(eq(sessions.id, params.id))
							.returning(),
					createDataAcessError,
				),
				logDataAccessQuery(context.logger),
				TE.chainEitherKW((data) =>
					pipe(
						zodValidate(Session, data[0]),
						logDataAccessSchema(context.logger),
					),
				),
			),
		),
	);
