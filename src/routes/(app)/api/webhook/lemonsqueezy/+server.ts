import { env } from "@/server/env";
import { logger } from "@/helpers/logger";
import { processPaymentWebhookPayload } from "@/server/use-cases/payment";
import type { RequestHandler } from "@sveltejs/kit";
import { whatwgWebhooksHandler } from "lemonsqueezy-webhooks";

export const POST: RequestHandler = (event) =>
	whatwgWebhooksHandler({
		secret: env.LEMONSQUEEZY_WEBHOOK_SECRET,
		request: event.request,
		onData: (payload) => processPaymentWebhookPayload({ payload }),
		onError(error) {
			logger.error(error, "Errored when processing payment request");
		},
	});
