import 'dotenv/config';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1).url(),
		DATABASE_PASSWORD: z.string().min(1),
		DATABASE_USER: z.string().min(1),
		DATABASE_HOST: z.string().min(1),
		DATABASE_NAME: z.string().min(1),
		DATABASE_PORT: z.coerce.number(),

		NODE_ENV: z.enum(['development', 'production', 'preview']),
	},

	clientPrefix: 'PUBLIC_',
	client: {
		PUBLIC_SUPABASE_PROJECT_URL: z.string().min(1).url(),
		PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
	},

	/**
	 * Makes sure you explicitly access **all** environment variables
	 * from `server` and `client` in your `runtimeEnv`.
	 */
	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
		NODE_ENV: process.env.NODE_ENV,
		PUBLIC_SUPABASE_PROJECT_URL: process.env.PUBLIC_SUPABASE_PROJECT_URL,
		PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY,
		DATABASE_PORT: process.env.DATABASE_PORT,
		DATABASE_NAME: process.env.DATABASE_NAME,
		DATABASE_HOST: process.env.DATABASE_HOST,
		DATABASE_USER: process.env.DATABASE_USER,
	},
});
