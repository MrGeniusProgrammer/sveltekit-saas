import { env } from "@/env";
import { logger } from "@/helpers/logger";
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export const configureLemonSqueezy = () => {
	lemonSqueezySetup({
		apiKey: env.LEMONSQUEEZY_API_KEY,
		onError: (error) => {
			logger.fatal(error, `Lemon Squeezy API error: ${error.message}`);
			throw new Error(`Lemon Squeezy API error: ${error.message}`);
		},
	});
};
