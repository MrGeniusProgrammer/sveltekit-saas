import type { AppLoggerContext } from "@/helpers/app";
import { effectReaderTaskEitherBoth, runEither } from "@/helpers/fp-ts";
import {
	getLogErrorMessage,
	getLogSuccessMessage,
	logger,
} from "@/helpers/logger";
import { pipe, RTE } from "@/packages/fp-ts";
import {
	getAllContentsEntries,
	getContentFromSlug,
} from "@/server/data-access/content";
import { error } from "@sveltejs/kit";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const load: PageServerLoad = (event) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				getContentFromSlug({ slug: event.params.slug }),
				effectReaderTaskEitherBoth(
					(error) =>
						context.logger.error(
							error,
							getLogErrorMessage("Getting content from slug"),
						),
					() =>
						context.logger.info(
							getLogSuccessMessage("Getting content from slug"),
						),
				),
				RTE.mapError(() => error(500)),
			),
		),
	)({ logger: logger, dir: `static/content` })().then(runEither);

export const entries: EntryGenerator = () =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW(() =>
			pipe(
				getAllContentsEntries(),
				RTE.mapError(() => error(500)),
			),
		),
	)({ logger: logger, dir: "static/content" })().then(runEither);
