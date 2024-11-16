import { env } from '@/env';
import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';

let db: PostgresJsDatabase<typeof schema>;
let client: ReturnType<typeof postgres>;

declare const global: { db?: PostgresJsDatabase<typeof schema> };

if (env.NODE_ENV === 'production') {
	client = postgres(env.DATABASE_URL, { prepare: false });
	db = drizzle({ client, schema, casing: 'snake_case' });
} else {
	if (!global.db!) {
		client = postgres(env.DATABASE_URL, { prepare: false });
		global.db = drizzle({ client, schema, casing: 'snake_case' });
	}
	db = global.db;
}

export { db };
