import { z } from "zod";
import { Toc } from "./toc";

export const ContentMetadataTitle = z.string().min(1);
export type ContentMetadataTitle = typeof ContentMetadataTitle._output;

export const ContentMetadataDescription = z.string().min(1);
export type ContentMetadataDescription =
	typeof ContentMetadataDescription._output;

export const ContentMetadata = z.object({
	title: ContentMetadataTitle,
	description: ContentMetadataDescription,
});
export type ContentMetadata = typeof ContentMetadata._output;

export const ContentHtml = z.string().min(1);
export type ContentHtml = typeof ContentHtml._output;

export const ContentMarkdown = z.string().min(1);
export type ContentMarkdown = typeof ContentMarkdown._output;

export const ContentId = z.string().min(1);
export type ContentId = typeof ContentId._output;

export const Content = z.object({
	id: ContentId,
	html: ContentHtml,
	markdown: ContentMarkdown,
	metadata: ContentMetadata,
	toc: Toc,
});
export type Content = typeof Content._output;
