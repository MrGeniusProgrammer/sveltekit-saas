import type { PaymentVariantId } from "@/entities/payment";
import type { UserEmail, UserId, UserName } from "@/entities/user";
import { env } from "@/server/env";
import { type AppLoggerContext } from "@/helpers/app";
import { pipe, RTE } from "@/packages/fp-ts";
import type { DiscriminatedWebhookPayload } from "lemonsqueezy-webhooks";
import { createPaymentCheckoutUrl } from "../data-access/payment";
import { configureLemonSqueezy } from "../lemonsqueezy";
import { createUseCaseLogger } from "./common";

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

interface CreateCheckoutUrlParams {
	userId: UserId;
	userEmail: UserEmail;
	userName: UserName;
	paymentVariantId: PaymentVariantId;
}

export const createCheckoutUrl = (params: CreateCheckoutUrlParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.map((context) => ({
			logger: createUseCaseLogger(context.logger, "CREATE CHECKOUT URL"),
		})),
		RTE.chainW((context) =>
			pipe(
				createPaymentCheckoutUrl({
					variantId: params.paymentVariantId,
					userName: params.userName,
					userEmail: params.userEmail,
					userId: params.userId,
					redirectUrl: `${env.PUBLIC_BASE_URL}/`,
					thankYouNote:
						"Thank you for signing up to Sveltekit SaaS kit!",
				}),
				RTE.local(() => context),
			),
		),
	);
