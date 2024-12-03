import fs from "fs/promises";
import type { Content, ContentId } from "@/entities/content";
import type { AppLoggerContext } from "@/helpers/app";
import { createCodeError } from "@/helpers/error";
import {
	effectReaderTaskEither,
	effectReaderTaskEitherBoth,
	effectReaderTaskEitherError,
} from "@/helpers/fp-ts";
import { getLogErrorMessage, getLogSuccessMessage } from "@/helpers/logger";
import rehypeTocJson from "@/helpers/rehype-toc-json";
import { O, pipe, RTE, TE } from "@/packages/fp-ts";
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
import { getFilesRecursively } from "../file";

interface CreateContentSlugParams {
	dir: string;
	path: string;
}

export const createContentSlug = (params: CreateContentSlugParams) =>
	params.path.replace(`${params.dir}/`, "").replace(".md", "");

export const getAllContentsEntries = () =>
	pipe(
		RTE.ask<AppLoggerContext & { dir: string }>(),
		RTE.chainW((context) =>
			pipe(
				RTE.fromTaskEither(
					TE.tryCatch(
						() => getFilesRecursively(context.dir),
						(error) =>
							createCodeError({
								code: "importing-content-faild",
								cause: error,
							}),
					),
				),
				RTE.map((paths) =>
					paths
						.filter((path) => path.endsWith(".md"))
						.map((path) => ({
							slug: createContentSlug({
								dir: context.dir,
								path,
							}),
							path,
						})),
				),
			),
		),
	);

interface ProcessContentParams {
	source: string;
}

export const processContent = (params: ProcessContentParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW(() =>
			pipe(
				RTE.fromTaskEither(
					TE.tryCatch(
						async () => {
							// Read file and extract front matter
							const {
								content: markdownWithoutFrontMatter,
								data: metadata,
							} = matter(params.source);

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
								metadata, // Front matter as JSON
								toc: html.data.toc,
							};
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

interface GetContentFromPathParams {
	path: string;
	id: ContentId;
}

export const getContentFromPath = (params: GetContentFromPathParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				RTE.fromTaskEither(
					TE.tryCatch(
						() => fs.readFile(params.path, "utf-8"),
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

				RTE.chainW((source) =>
					pipe(
						processContent({ source }),
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

						RTE.map(
							(content) =>
								({ ...content, id: params.id }) as Content,
						),
					),
				),
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
				getAllContentsEntries(),
				effectReaderTaskEitherBoth(
					(error) =>
						context.logger.error(
							error,
							getLogErrorMessage("Getting all content slugs"),
						),
					(value) =>
						context.logger.info(
							value,
							getLogSuccessMessage("Getting all content slugs"),
						),
				),
				RTE.map((data) =>
					O.fromNullable(
						data.find((data) => data.slug === params.slug),
					),
				),
				RTE.chainW((optionalData) =>
					pipe(
						optionalData,
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
							(data) =>
								pipe(
									RTE.fromIO(() =>
										context.logger.info(
											data,
											"Found a matched content path",
										),
									),
									RTE.chainW(() =>
										getContentFromPath({
											path: data.path,
											id: data.slug,
										}),
									),
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
		RTE.chainW(() =>
			pipe(
				getAllContentsEntries(),
				RTE.chainW((items) =>
					pipe(
						RTE.sequenceArray(
							items.map((item) =>
								getContentFromPath({
									path: item.path,
									id: item.slug,
								}),
							),
						),
					),
				),
			),
		),
	);

interface CreateContentsSearchIndexParams {
	readonly contents: Content[];
}

export const createContentsSearchIndex = (
	params: CreateContentsSearchIndexParams,
) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW(() =>
			pipe(
				RTE.of(
					new Flexsearch.Document({
						tokenize: "strict",
						optimize: true,
						cache: true,
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
							store: [
								"id",
								"metadata",
								"html",
								"markdown",
								"toc",
							],
						},
					}),
				),
				effectReaderTaskEither((index) =>
					params.contents.forEach((content) => {
						index.add({
							...content,
							title: content.metadata.title,
							description: content.metadata.description,
						});

						let tocItems = [...content.toc];

						while (tocItems.length > 0) {
							const tocItem = tocItems.pop()!;

							index.add({
								...content,
								id: `${content.id}-${tocItem.id}`,
								title: tocItem.text,
								description: content.metadata.description,
							});

							tocItems = tocItems.concat(tocItem.items);
						}
					}),
				),
			),
		),
	);
