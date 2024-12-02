<script lang="ts">
	import type { Snippet } from "svelte";
	import Footer from "./footer.svelte";
	import Header from "./header.svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex h-screen flex-col">
	<Header />
	<main class="flex-grow">
		{@render children()}
	</main>
	<Footer />
</div>
