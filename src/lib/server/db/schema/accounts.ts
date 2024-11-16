import {
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const accounts = pgTable(
	'accounts',
	{
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		provider: text().notNull(),
		providerId: text().notNull(),
		refreshToken: text(),
		accessToken: text(),
		expiresAt: integer(),
		tokenType: text(),
		scope: text(),
		idToken: text(),
		sessionState: text(),
		createdAt: timestamp({ mode: 'date', withTimezone: true }).defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.provider, table.providerId] })],
);
