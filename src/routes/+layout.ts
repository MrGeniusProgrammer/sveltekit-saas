import { trpc } from "@/helpers/trpc";
import { QueryClient } from "@tanstack/svelte-query";
import { browser } from "$app/environment";
import type { LayoutLoad } from "./$types";

export const prerender = "auto";

export const load: LayoutLoad = async (event) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				refetchOnWindowFocus: true,
				staleTime: 10 * 60 * 1000,
			},
		},
	});

	const api = trpc(event, queryClient);

	return {
		queryClient,
		api,
	};
};
