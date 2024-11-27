import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { auth } from "./routes/auth";
import { payment } from "./routes/payment";
import { createCallerFactory, router as primitiveRouter } from "./trpc";

export const router = primitiveRouter({
	auth,
	payment,
});

export const createCaller = createCallerFactory(router);
export type CreateCaller = ReturnType<typeof createCaller>;

export type Router = typeof router;
export type RouterOutputs = inferRouterOutputs<Router>;
export type RouterInputs = inferRouterInputs<Router>;
