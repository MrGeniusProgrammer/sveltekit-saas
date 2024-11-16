import { UserCredits, UserEmail, type UserName } from '@/entities/user';
import { createCodeError } from '@/helpers/error';
import { O, pipe, TE } from '@/packages/fp-ts';
import {
	getUserByEmail,
	createUser as primtiveCreateUser,
} from '../data-access/user';

interface CheckIsUserEmailAlreadyExistsParams {
	userEmail: UserEmail;
}

export const checkIsUserEmailAlreadyExists = (
	params: CheckIsUserEmailAlreadyExistsParams,
) =>
	pipe(
		// check the email exists or not
		getUserByEmail({ email: params.userEmail }),
		TE.chainW((optionUser) =>
			pipe(
				optionUser,
				O.fold(
					() => TE.right(params),
					() =>
						TE.left(
							createCodeError({
								code: 'user-email-already-exist',
								message: 'The User email already exists',
								cause: { email: params.userEmail },
							}),
						),
				),
			),
		),
	);

interface CreateUserParams {
	userName: UserName;
	userEmail: UserEmail;
	userCredits: UserCredits;
}

export const createUser = (params: CreateUserParams) =>
	pipe(
		// check the email exists or not
		checkIsUserEmailAlreadyExists(params),

		// Create the user
		TE.chainW(() =>
			primtiveCreateUser({
				name: params.userName,
				email: params.userEmail,
				credits: params.userCredits,
			}),
		),
	);
