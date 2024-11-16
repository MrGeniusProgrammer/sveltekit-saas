import { z } from 'zod';
import { CreatedAt } from './common';
import { UserId } from './user';

export const AccountProvider = z.enum(['github', 'google']);
export type AccountProvider = typeof AccountProvider._output;

export const AccountProviderId = z.string().min(1);
export type AccountProviderId = typeof AccountProviderId._output;

export const AccountRefreshToken = z.string().nullish();
export type AccountRefreshToken = typeof AccountRefreshToken._output;

export const AccountAccessToken = z.string().nullish();
export type AccountAccessToken = typeof AccountAccessToken._output;

export const AccountExpiresAt = z.number().int().nullish();
export type AccountExpiresAt = typeof AccountExpiresAt._output;

export const AccountTokenType = z.string().nullish();
export type AccountTokenType = typeof AccountTokenType._output;

export const AccountScope = z.string().nullish();
export type AccountScope = typeof AccountScope._output;

export const AccountIdToken = z.string().nullish();
export type AccountIdToken = typeof AccountIdToken._output;

export const AccountSessionState = z.string().nullish();
export type AccountSessionState = typeof AccountSessionState._output;

export const Account = z.object({
	userId: UserId,
	provider: AccountProvider,
	providerId: AccountProviderId,
	refreshToken: AccountRefreshToken,
	accessToken: AccountAccessToken,
	expiresAt: AccountExpiresAt,
	tokenType: AccountTokenType,
	scope: AccountScope,
	idToken: AccountIdToken,
	sessionState: AccountSessionState,
	createdAt: CreatedAt,
});
export type Account = typeof Account._output;
