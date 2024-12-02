<script lang="ts">
	import "../app.css";
	import { ScrollArea } from "@/components/ui/scroll-area";
	import { Toaster } from "@/components/ui/sonner";
	import { setApiClient } from "@/helpers/trpc";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { page } from "$app/stores";
	import { ModeWatcher } from "mode-watcher";
	import type { Snippet } from "svelte";
	import SvelteSeo from "svelte-seo";
	import type { LayoutData } from "./$types";

	interface Props {
		children: Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	setApiClient(data.api);
</script>

<SvelteSeo
	title="SvelteKit SaaS Starter Kit | Build and Launch Faster"
	description="Kickstart your SaaS with the SvelteKit Starter Kit – pre-built authentication, payments, email, APIs, and UI tools to ship in days, not weeks."
	canonical={$page.url.origin}
	keywords="SvelteKit SaaS, SaaS starter kit, tRPC, shadcn-svelte, magic link authentication, LemonSqueezy, TailwindCSS"
	openGraph={{
		title: "SvelteKit SaaS Starter Kit | Build and Launch Faster",
		description:
			"Kickstart your SaaS with the SvelteKit Starter Kit – pre-built authentication, payments, email, APIs, and UI tools to ship in days, not weeks.",
		url: $page.url.origin,
		type: "website",
		images: [
			{
				url: `${$page.url.origin}/logo.svg`,
				width: 1200,
				height: 630,
				alt: "SaaS Kit",
			},
		],
		site_name: "SvelteKit SaaS Starter Kit",
	}}
	twitter={{
		card: "summary_large_image",
		site: "@sveltekitsaas",
		title: "SvelteKit SaaS Starter Kit | Build and Launch Faster",
		description:
			"Kickstart your SaaS with the SvelteKit Starter Kit – pre-built authentication, payments, email, APIs, and UI tools to ship in days, not weeks.",
		image: `${$page.url.origin}/logo.svg`,
	}}
>
	<meta
		name="google-site-verification"
		content="4VMOIVCpdmAtNWRQk20P2D0TsFDctTbWCgrcvZWrifI"
	/>
</SvelteSeo>

<ScrollArea>
	<ModeWatcher />
	<Toaster richColors />
	<QueryClientProvider client={data.queryClient}>
		{@render children()}
	</QueryClientProvider>
</ScrollArea>
