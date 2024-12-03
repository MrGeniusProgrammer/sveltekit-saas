import fs from "fs/promises";
import type { AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import { E, O, pipe, R, RA, RTE, sequenceT, TE } from "@/packages/fp-ts";
import rehypeShiki from "@shikijs/rehype";
import Flexsearch from "flexsearch";
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

export const getAllContentsPath = () =>
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
				RTE.map((modules) => Object.keys(modules)),
			),
		),
	);

interface FindMatchParams {
	paths: string[];
	slug: string;
}

export const findMatch = (params: FindMatchParams) =>
	pipe(
		R.ask<AppLoggerContext>(),
		R.map(() =>
			O.fromNullable(
				params.paths.find((path) => slugFromPath(path) === params.slug),
			),
		),
	);

interface GetContentFromSlugParams {
	slug: string;
}

export const getContentFromSlug = (params: GetContentFromSlugParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				getAllContentsPath(),
				effectReaderTaskEitherBoth(
					(error) =>
						context.logger.error(
							error,
							getLogErrorMessage("Getting all content paths"),
						),
					(value) =>
						context.logger.info(
							value,
							getLogSuccessMessage("Getting all content paths"),
						),
				),
				RTE.chainReaderKW((paths) =>
					findMatch({ slug: params.slug, paths }),
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
									RTE.chainW(() => getContent({ path })),
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

interface GetContentParams {
	path: string;
}

export const getContent = (params: GetContentParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				RTE.fromTaskEither(
					TE.tryCatch(
						() => fs.readFile(params.path.slice(1), "utf-8"),
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
							getLogErrorMessage("Reading content file"),
						),
					() =>
						context.logger.info(
							getLogSuccessMessage("Reading content file"),
						),
				),

				RTE.chainW((content) =>
					pipe(
						processContent({ content }),
						effectReaderTaskEitherBoth(
							(error) =>
								context.logger.error(
									error,
									getLogErrorMessage("Processing content"),
								),
							() =>
								context.logger.info(
									getLogSuccessMessage("Processing content"),
								),
						),
					),
				),
			),
		),
	);

export const getAllContents = () =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				getAllContentsPath(),
				RTE.chainW((paths) =>
					pipe(
						RTE.sequenceArray(
							paths.map((path) => getContent({ path })),
						),
					),
				),
			),
		),
	);

interface GenerateSearchIndexParams {
	readonly contents: Content[];
}

export const generateSearchIndex = (params: GenerateSearchIndexParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				RTE.of(
					new Flexsearch.Document({
						tokenize: "strict",
						optimize: true,
						resolution: 9,
						document: {
							id: "id",
							index: [
								{
									field: "title",
									tokenize: "forward",
								},
								{
									field: "description",
									context: {
										depth: 1,
										resolution: 3,
									},
								},
							], // Index ToC text as well
							store: ["metadata", "html", "markdown", "toc"],
						},
					}),
				),
				effectReaderTaskEither((index) =>
					params.contents.forEach((content, contentId) => {
						index.add({
							id: contentId.toString(),
							title: content.metadata.title,
							description: content.metadata.description,
							...content,
						});

						let tocItems = [...content.toc];

						while (tocItems.length > 0) {
							const tocItem = tocItems.pop()!;

							index.add({
								id: `${contentId}-${tocItem.id}`,
								title: tocItem.text,
								description: content.metadata.description,
								...content,
							});

							tocItems = tocItems.concat(tocItem.items);
						}
					}),
				),
			),
		),
	);
