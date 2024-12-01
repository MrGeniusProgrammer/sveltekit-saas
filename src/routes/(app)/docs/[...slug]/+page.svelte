<script lang="ts">
	import { ScrollArea } from "@/components/ui/scroll-area";
	import {
		Sidebar,
		SidebarContent,
		SidebarGroup,
		SidebarGroupContent,
		SidebarGroupLabel,
		SidebarMenu,
		SidebarProvider,
	} from "@/components/ui/sidebar";
	import type { PageData } from "./$types";
	import Toc from "./toc.svelte";

	let { data }: { data: PageData } = $props();
</script>

<div class="grid h-full grid-cols-[auto_1fr]">
	<ScrollArea
		class="prose prose-neutral w-full flex-1 pb-12 pr-4 dark:prose-invert"
	>
		{@html data.html}
	</ScrollArea>
	<ScrollArea class="ml-4 h-fit min-h-fit max-w-[30ch]">
		<SidebarProvider class="h-full min-h-full">
			<Sidebar collapsible="none" class="h-full w-full">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel class="pl-0 text-sm font-bold"
							>On this page</SidebarGroupLabel
						>
						<SidebarGroupContent>
							<SidebarMenu>
								<Toc items={data.toc} />
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
	</ScrollArea>
</div>
