import { env } from "@/env";
import { type AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import { effectReaderTaskEither } from "@/helpers/fp-ts";
import { logger } from "@/helpers/logger";
import { O, pipe, RTE, TE } from "@/packages/fp-ts";
import { configureLemonSqueezy } from "@/server/lemonsqueezy";
import { createWebhook, listWebhooks } from "@lemonsqueezy/lemonsqueezy.js";

/**
 * This action will check if a webhook exists on Lemon Squeezy. It will return
 * the webhook if it exists, otherwise it will return undefined.
 */
const hasWebhook = (webhookUrl: string) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		effectReaderTaskEither(() => configureLemonSqueezy()),
		RTE.chainW((context) =>
			pipe(
				RTE.fromTaskEither(
					TE.tryCatch(
						() =>
							listWebhooks({
								filter: { storeId: env.LEMONSQUEEZY_STORE_ID },
							}),
						(error) =>
							createCodeError({
								code: "get-list-webhooks-failed",
								cause: error,
							}),
					),
				),
				RTE.chainW((webhookResult) =>
					webhookResult.error
						? RTE.left(
								createCodeError({
									code: "get-list-webhooks-error",
									cause: webhookResult.error.cause,
									message: webhookResult.error.message,
								}),
							)
						: RTE.right(webhookResult.data),
				),
				RTE.map((value) =>
					O.fromNullable(
						value.data.find(
							(wh) =>
								wh.attributes.url === webhookUrl &&
								wh.attributes.test_mode,
						),
					),
				),
			),
		),
	);

/**
 * This action will set up a webhook on Lemon Squeezy to listen to
 * Subscription events. It will only set up the webhook if it does not exist.
 */
const setupWebhook = (webhookUrl: string) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		effectReaderTaskEither(() => configureLemonSqueezy()),
		RTE.chainW((context) =>
			pipe(
				hasWebhook(webhookUrl),
				RTE.chainW((optionalWebhook) =>
					pipe(
						optionalWebhook,
						O.foldW(
							() =>
								pipe(
									RTE.fromTaskEither(
										TE.tryCatch(
											() =>
												createWebhook(
													env.LEMONSQUEEZY_STORE_ID,
													{
														secret: env.LEMONSQUEEZY_WEBHOOK_SECRET,
														url: webhookUrl,
														testMode:
															env.NODE_ENV ===
															"development",
														events: [
															"order_created",
														],
													},
												),
											(error) =>
												createCodeError({
													code: "create-webhook-failed",
													cause: error,
												}),
										),
									),
									RTE.chainW((webhookResult) =>
										webhookResult.error
											? RTE.left(
													createCodeError({
														code: "get-list-webhooks-error",
														cause: webhookResult
															.error.cause,
														message:
															webhookResult.error
																.message,
													}),
												)
											: RTE.right(
													webhookResult.data.data,
												),
									),
								),
							RTE.of,
						),
					),
				),
			),
		),
	);

const main = setupWebhook("/api/lemonsqueezy/webhook");

main({ logger: logger })().then(() => process.exit());
