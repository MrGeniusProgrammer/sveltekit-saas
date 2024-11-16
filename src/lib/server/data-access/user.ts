import {
	User,
	UserCredits,
	type UserEmail,
	type UserId,
	type UserImage,
	type UserName
} from '@/entities/user';
import { zodValidate } from '@/helpers/schema';
import { O, pipe, TE } from '@/packages/fp-ts';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { users } from '../db/schema';
import { createDataAcessError } from './types';

interface CreateUserParams {
	id?: UserId;
	name: UserName;
	email: UserEmail;
	image?: UserImage;
	credits: UserCredits;
}

export const createUser = (params: CreateUserParams) =>
	pipe(
		TE.tryCatch(() => db.insert(users).values(params).returning(), createDataAcessError),
		TE.chainEitherKW((data) => zodValidate(User, data[0]))
	);

interface GetUserByEmailParams {
	email: UserEmail;
}

export const getUserByEmail = (params: GetUserByEmailParams) =>
	pipe(
		TE.tryCatch(
			() => db.selectDistinct().from(users).where(eq(users.email, params.email)),
			createDataAcessError
		),
		TE.chainEitherKW((users) => zodValidate(z.array(User), users)),
		TE.map((users) => O.fromNullable(users[0]))
	);

export const getAllUsers = () =>
	pipe(
		TE.tryCatch(() => db.select().from(users), createDataAcessError),
		TE.chainEitherKW((users) => zodValidate(z.array(User), users))
	);

interface GetUserByIdParams {
	id: UserId;
}

export const getUserById = (params: GetUserByIdParams) =>
	pipe(
		TE.tryCatch(() => db.select().from(users).where(eq(users.id, params.id)), createDataAcessError),
		TE.chainEitherKW((users) => zodValidate(z.array(User), users)),
		TE.map((users) => O.fromNullable(users[0]))
	);

interface UpdateUserParams {
	id: UserId;
	name?: UserName;
	email?: UserEmail;
	credits?: UserCredits;
	image?: UserImage;
}

export const updateUser = (params: UpdateUserParams) =>
	pipe(
		TE.tryCatch(
			() => db.update(users).set(params).where(eq(users.id, params.id)).returning(),
			createDataAcessError
		),
		TE.chainEitherKW((users) => zodValidate(User, users[0]))
	);
