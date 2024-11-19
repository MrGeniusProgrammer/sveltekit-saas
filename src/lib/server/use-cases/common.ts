import type pino from "pino";

export const createUseCaseLogger = (logger: pino.Logger, name: string) =>
	logger.child({}, { msgPrefix: `[USE CASE ${name}]: ` });
