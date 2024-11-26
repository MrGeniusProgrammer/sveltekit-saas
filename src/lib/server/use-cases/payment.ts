import type { UserId } from "@/entities/user";
import type { DiscriminatedWebhookPayload } from "lemonsqueezy-webhooks";
import { configureLemonSqueezy } from "../lemonsqueezy";

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
