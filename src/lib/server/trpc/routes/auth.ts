import { AccountProvider } from "@/entities/account";
import type { AppLoggerContext } from "@/helpers/app";
import {
	effectReaderTaskEither,
	effectReaderTaskEitherBoth,
	runEither,
} from "@/helpers/fp-ts";
import {
	getLogErrorMessage,
	getLogSuccessMessage,
	logger,
} from "@/helpers/logger";
import { pipe, RT, RTE } from "@/packages/fp-ts";
import { deleteSessionTokenCookie, setOauthCookie } from "@/server/auth";
import { getGithubOAuthUrl, getGoogleOAuthUrl } from "@/server/use-cases/auth";
import { invalidateSession } from "@/server/use-cases/session";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedMiddleware } from "../middlewares/protected";
import { redirectAuthMiddleware } from "../middlewares/redirect-auth";
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
					RTE.mapError(
						(error) =>
							new TRPCError({
								code: "INTERNAL_SERVER_ERROR",
								message: error.message,
							}),
					),
				),
			),
		)({
			logger: logger.child({}, { msgPrefix: "[TRPC MUTATION SIGN OUT]" }),
		})().then(runEither),
	),

	signInWithAccountProvider: redirectAuthMiddleware
		.input(
			z.object({
				accountProvider: AccountProvider,
			}),
		)
		.mutation((opts) => {
			const getSelectedProvider = () => {
				switch (opts.input.accountProvider) {
					case "github":
						return pipe(
							getGithubOAuthUrl(),
							RT.map((data) => {
								setOauthCookie({
									name: "github_oauth_state",
									value: data.state,
									event: opts.ctx.event,
								});

								return data.url.toString();
							}),
						);

					case "google":
						return pipe(
							getGoogleOAuthUrl(),
							RT.map((data) => {
								setOauthCookie({
									name: "google_oauth_state",
									value: data.state,
									event: opts.ctx.event,
								});

								setOauthCookie({
									name: "google_code_verifier",
									value: data.codeVerifier,
									event: opts.ctx.event,
								});

								return data.url.toString();
							}),
						);
				}
			};

			return getSelectedProvider()({ logger: logger })();
		}),

	validateRequest: protectedMiddleware.query((opts) => opts.ctx.user),
});
