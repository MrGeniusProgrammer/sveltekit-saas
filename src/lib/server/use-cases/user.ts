import { UserEmail, type UserName } from "@/entities/user";
import type { AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import { effectReaderTaskEitherBoth } from "@/helpers/fp-ts";
import { getLogErrorMessage, getLogSuccessMessage } from "@/helpers/logger";
import { O, pipe, RTE } from "@/packages/fp-ts";
import {
	getUserByEmail,
	createUser as primtiveCreateUser,
} from "../data-access/user";
import { createUseCaseLogger } from "./common";

interface CheckIsUserEmailAlreadyExistsParams {
	userEmail: UserEmail;
}

export const checkIsUserEmailAlreadyExists = (
	params: CheckIsUserEmailAlreadyExistsParams,
) =>
	RTE.local((context: AppLoggerContext) => ({
		logger: createUseCaseLogger(
			context.logger,
			"CHECK IS USER EMAIL ALREADY EXISTS",
		),
	}))(
		pipe(
			RTE.ask<AppLoggerContext>(),
			RTE.chainW((context) =>
				pipe(
					getUserByEmail({ email: params.userEmail }),
					effectReaderTaskEitherBoth(
						(error) =>
							context.logger.error(
								error,
								getLogErrorMessage("Getting user by email"),
							),
						(value) =>
							context.logger.info(
								value,
								getLogSuccessMessage("Getting user by email"),
							),
					),
					RTE.chainW((optionUser) =>
						pipe(
							optionUser,
							O.fold(
								() => RTE.right(params),
								() =>
									RTE.left(
										createCodeError({
											code: "user-email-already-exist",
											message:
												"The User email already exists",
											cause: { email: params.userEmail },
										}),
									),
							),
						),
					),
				),
			),
		),
	);

interface CreateUserParams {
	userName: UserName;
	userEmail: UserEmail;
}

export const createUser = (params: CreateUserParams) =>
	RTE.local((context: AppLoggerContext) => ({
		logger: createUseCaseLogger(
			context.logger,
			"CHECK IS USER EMAIL ALREADY EXISTS",
		),
	}))(
		pipe(
			RTE.ask<AppLoggerContext>(),
			RTE.chainW((context) =>
				pipe(
					// check the email exists or not
					checkIsUserEmailAlreadyExists(params),
					effectReaderTaskEitherBoth(
						(error) =>
							context.logger.error(
								error,
								getLogErrorMessage(
									"Checking is user email already exists",
								),
							),
						(value) =>
							context.logger.info(
								value,
								getLogSuccessMessage(
									"Checking is user email already exists",
								),
							),
					),

					// Create the user
					RTE.chainW(() =>
						pipe(
							primtiveCreateUser({
								name: params.userName,
								email: params.userEmail,
							}),
							effectReaderTaskEitherBoth(
								(error) =>
									context.logger.error(
										error,
										getLogErrorMessage("Creating user"),
									),
								(value) =>
									context.logger.info(
										value,
										getLogSuccessMessage("Creating user"),
									),
							),
						),
					),
				),
			),
		),
	);
