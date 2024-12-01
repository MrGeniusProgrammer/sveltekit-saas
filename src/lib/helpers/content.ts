import type { AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import { E, O, pipe, R, RTE } from "@/packages/fp-ts";
import { assets } from "$app/paths";
import { processMarkdown } from "./markdown";

type Modules = Record<string, () => Promise<unknown>>;

export type Frontmatter = {
	title: string;
	description: string;
};

export const slugFromPath = (path: string) =>
	path.replace("/src/content/", "").replace(".md", "");

export const getAllContentsModules = () =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				RTE.fromEither(
					E.tryCatch(
						() => import.meta.glob(`${assets}/content/**/*.md`),
						(error) =>
							createCodeError({
								code: "importing-content-faild",
								cause: error,
							}),
					),
				),
			),
		),
	);

interface FindMatchParams {
	modules: Modules;
	slug: string;
}

export const findMatch = (params: FindMatchParams) =>
	pipe(
		R.ask<AppLoggerContext>(),
		R.map(() =>
			O.fromNullable(
				Object.keys(params.modules).find(
					(path) => slugFromPath(path) === params.slug,
				),
			),
		),
	);

interface GetContentParams {
	slug: string;
}

export const getContent = (params: GetContentParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				getAllContentsModules(),
				RTE.chainReaderKW((modules) =>
					findMatch({ slug: params.slug, modules }),
				),
				RTE.chainW((optionalPath) =>
					pipe(
						optionalPath,
						O.foldW(
							() =>
								RTE.left(
									createCodeError({
										code: "processing-markdown-failed",
									}),
								),
							(path) => processMarkdown({ path }),
						),
					),
				),
				RTE.map((data) => ({
					...data,
					frontMatter: data.frontMatter as Frontmatter,
				})),
			),
		),
	);
