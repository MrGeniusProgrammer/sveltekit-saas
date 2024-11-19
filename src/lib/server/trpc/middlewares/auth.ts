import { baseMiddleware } from "./base";

export const authMiddleware = baseMiddleware.use((opts) => {
	return opts.next({
		ctx: {
			...opts.ctx,
			user: opts.ctx.event.locals.user,
			session: opts.ctx.event.locals.session,
		},
	});
});
