import { PaymentCheckoutUrl, PaymentVariantId } from "@/entities/payment";
import type { UserEmail, UserId, UserName } from "@/entities/user";
import { env } from "@/server/env";
import { type AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import { zodValidate } from "@/helpers/schema";
import { pipe, RTE, TE } from "@/packages/fp-ts";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { configureLemonSqueezy } from "../lemonsqueezy";
import {
	createDataAccessLogger,
	createDataAcessError,
	logDataAccessQuery,
	logDataAccessSchema,
} from "./common";

interface CreatePaymentCheckoutUrlParams {
	userId: UserId;
	userEmail: UserEmail;
	userName: UserName;
	variantId: PaymentVariantId;

	redirectUrl: string;
	thankYouNote: string;
}

export const createPaymentCheckoutUrl = (
	params: CreatePaymentCheckoutUrlParams,
) => {
	configureLemonSqueezy();

	return pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.map((context) => ({
			logger: createDataAccessLogger(
				context.logger,
				"CREATE PAYMENT CHECKOUT URL",
			),
		})),
		RTE.chainTaskEitherKW((context) =>
			pipe(
				TE.tryCatch(
					() =>
						createCheckout(
							env.LEMONSQUEEZY_STORE_ID,
							params.variantId,
							{
								checkoutOptions: {
									embed: false,
									media: false,
									logo: false,
								},
								checkoutData: {
									email: params.userEmail,
									name: params.userName,
									custom: {
										user_id: params.userId,
									},
								},
								productOptions: {
									enabledVariants: [params.variantId],
									redirectUrl: params.redirectUrl,
									receiptThankYouNote: params.thankYouNote,
								},
							},
						),
					createDataAcessError,
				),
				logDataAccessQuery(context.logger),
				TE.chainW((value) =>
					value.error
						? TE.left(
								createCodeError({
									code: "create-checkout-error",
									cause: value.error,
									message: value.error.message,
								}),
							)
						: TE.right(value.data.data.attributes.url),
				),
				TE.chainEitherKW((url) =>
					pipe(
						zodValidate(PaymentCheckoutUrl, url),
						logDataAccessSchema(context.logger),
					),
				),
			),
		),
	);
};
