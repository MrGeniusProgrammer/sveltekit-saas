import { pipe, TE } from '@/packages/fp-ts';
import { deleteSessionTokenCookie } from '@/server/auth';
import { invalidateSession } from '@/server/use-cases/session';
import { TRPCError } from '@trpc/server';
import { protectedMiddleware } from '../middlewares/protected';
import { execute, router } from '../trpc';

export const auth = router({
	signOut: protectedMiddleware.mutation((opts) =>
		execute(
			pipe(
				TE.of(deleteSessionTokenCookie({ event: opts.ctx.event })),
				TE.chainW(() => invalidateSession({ sessionId: opts.ctx.session.id })),
				TE.mapError((error) => {
					switch (error.code) {
						default:
							return new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
					}
				})
			)
		)
	),

	validateRequest: protectedMiddleware.query((opts) => opts.ctx.user)
});
