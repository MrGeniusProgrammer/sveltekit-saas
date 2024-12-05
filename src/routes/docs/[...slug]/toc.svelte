<script lang="ts">
	import type { Toc } from "@/entities/toc";
	import TocItem from "./toc-item.svelte";

	let { items }: { items: Toc } = $props();
</script>

{#each items as item (item.id)}
	<TocItem {item} />
{/each}
