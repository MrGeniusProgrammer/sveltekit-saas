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
	type AccountTokenType
} from '@/entities/account';
import type { UserId } from '@/entities/user';
import { zodValidate } from '@/helpers/schema';
import { O, pipe, TE } from '@/packages/fp-ts';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { accounts } from '../db/schema';
import { createDataAcessError } from './types';

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
		TE.tryCatch(() => db.insert(accounts).values(params).returning(), createDataAcessError),
		TE.chainEitherKW((value) => zodValidate(Account, value[0]))
	);

interface GetAccountByProviderAndIdParams {
	provider: AccountProvider;
	providerId: AccountProviderId;
}

export const getAccountByProviderAndId = (params: GetAccountByProviderAndIdParams) =>
	pipe(
		TE.tryCatch(
			() =>
				db
					.select()
					.from(accounts)
					.where(
						and(eq(accounts.provider, params.provider), eq(accounts.providerId, params.providerId))
					),
			createDataAcessError
		),
		TE.chainEitherKW((value) => zodValidate(Account.array(), value)),
		TE.map((value) => O.fromNullable(value[0]))
	);
