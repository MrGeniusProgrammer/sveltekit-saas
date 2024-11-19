import {
	Account,
	type AccountAccessToken,
	type AccountExpiresAt,
	type AccountIdToken,
	type AccountProvider,
	type AccountProviderId,
	type AccountRefreshToken,
	type AccountScope,
	type AccountSessionState,
	type AccountTokenType,
} from "@/entities/account";
import type { UserId } from "@/entities/user";
import { type AppLoggerContext } from "@/helpers/app";
import { zodValidate } from "@/helpers/schema";
import { O, pipe, RTE, TE } from "@/packages/fp-ts";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { accounts } from "../db/schema";
import {
	createDataAccessLogger,
	logDataAccessQuery,
	logDataAccessSchema,
} from "./common";
import { createDataAcessError } from "./types";

interface CreateAccountParams {
	userId: UserId;
	provider: AccountProvider;
	providerId: AccountProviderId;
	refreshToken?: AccountRefreshToken;
	accessToken?: AccountAccessToken;
	expiresAt?: AccountExpiresAt;
	tokenType?: AccountTokenType;
	scope?: AccountScope;
	idToken?: AccountIdToken;
	sessionState?: AccountSessionState;
}

export const createAccount = (params: CreateAccountParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.local((context: AppLoggerContext) => ({
			logger: createDataAccessLogger(context.logger, "CREATE ACCOUNT"),
		})),
		RTE.chainTaskEitherKW((context) =>
			pipe(
				TE.tryCatch(
					() => db.insert(accounts).values(params).returning(),
					createDataAcessError,
				),
				logDataAccessQuery(context.logger),
				TE.chainEitherKW((value) =>
					pipe(
						zodValidate(Account, value[0]),
						logDataAccessSchema(context.logger),
					),
				),
			),
		),
	);

interface GetAccountByProviderAndIdParams {
	provider: AccountProvider;
	providerId: AccountProviderId;
}

export const getAccountByProviderAndId = (
	params: GetAccountByProviderAndIdParams,
) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.local((context: AppLoggerContext) => ({
			logger: createDataAccessLogger(
				context.logger,
				"GET ACCOUNT BY PROVIDER AND ID",
			),
		})),
		RTE.chainTaskEitherKW((context) =>
			pipe(
				TE.tryCatch(
					() =>
						db
							.select()
							.from(accounts)
							.where(
								and(
									eq(accounts.provider, params.provider),
									eq(accounts.providerId, params.providerId),
								),
							),
					createDataAcessError,
				),
				logDataAccessQuery(context.logger),
				TE.chainEitherKW((value) =>
					pipe(
						zodValidate(Account.array(), value),
						logDataAccessSchema(context.logger),
					),
				),
				TE.map((value) => O.fromNullable(value[0])),
			),
		),
	);
