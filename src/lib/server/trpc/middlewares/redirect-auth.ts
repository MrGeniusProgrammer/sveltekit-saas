import { isSome } from "@/packages/fp-ts";
import { TRPCError } from "@trpc/server";
import { authMiddleware } from "./auth";

export const redirectAuthMiddleware = authMiddleware.use((opts) => {
	if (isSome(opts.ctx.user) || isSome(opts.ctx.session)) {
		throw new TRPCError({ code: "BAD_REQUEST" });
	}

	const { user, session, ...ctxWithoutAuth } = opts.ctx;

	return opts.next({
		ctx: ctxWithoutAuth,
	});
});
