import { building } from "$app/environment";
import { PUBLIC_LOG_LEVEL } from "$env/static/public";
import pino from "pino";
import { effectTaskEitherBoth } from "./fp-ts";

const rootLogger = pino({
	level: PUBLIC_LOG_LEVEL,
	browser: {
		disabled: globalThis.window === undefined,
	},
	transport: !building
		? {
				target: "pino-pretty",
			}
		: undefined,
	redact: [
		"*.password",
		"*.hashedPassword",
		"*.passwordHash",
		"*.session.id",
		"password",
		"passwordHash",
		"hashedPassword",
		"*.oldPassword",
		"*.newPassword",
		"oldPassword",
		"newPassword",
	],
	nestedKey: "payload",
});

export const getLogSuccessMessage = (message: string) => `${message} succeeded`;
export const getLogErrorMessage = (message: string) => `${message} failed`;

export const simpleLogTaskEitherBoth = (message: string) =>
	effectTaskEitherBoth(
		(value) => rootLogger.error(value, getLogErrorMessage(message)),
		(value) => rootLogger.info(value, getLogSuccessMessage(message)),
	);

export { rootLogger as logger };
