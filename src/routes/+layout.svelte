<script lang="ts">
	import '../app.css';
	import { Toaster } from '@/components/ui/sonner';
	import { setApiClient } from '@/helpers/trpc';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

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
