import { twi } from "tw-to-css";

export const convertTailwindToCss = (style: string) =>
	twi(style, {
		merge: true,
		minify: true,
	});
