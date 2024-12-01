import { pipe, RTE, TE } from "@/packages/fp-ts";
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
import type { AppLoggerContext } from "./app";
import { createCodeError } from "./error";
import rehypeTocJson, { type TocItem } from "./rehype-toc-json";

interface ProcessMarkdownParams {
	path: string;
}

export const processMarkdown = (params: ProcessMarkdownParams) =>
	pipe(
		RTE.ask<AppLoggerContext>(),
		RTE.chainW((context) =>
			pipe(
				RTE.fromTaskEither(
					TE.tryCatch(
						async () => {
							// Read file and extract front matter
							const fileContent = await read(params.path).text();
							const {
								content: markdownWithoutFrontMatter,
								data: frontMatter,
							} = matter(fileContent);

							// Process the stripped Markdown to HTML
							const html = await unified()
								.use(remarkParse)
								.use(remarkNormalizeHeadings)
								.use(remarkGfm)
								.use(remarkRehype)
								.use(rehypeSanitize)
								.use(rehypeSlug)
								.use(rehypeAutolinkHeadings, {
									behavior: "prepend",
								})
								.use(rehypeTocJson)
								.use(rehypeFormat)
								.use(rehypeStringify)
								.process(markdownWithoutFrontMatter);

							return {
								html: html.value, // The HTML result
								modifiedMarkdown: markdownWithoutFrontMatter, // Markdown without front matter
								frontMatter: frontMatter as Record<
									string,
									unknown
								>, // Front matter as JSON
								toc: html.data.toc as TocItem[],
							};
						},
						(error) =>
							createCodeError({
								code: "processing-markdown-failed",
								cause: error,
							}),
					),
				),
			),
		),
	);
