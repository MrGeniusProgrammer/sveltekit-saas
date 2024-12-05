<script lang="ts">
	import "../app.css";
	import { ScrollArea } from "@/components/ui/scroll-area";
	import { Toaster } from "@/components/ui/sonner";
	import { setApiClient } from "@/helpers/trpc";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { PUBLIC_BASE_URL } from "$env/static/public";
	import { ModeWatcher } from "mode-watcher";
	import type { Snippet } from "svelte";
	import { MetaTags } from "svelte-meta-tags";
	import type { LayoutData } from "./$types";

	interface Props {
		children: Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	setApiClient(data.api);
</script>

<MetaTags
	title="SvelteKit SaaS Starter Kit | Build and Launch Faster"
	description="Kickstart your SaaS with the SvelteKit Starter Kit – pre-built authentication, payments, email, APIs, and UI tools to ship in days, not weeks."
	canonical={PUBLIC_BASE_URL}
	keywords={[
		"SvelteKit SaaS",
		"SaaS starter kit",
		"tRPC",
		"shadcn-svelte",
		"magic link authentication",
		"LemonSqueezy",
		"TailwindCSS",
	]}
	openGraph={{
		title: "SvelteKit SaaS Starter Kit | Build and Launch Faster",
		description:
			"Kickstart your SaaS with the SvelteKit Starter Kit – pre-built authentication, payments, email, APIs, and UI tools to ship in days, not weeks.",
		url: PUBLIC_BASE_URL,
		type: "website",
		images: [
			{
				url: `${PUBLIC_BASE_URL}/org_image.png`,
				width: 1200,
				height: 630,
				alt: "SaaS Kit",
			},
		],
		siteName: "SvelteKit SaaS Starter Kit",
	}}
	twitter={{
		site: "@sveltekitsaas",
		creator: "@MrGenius",
		cardType: "summary_large_image",
		title: "SvelteKit SaaS Starter Kit | Build and Launch Faster",
		description:
			"Kickstart your SaaS with the SvelteKit Starter Kit – pre-built authentication, payments, email, APIs, and UI tools to ship in days, not weeks.",
		image: `${PUBLIC_BASE_URL}/org_image.png`,
		imageAlt: "Org Image",
	}}
	additionalMetaTags={[
		{
			name: "google-site-verification",
			content: "4VMOIVCpdmAtNWRQk20P2D0TsFDctTbWCgrcvZWrifI",
		},
	]}
/>

<ScrollArea>
	<ModeWatcher />
	<Toaster richColors />
	<QueryClientProvider client={data.queryClient}>
		{@render children()}
	</QueryClientProvider>
</ScrollArea>
