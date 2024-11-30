import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = (event) => {
	return new Response(
		`

User-agent: *
Allow: /

# Google adsbot ignores robots.txt unless specifically named!
User-agent: AdsBot-Google
Allow: /


User-agent: GPTBot
Disallow: /

Sitemap: ${event.url.origin}/sitemap.xml

    `.trim(),
	);
};
