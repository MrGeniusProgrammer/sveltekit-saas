import {
	User,
	type UserEmail,
	type UserId,
	type UserImage,
	type UserName,
} from "@/entities/user";
import type { AppLoggerContext } from "@/helpers/app";
import { zodValidate } from "@/helpers/schema";
import { O, pipe, RTE, TE } from "@/packages/fp-ts";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import {
	createDataAccessLogger,
	logDataAccessQuery,
	logDataAccessSchema,
} from "./common";
import { createDataAcessError } from "./types";

interface CreateUserParams {
	id?: UserId;
	name: UserName;
	email: UserEmail;
	image?: UserImage;
}

export const createUser = (params: CreateUserParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.local((context: AppLoggerContext) => ({
			logger: createDataAccessLogger(context.logger, "CREATE USER"),
		})),
		RTE.chainTaskEitherKW((context) =>
			pipe(
				TE.tryCatch(
					() => db.insert(users).values(params).returning(),
					createDataAcessError,
				),
				logDataAccessQuery(context.logger),
				TE.chainEitherKW((data) =>
					pipe(
						zodValidate(User, data[0]),
						logDataAccessSchema(context.logger),
					),
				),
			),
		),
	);

interface GetUserByEmailParams {
	email: UserEmail;
}

export const getUserByEmail = (params: GetUserByEmailParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.local((context: AppLoggerContext) => ({
			logger: createDataAccessLogger(context.logger, "GET USER BY EMAIL"),
		})),
		RTE.chainTaskEitherKW((context) =>
			pipe(
				TE.tryCatch(
					() =>
						db
							.selectDistinct()
							.from(users)
							.where(eq(users.email, params.email)),
					createDataAcessError,
				),
				logDataAccessQuery(context.logger),
				TE.chainEitherKW((users) =>
					pipe(
						zodValidate(z.array(User), users),
						logDataAccessSchema(context.logger),
					),
				),
				TE.map((users) => O.fromNullable(users[0])),
			),
		),
	);
