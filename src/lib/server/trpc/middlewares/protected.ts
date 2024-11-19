import { isNone } from "@/packages/fp-ts";
import { TRPCError } from "@trpc/server";
import { authMiddleware } from "./auth";

export const protectedMiddleware = authMiddleware.use((opts) => {
	if (isNone(opts.ctx.user) || isNone(opts.ctx.session)) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return opts.next({
		ctx: {
			...opts.ctx,
			user: opts.ctx.user.value,
			session: opts.ctx.session.value,
		},
	});
});
