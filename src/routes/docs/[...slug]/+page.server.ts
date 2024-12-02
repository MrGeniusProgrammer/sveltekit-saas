import type { AppLoggerContext } from "@/helpers/app";
import {
	getAllContentsModules,
	getContent,
	slugFromPath,
} from "@/helpers/content";
import { runEither } from "@/helpers/fp-ts";
import { logger } from "@/helpers/logger";
import { pipe, RTE } from "@/packages/fp-ts";
import { error } from "@sveltejs/kit";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const prerender = true;

export const load: PageServerLoad = (event) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				getContent({ slug: event.params.slug }),
				RTE.mapError(() => error(500)),
			),
		),
	)({ logger: logger })().then(runEither);

export const entries: EntryGenerator = () =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW(() =>
			pipe(
				getAllContentsModules(),
				RTE.map((modules) =>
					Object.keys(modules).map((path) => ({
						slug: slugFromPath(path),
					})),
				),
				RTE.mapError(() => error(500)),
			),
		),
	)({ logger: logger })().then(runEither);
