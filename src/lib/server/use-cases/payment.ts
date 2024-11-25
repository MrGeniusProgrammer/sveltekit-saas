import type { UserId } from "@/entities/user";
import { env } from "@/env";
import { logger } from "@/helpers/logger";
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import type { DiscriminatedWebhookPayload } from "lemonsqueezy-webhooks";

const configureLemonSqueezy = () => {
	lemonSqueezySetup({
		apiKey: env.LEMONSQUEEZY_API_KEY,
		onError: (error) => {
			logger.fatal(error, `Lemon Squeezy API error: ${error.message}`);
			throw new Error(`Lemon Squeezy API error: ${error.message}`);
		},
	});
};

interface ProcessPaymentWebhookPayloadParams {
	payload: DiscriminatedWebhookPayload<{
		user_id: UserId;
	}>;
}

export const processPaymentWebhookPayload = (
	params: ProcessPaymentWebhookPayloadParams,
) => {
	configureLemonSqueezy();

	switch (params.payload.event_name) {
		case "order_created": {
			const userId = params.payload.meta.custom_data.user_id;
		}
	}
};
