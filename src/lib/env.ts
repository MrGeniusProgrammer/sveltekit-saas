import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { PUBLIC_BASE_URL_PORT } from "$env/static/public";
import { z } from "zod";

export const env = createEnv({
	server: {
		// Database
		DATABASE_URL: z.string().min(1).url(),
		DATABASE_PASSWORD: z.string().min(1),
		DATABASE_USER: z.string().min(1),
		DATABASE_HOST: z.string().min(1),
		DATABASE_NAME: z.string().min(1),
		DATABASE_PORT: z.coerce.number(),

		// Supabase
		SUPABASE_SERVICE_ROLE: z.string().min(1),

		// LemonSqueezy
		LEMONSQUEEZY_API_KEY: z.string().min(1),
		LEMONSQUEEZY_STORE_ID: z.string().min(1),
		LEMONSQUEEZY_WEBHOOK_SECRET: z.string().min(1),

		// Github
		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),

		// Google
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),

		// SMTP or mail server
		SMTP_AUTH_USER: z.string().min(1),
		SMTP_AUTH_PASSWORD: z.string().min(1),
		SMTP_HOST: z.string().min(1),
		SMTP_SERVICE: z.string().min(1),
		SMTP_PORT: z.coerce.number(),
		SMTP_FROM_USERNAME: z.string().min(1),
		SMTP_FROM_EMAIL: z.string().min(1).email(),

		NODE_ENV: z.enum(["development", "production", "preview"]),
	},

	clientPrefix: "PUBLIC_",
	client: {
		// Supabase
		PUBLIC_SUPABASE_PROJECT_ID: z.string().min(1),
		PUBLIC_SUPABASE_PROJECT_URL: z.string().min(1).url(),
		PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

		PUBLIC_BASE_URL: z.string().min(1).url(),
		PUBLIC_BASE_URL_PORT: z.coerce.number(),
		PUBLIC_BASE_URL_DOMAIN: z.string().min(1),
	},

	runtimeEnv: process.env,

	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * In order to solve these issues, we recommend that all new projects
	 * explicitly specify this option as true.
	 */
	emptyStringAsUndefined: true,
});
