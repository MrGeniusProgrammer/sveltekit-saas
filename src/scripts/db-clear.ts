import { createCodeError } from "@/helpers/error";
import { effectTaskEitherBoth } from "@/helpers/fp-ts";
import {
	getLogErrorMessage,
	getLogSuccessMessage,
	logger,
	simpleLogTaskEitherBoth,
} from "@/helpers/logger";
import { E, pipe, TE } from "@/packages/fp-ts";
import { db } from "@/server/db";
import { sql } from "drizzle-orm";

const createDatabaseError = (error: unknown) =>
	createCodeError({
		code: "database-operation-error",
		message: "Failed at doing operation on the Database",
		cause: error,
	});

const main = pipe(
	TE.fromEither(
		db._.schema
			? E.right(null)
			: E.left(
					createCodeError({
						code: "schema-not-loaded",
						message: "Database Schema is not loaded",
					}),
				),
	),
	simpleLogTaskEitherBoth("Loading Schema"),
	TE.chainW(() =>
		pipe(
			TE.tryCatch(
				() =>
					db.execute(
						sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`),
					),
				createDatabaseError,
			),
			simpleLogTaskEitherBoth("Droping schema 'drizzle'"),
		),
	),
	TE.chainW(() =>
		pipe(
			TE.tryCatch(
				() => db.execute(sql.raw(`DROP SCHEMA public CASCADE;`)),
				createDatabaseError,
			),
			simpleLogTaskEitherBoth("Droping schema 'public'"),
		),
	),
	TE.chainW(() =>
		pipe(
			TE.tryCatch(
				() => db.execute(sql.raw(`CREATE SCHEMA public;`)),
				createDatabaseError,
			),
			simpleLogTaskEitherBoth("Creating schema 'public'"),
		),
	),
	TE.chainW(() =>
		pipe(
			TE.tryCatch(
				() =>
					db.execute(
						sql.raw(`GRANT ALL ON SCHEMA public TO postgres;`),
					),
				createDatabaseError,
			),
			simpleLogTaskEitherBoth(
				"Granting all permisions of schema 'public' to the user 'postgres'",
			),
		),
	),
	TE.chainW(() =>
		pipe(
			TE.tryCatch(
				() =>
					db.execute(
						sql.raw(`GRANT ALL ON SCHEMA public TO public;`),
					),
				createDatabaseError,
			),
			simpleLogTaskEitherBoth(
				"Granting all permisions of schema 'public' to the user 'public'",
			),
		),
	),
	TE.chainW(() =>
		pipe(
			TE.tryCatch(
				() =>
					db.execute(
						sql.raw(
							`COMMENT ON SCHEMA public IS 'standard public schema';`,
						),
					),
				createDatabaseError,
			),
			simpleLogTaskEitherBoth(
				"Checking if schema 'public' is 'standar public schema'",
			),
		),
	),
	TE.chainW(() =>
		pipe(
			TE.tryCatch(
				() => db.$client.end(),
				(error) =>
					createCodeError({
						code: "postgress-close-failed",
						message: "Postgress Connection is not closed",
						cause: error,
					}),
			),
			effectTaskEitherBoth(
				(error) =>
					logger.fatal(
						error,
						getLogSuccessMessage("Closing database client"),
					),
				() =>
					logger.info(getLogErrorMessage("Closing database client")),
			),
		),
	),
);

main().then(() => process.exit());
