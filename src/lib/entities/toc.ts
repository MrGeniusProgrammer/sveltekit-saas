import { z } from "zod";

export const TocItemDepth = z.number().positive().max(6);
export type TocItemDepth = typeof TocItemDepth._output;

export const TocItemText = z.string().min(1);
export type TocItemText = typeof TocItemText._output;

export const TocItemId = z.string().min(1);
export type TocItemId = typeof TocItemId._output;

export interface TocItem {
	id: TocItemId;
	text: TocItemText;
	depth: TocItemDepth;
	items: TocItem[];
}

export const TocItem: z.ZodType<TocItem> = z.object({
	depth: TocItemDepth,
	id: TocItemId,
	text: TocItemText,
	items: z.lazy(() => TocItem.array()),
});

export const Toc = z.array(TocItem);
export type Toc = typeof Toc._output;
