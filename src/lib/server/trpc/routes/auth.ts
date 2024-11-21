import type { AppLoggerContext } from "@/helpers/app";
import {
	effectReaderTaskEither,
	effectReaderTaskEitherBoth,
} from "@/helpers/fp-ts";
import {
	getLogErrorMessage,
	getLogSuccessMessage,
	logger,
} from "@/helpers/logger";
import { pipe, RTE } from "@/packages/fp-ts";
import { deleteSessionTokenCookie } from "@/server/auth";
import { invalidateSession } from "@/server/use-cases/session";
import { TRPCError } from "@trpc/server";
import { protectedMiddleware } from "../middlewares/protected";
import { router } from "../trpc";

export const auth = router({
	signOut: protectedMiddleware.mutation((opts) =>
		pipe(
			RTE.ask<AppLoggerContext>(),
			RTE.chainW((context) =>
				pipe(
					RTE.of(deleteSessionTokenCookie({ event: opts.ctx.event })),
					effectReaderTaskEither(() =>
						context.logger.info("Deleted session token cookie"),
					),
					RTE.chainW(() =>
						invalidateSession({ sessionId: opts.ctx.session.id }),
					),
					effectReaderTaskEitherBoth(
						(error) =>
							context.logger.error(
								error,
								getLogErrorMessage("Invalidating session"),
							),
						(value) =>
							context.logger.info(
								value,
								getLogSuccessMessage("Invalidating session"),
							),
					),
					RTE.mapError((error) => {
						switch (error.code) {
							default:
								return new TRPCError({
									code: "INTERNAL_SERVER_ERROR",
								});
						}
					}),
				),
			),
		)({
			logger: logger.child({}, { msgPrefix: "[TRPC MUTATION SIGN OUT]" }),
		})(),
	),

	validateRequest: protectedMiddleware.query((opts) => opts.ctx.user),
});
