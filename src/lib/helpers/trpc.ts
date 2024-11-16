import type { Router } from '@/server/trpc/router';
import type { QueryClient } from '@tanstack/svelte-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { getContext, hasContext, setContext } from 'svelte';
import { svelteQueryWrapper } from 'trpc-svelte-query-adapter';
import { type TRPCClientInit } from 'trpc-sveltekit';

let browserClient: ApiClient;

export function trpc(init: TRPCClientInit, queryClient?: QueryClient) {
	const isBrowser = typeof window !== 'undefined';
	if (isBrowser && browserClient) return browserClient;
	const url = '/api/trpc';
	const client = svelteQueryWrapper<Router>({
		client: createTRPCProxyClient<Router>({
			transformer: superjson,
			links: [
				httpBatchLink({
					url:
						typeof window === 'undefined'
							? `${init.url.origin}${url}`
							: `${location.origin}${url}`,
					fetch:
						typeof window === 'undefined'
							? init.fetch
							: (init?.fetch ?? window.fetch),
				}),
			],
		}),
		queryClient,
	});
	if (isBrowser) browserClient = client;
	return client;
}

export type ApiClient = ReturnType<typeof svelteQueryWrapper<Router>>;

const apiClientContextSymbol = 'helpers--trpc--api-client';

export const setApiClient = (apiClient: ApiClient) => {
	setContext(apiClientContextSymbol, apiClient);
};

export const getApiClient = (): ApiClient => {
	if (hasContext(apiClientContextSymbol)) {
		return getContext(apiClientContextSymbol) as ApiClient;
	}

	throw new Error(
		'no api client in the context, please set the api client context',
	);
};
