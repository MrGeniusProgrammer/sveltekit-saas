<script lang="ts">
	import {
		SidebarMenuSub,
		SidebarMenuSubItem,
	} from "@/components/ui/sidebar";
	import type { Toc } from "@/entities/toc";
	import Self from "./toc.svelte";

	let { items }: { items: Toc } = $props();
</script>

{#each items as item (item.id)}
	<SidebarMenuSubItem>
		<a
			href={`#${item.id}`}
			class="text-muted-foreground hover:text-foreground"
		>
			{item.text}
		</a>
		{#if item.items && item.items.length > 0}
			<SidebarMenuSub class="mx-1 px-3 py-1.5">
				<Self items={item.items} />
			</SidebarMenuSub>
		{/if}
	</SidebarMenuSubItem>
{/each}
