import { db } from '@/server/db';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

async function main() {
	await migrate(db, { migrationsFolder: 'drizzle' });
	await db.$client.end();
}

main().then(() => process.exit());
