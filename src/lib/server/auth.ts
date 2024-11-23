import type { SessionExpiresAt } from "@/entities/session";
import type { RequestEvent } from "@sveltejs/kit";

interface SetSessionTokenCookieParams {
	event: RequestEvent;
	sessionToken: string;
	sessionExpiresAt: SessionExpiresAt;
}

export function setSessionTokenCookie(params: SetSessionTokenCookieParams) {
	params.event.cookies.set("session", params.sessionToken, {
		httpOnly: true,
		sameSite: "lax",
		expires: params.sessionExpiresAt,
		path: "/",
	});
}

interface DeleteSessionTokenCookieParams {
	event: RequestEvent;
}

export function deleteSessionTokenCookie(
	params: DeleteSessionTokenCookieParams,
) {
	params.event.cookies.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 0,
		path: "/",
	});
}

interface GetSessionTokenCookieParams {
	event: RequestEvent;
}

export function getSessionTokenCookie(params: GetSessionTokenCookieParams) {
	return params.event.cookies.get("session");
}

interface SetOauthCookieParams {
	event: RequestEvent;
	name: string;
	value: string;
}

export const setOauthCookie = (params: SetOauthCookieParams) => {
	params.event.cookies.set(params.name, params.value, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	});
};
