import fs from "fs/promises";
import type { AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import { effectReaderTaskEither, runEither } from "@/helpers/fp-ts";
import { logger } from "@/helpers/logger";
import { pipe, RTE, TE } from "@/packages/fp-ts";
import {
	createContentsSearchIndex,
	getAllContents,
} from "@/server/data-access/content";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const prerender = true;

export const load: LayoutServerLoad = () =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				getAllContents(),
				RTE.chainW((contents) =>
					createContentsSearchIndex({ contents }),
				),
				RTE.chainW((index) =>
					pipe(
						RTE.of({} as Record<string, unknown>),
						effectReaderTaskEither((exportedData) => {
							index.export((key, data) => {
								exportedData[key.toString()] = data;
							});
						}),
						effectReaderTaskEither((exportedData) =>
							context.logger.info(
								exportedData,
								"export content search index data",
							),
						),
						RTE.chainW((exportedData) =>
							pipe(
								RTE.fromTaskEither(
									TE.tryCatch(
										() =>
											fs.writeFile(
												"static/content/index.json",
												JSON.stringify(exportedData),
												"utf-8",
											),
										(error) =>
											createCodeError({
												code: "writing-search-index-failed",
												cause: error,
											}),
									),
								),
							),
						),
					),
				),
				RTE.mapError((codeError) => error(500, codeError.message)),
				RTE.map(() => ({ indexes: true })),
			),
		),
	)({ logger, dir: "static/content" })().then(runEither);
