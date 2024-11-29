import { MagicLinkCode, SignUpWithMagicLink, WelcomeUser } from "@/emails";
import type { UserEmail, UserImage, UserName } from "@/entities/user";
import { type AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import { renderEmail } from "@/helpers/render";
import { E, pipe, RTE } from "@/packages/fp-ts";
import { createDataAccessLogger } from "./common";

interface GetWelcomeUserEmailParams {
	userName: UserName;
	userEmail: UserEmail;
	userImage: UserImage;
}

export const getWelcomeUserEmail = (params: GetWelcomeUserEmailParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.map((context) => ({
			logger: createDataAccessLogger(
				context.logger,
				"GET WELCOME USER EMAIL HTML",
			),
		})),
		RTE.chainEitherKW((context) =>
			pipe(
				E.tryCatch(
					() => renderEmail(WelcomeUser, params),
					(error) =>
						createCodeError({
							code: "data-access-failed",
							cause: error,
						}),
				),
				E.map((data) => ({
					...data,
					subject: `Welcome to Saas starter kit ${params.userName}`,
				})),
			),
		),
	);

interface GetMagicLinkCodeEmailParams {
	token: string;
}

export const getMagicLinkCodeEmail = (params: GetMagicLinkCodeEmailParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainEitherKW((context) =>
			pipe(
				E.tryCatch(
					() => renderEmail(MagicLinkCode, params),
					(error) =>
						createCodeError({
							code: "data-access-failed",
							cause: error,
						}),
				),
				E.map((data) => ({
					...data,
					subject: "Your magic link",
				})),
			),
		),
	);

interface GetSignUpWithMagicLinkEmailParams {
	token: string;
}

export const getSignUpWithMagicLinkEmail = (
	params: GetSignUpWithMagicLinkEmailParams,
) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainEitherKW((context) =>
			pipe(
				E.tryCatch(
					() => renderEmail(SignUpWithMagicLink, params),
					(error) =>
						createCodeError({
							code: "data-access-failed",
							cause: error,
						}),
				),
				E.map((data) => ({
					...data,
					subject: "Your magic sign up link",
				})),
			),
		),
	);
