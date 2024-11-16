<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { Toaster } from '@/components/ui/sonner';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';
	import type { LayoutData } from './$types';
	import { setApiClient } from '@/helpers/trpc';

	interface Props {
		children: Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	setApiClient(data.api);
</script>

<ModeWatcher />
<Toaster richColors />
<QueryClientProvider client={data.queryClient}>
	{@render children()}
</QueryClientProvider>
