import { logger } from "@/helpers/logger";
import { pipe, RT } from "@/packages/fp-ts";
import { setOauthCookie } from "@/server/auth";
import { getGithubOAuthUrl } from "@/server/use-cases/auth";
import type { RequestEvent } from "./$types";

export const GET = (event: RequestEvent) =>
	pipe(
		getGithubOAuthUrl(),
		RT.tap((data) =>
			RT.of(
				setOauthCookie({
					name: "github_oauth_state",
					value: data.state,
					event,
				}),
			),
		),
		RT.map(
			(data) =>
				new Response(null, {
					status: 302,
					headers: { Location: data.url.toString() },
				}),
		),
	)({ logger })();
