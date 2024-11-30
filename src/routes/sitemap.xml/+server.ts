import type { RequestHandler } from "@sveltejs/kit";
import * as sitemap from "super-sitemap";

export const GET: RequestHandler = async (event) => {
	return await sitemap.response({
		origin: event.url.origin,
		excludeRoutePatterns: ["^/api/*", "/sign-up/magic-link/*"],
		defaultChangefreq: "daily",
		defaultPriority: 0.7,
		sort: "alpha",
	});
};
