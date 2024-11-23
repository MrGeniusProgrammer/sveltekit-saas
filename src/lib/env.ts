import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1).url(),
		DATABASE_PASSWORD: z.string().min(1),
		DATABASE_USER: z.string().min(1),
		DATABASE_HOST: z.string().min(1),
		DATABASE_NAME: z.string().min(1),
		DATABASE_PORT: z.coerce.number(),

		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),

		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),

		SMTP_AUTH_USER: z.string().min(1),
		SMTP_AUTH_PASSWORD: z.string().min(1),
		SMTP_HOST: z.string().min(1),
		SMTP_PORT: z.coerce.number(),
		SMTP_FROM_USERNAME: z.string().min(1),
		SMTP_FROM_EMAIL: z.string().min(1),

		NODE_ENV: z.enum(["development", "production", "preview"]),
	},

	clientPrefix: "PUBLIC_",
	client: {
		PUBLIC_SUPABASE_PROJECT_URL: z.string().min(1).url(),
		PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
	},

	runtimeEnv: process.env,
});
