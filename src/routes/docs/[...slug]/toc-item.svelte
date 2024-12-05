<script lang="ts">
	import { SidebarMenuItem } from "@/components/ui/sidebar";
	import type { TocItem } from "@/entities/toc";
	import Toc from "./toc.svelte";

	let { item }: { item: TocItem } = $props();
</script>

<SidebarMenuItem>
	<a
		href={`#${item.id}`}
		class="border-l border-sidebar-border text-muted-foreground hover:text-foreground"
		style={`padding-left: ${item.depth * 2}rem`}
	>
		{item.text}
	</a>
</SidebarMenuItem>
{#if item.items && item.items.length > 0}
	<Toc items={item.items} />
{/if}
