import { ResetPassword, WelcomeUser } from "@/emails";
import type { UserName } from "@/entities/user";
import { type AppLoggerContext } from "@/helpers/app";
import { pipe, R } from "@/packages/fp-ts";
import { render } from "svelte/server";
import { createDataAccessLogger } from "./common";

interface GetWelcomeUserEmailParams {
	userName: UserName;
}

export const getWelcomeUserEmail = (params: GetWelcomeUserEmailParams) =>
	pipe(
		R.ask<AppLoggerContext>(),
		R.map((context) => ({
			logger: createDataAccessLogger(
				context.logger,
				"GET WELCOME USER EMAIL HTML",
			),
		})),
		R.chainW((context) =>
			R.of({
				html: render(WelcomeUser).body,
				subject: `Welcome to Saas starter kit ${params.userName}`,
			}),
		),
	);

export const getResetPasswordEmail = () =>
	pipe(
		R.ask<AppLoggerContext>(),
		R.map((context) => ({
			logger: createDataAccessLogger(
				context.logger,
				"GET RESET PASSWORD EMAIL HTML",
			),
		})),
		R.chainW((context) =>
			R.of({
				html: render(ResetPassword).body,
				subject: "Welcome to Saas starter kit",
			}),
		),
	);
