// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			trpc: import("@/server/trpc/router").CreateCaller;
			user: import("@/packages/fp-ts").Option<
				import("@/entities/user").User
			>;
			session: import("@/packages/fp-ts").Option<
				import("@/entities/session").Session
			>;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
