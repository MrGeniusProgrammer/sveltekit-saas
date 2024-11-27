import { PaymentVariantId } from "@/entities/payment";
import { throwEither } from "@/helpers/fp-ts";
import { logger } from "@/helpers/logger";
import { pipe, RTE } from "@/packages/fp-ts";
import { createCheckoutUrl } from "@/server/use-cases/payment";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedMiddleware } from "../middlewares/protected";
import { router } from "../trpc";

export const payment = router({
	createCheckoutUrl: protectedMiddleware
		.input(
			z.object({
				paymentVariantId: PaymentVariantId,
			}),
		)
		.mutation((opts) =>
			pipe(
				createCheckoutUrl({
					userId: opts.ctx.user.id,
					userEmail: opts.ctx.user.email,
					userName: opts.ctx.user.name,
					...opts.input,
				}),
				RTE.mapError(
					(error) =>
						new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: error.message,
						}),
				),
			)({ logger: logger })().then(throwEither),
		),
});
