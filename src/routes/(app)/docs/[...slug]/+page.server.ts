import type { AppLoggerContext } from "@/helpers/app";
import { getAllContentsModules, getContent } from "@/helpers/content";
import { runEither } from "@/helpers/fp-ts";
import { logger } from "@/helpers/logger";
import { pipe, RTE } from "@/packages/fp-ts";
import { error } from "@sveltejs/kit";
import type { EntryGenerator, PageServerLoad } from "./$types";

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
				RTE.mapError(() => error(400)),
				RTE.map((modules) => {
					const entries: { slug: string }[] = [];
					for (const path of Object.keys(modules)) {
						const slug = path
							.replace("/src/content/", "")
							.replace(".md", "")
							.replace("/index", "");
						entries.push({ slug });
					}
					return entries;
				}),
			),
		),
	)({ logger: logger })().then(runEither);
