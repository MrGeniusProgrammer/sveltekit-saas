import fs from "fs/promises";
import type { AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import { E, O, pipe, R, RTE, TE } from "@/packages/fp-ts";
import rehypeShiki from "@shikijs/rehype";
import { read } from "$app/server";
import matter from "gray-matter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeFormat from "rehype-format";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkNormalizeHeadings from "remark-normalize-headings";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import {
	effectReaderTaskEither,
	effectReaderTaskEitherBoth,
	effectReaderTaskEitherError,
} from "./fp-ts";
import { getLogErrorMessage, getLogSuccessMessage } from "./logger";
import rehypeTocJson, { type TocItem } from "./rehype-toc-json";

type Modules = Record<string, () => Promise<unknown>>;

export type Metadata = {
	title: string;
	description: string;
};

export const slugFromPath = (path: string) =>
	path.replace("/static/content/", "").replace(".md", "");

export const getAllContentsModules = () =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				RTE.fromEither(
					E.tryCatch(
						() => import.meta.glob("/static/content/**/*.md"),
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
				effectReaderTaskEitherBoth(
					(error) =>
						context.logger.error(
							error,
							getLogErrorMessage("Getting all content modules"),
						),
					(value) =>
						context.logger.info(
							value,
							getLogSuccessMessage("Getting all content modules"),
						),
				),
				RTE.chainReaderKW((modules) =>
					findMatch({ slug: params.slug, modules }),
				),
				RTE.chainW((optionalPath) =>
					pipe(
						optionalPath,
						O.foldW(
							() =>
								pipe(
									RTE.left(
										createCodeError({
											code: "processing-content-failed",
										}),
									),
									effectReaderTaskEitherError(() =>
										context.logger.error(
											"Could not find any matched content",
										),
									),
								),
							(path) =>
								pipe(
									RTE.fromIO(() =>
										context.logger.info(
											path,
											"Found a matched content path",
										),
									),
									RTE.chainTaskEitherKW(() =>
										TE.tryCatch(
											() =>
												fs.readFile(
													path.slice(1),
													"utf-8",
												),
											(error) =>
												createCodeError({
													code: "reading-content-failed",
													cause: error,
												}),
										),
									),
									effectReaderTaskEitherBoth(
										(error) =>
											context.logger.error(
												error,
												getLogErrorMessage(
													"Reading content file",
												),
											),
										(value) =>
											context.logger.info(
												value,
												getLogSuccessMessage(
													"Reading content file",
												),
											),
									),
									RTE.chainW((content) =>
										pipe(
											processContent({ content }),
											effectReaderTaskEitherBoth(
												(error) =>
													context.logger.error(
														error,
														getLogErrorMessage(
															"Processing content",
														),
													),
												(value) =>
													context.logger.info(
														value,
														getLogSuccessMessage(
															"Processing content",
														),
													),
											),
										),
									),
								),
						),
					),
				),
			),
		),
	);

export interface Content {
	html: string;
	markdown: string;
	metadata: Metadata;
	toc: TocItem[];
}

interface ProcessContentParams {
	content: string;
}

export const processContent = (params: ProcessContentParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				RTE.fromTaskEither(
					TE.tryCatch(
						async () => {
							// Read file and extract front matter
							const {
								content: markdownWithoutFrontMatter,
								data: metadata,
							} = matter(params.content);

							// Process the stripped Markdown to HTML
							const html = await unified()
								.use(remarkParse)
								.use(remarkGfm)
								.use(remarkNormalizeHeadings)
								.use(remarkRehype)
								.use(rehypeSanitize)
								.use(rehypeSlug)
								.use(rehypeAutolinkHeadings, {
									behavior: "prepend",
								})
								.use(rehypeTocJson)
								.use(rehypeShiki, {
									theme: "tokyo-night",
								})
								.use(rehypeFormat)
								.use(rehypeStringify)
								.process(markdownWithoutFrontMatter);

							return {
								html: html.value, // The HTML result
								markdown: markdownWithoutFrontMatter, // Markdown without front matter
								metadata: metadata, // Front matter as JSON
								toc: html.data.toc,
							} as Content;
						},
						(error) =>
							createCodeError({
								code: "processing-content-failed",
								cause: error,
							}),
					),
				),
			),
		),
	);

interface GenerateSearchIndexesParams {
	contents: Content[];
}

export const generateSearchIndexes = (
	params: GenerateSearchIndexesParams,
) => {};
