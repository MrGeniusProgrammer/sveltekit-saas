import { effectReaderTaskEitherError, runEither } from "@/helpers/fp-ts";
import { logger } from "@/helpers/logger";
import { O, pipe, RTE } from "@/packages/fp-ts";
import { createContext } from "@/server/trpc/context";
import { createCaller, router } from "@/server/trpc/router";
import { validateSessionToken } from "@/server/use-cases/session";
import { type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import {
	deleteSessionTokenCookie,
	getSessionTokenCookie,
	setSessionTokenCookie,
} from "$lib/server/auth";
import { createTRPCHandle } from "trpc-sveltekit";

const authHandle: Handle = ({ event, resolve }) =>
	pipe(
		RTE.of(O.fromNullable(getSessionTokenCookie({ event }))),
		RTE.chainW((optionalSessionToken) =>
			pipe(
				optionalSessionToken,
				O.foldW(
					() =>
						RTE.right({
							user: O.none,
							session: O.none,
						}),
					(sessionToken) =>
						pipe(
							validateSessionToken({ sessionToken }),
							effectReaderTaskEitherError((error) => {
								switch (error.code) {
									case "session-expired":
									case "session-not-found":
										return deleteSessionTokenCookie({
											event,
										});
								}
							}),
							RTE.map((data) => {
								setSessionTokenCookie({
									event,
									sessionToken,
									sessionExpiresAt: data.session.expiresAt,
								});

								return {
									user: O.some(data.user),
									session: O.some(data.session),
								};
							}),
						),
				),
			),
		),
		RTE.mapError(() => resolve(event)),
		RTE.map((locals) => {
			event.locals.user = locals.user;
			event.locals.session = locals.session;
			return resolve(event);
		}),
	)({ logger })().then(runEither);

const trpcHandle: Handle = createTRPCHandle({
	router,
	createContext,
	url: "/api/trpc",
});

const trpcServerHandle: Handle = async ({ event, resolve }) => {
	event.locals.trpc = createCaller(await createContext(event));
	return resolve(event);
};

export const handle = sequence(authHandle, trpcHandle, trpcServerHandle);
