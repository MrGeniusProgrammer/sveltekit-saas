<script lang="ts">
	import { IconLogo } from "@/components/icon";
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger,
	} from "@/components/ui/collapsible";
	import { ScrollArea } from "@/components/ui/scroll-area";
	import {
		Sidebar,
		SidebarContent,
		SidebarGroup,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuAction,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarMenuSub,
		SidebarProvider,
	} from "@/components/ui/sidebar";
	import {
		BookOpen,
		ChevronRight,
		LibraryBig,
		TerminalSquare,
	} from "lucide-svelte";
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();

	// This is sample data.
	const data = {
		navMain: [
			{
				title: "Getting Started",
				url: "#",
				items: [
					{
						title: "Installation",
						url: "#",
					},
					{
						title: "Project Structure",
						url: "#",
					},
				],
			},
			{
				title: "Building Your Application",
				url: "#",
				items: [
					{
						title: "Routing",
						url: "#",
					},
					{
						title: "Data Fetching",
						url: "#",
						isActive: true,
					},
					{
						title: "Rendering",
						url: "#",
					},
					{
						title: "Caching",
						url: "#",
					},
					{
						title: "Styling",
						url: "#",
					},
					{
						title: "Optimizing",
						url: "#",
					},
					{
						title: "Configuring",
						url: "#",
					},
					{
						title: "Testing",
						url: "#",
					},
					{
						title: "Authentication",
						url: "#",
					},
					{
						title: "Deploying",
						url: "#",
					},
					{
						title: "Upgrading",
						url: "#",
					},
					{
						title: "Examples",
						url: "#",
					},
				],
			},
			{
				title: "API Reference",
				url: "#",
				items: [
					{
						title: "Components",
						url: "#",
					},
					{
						title: "File Conventions",
						url: "#",
					},
					{
						title: "Functions",
						url: "#",
					},
					{
						title: "next.config.js Options",
						url: "#",
					},
					{
						title: "CLI",
						url: "#",
					},
					{
						title: "Edge Runtime",
						url: "#",
					},
				],
			},
			{
				title: "Architecture",
				url: "#",
				items: [
					{
						title: "Accessibility",
						url: "#",
					},
					{
						title: "Fast Refresh",
						url: "#",
					},
					{
						title: "Next.js Compiler",
						url: "#",
					},
					{
						title: "Supported Browsers",
						url: "#",
					},
					{
						title: "Turbopack",
						url: "#",
					},
				],
			},
			{
				title: "Community",
				url: "#",
				items: [
					{
						title: "Contribution Guide",
						url: "#",
					},
				],
			},
		],
	};
</script>

<div class="flex h-screen w-screen flex-col">
	<nav class="sticky top-0 z-30 w-full">
		<div
			class="supports-backdrop-blur:bg-background/60 absolute h-full w-full flex-none border-b backdrop-blur transition-colors duration-500 dark:bg-transparent"
		></div>
		<div class="h-16">
			<div
				class="relative mx-auto flex h-full w-full max-w-[140ch] items-center gap-x-4 border border-b px-4 lg:border-none lg:px-8"
			>
				<div class="flex flex-1 items-center gap-2">
					<IconLogo class="size-6" />
					<span class="text-xl text-foreground">SveltekitSaaS</span>
				</div>
				<div class="flex-1"></div>
				<div class="flex-1"></div>
			</div>
		</div>
	</nav>
	<div
		class="mx-auto flex max-h-svh min-h-svh w-full max-w-[140ch] overflow-hidden p-4 lg:px-8"
	>
		<SidebarProvider class="min-h-full w-fit">
			<Sidebar collapsible="none" class="hidden lg:flex">
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								<div class="rounded-lg border p-1">
									<BookOpen class="size-5" />
								</div>
								<span class="font-bold">Documentation</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								<div class="rounded-lg border p-1">
									<TerminalSquare class="size-5" />
								</div>
								<span class="font-bold"> API Reference </span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								<div class="rounded-lg border p-1">
									<LibraryBig class="size-5" />
								</div>
								<span class="font-bold">Knowledge Base</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<ScrollArea>
						<SidebarGroup>
							<SidebarMenu>
								{#each data.navMain as item (item.title)}
									<Collapsible
										title={item.title}
										class="group/collapsible"
									>
										<SidebarMenuItem>
											<SidebarMenuButton>
												<a
													href={item.url}
													class="flex-1 font-medium"
												>
													{item.title}
												</a>
											</SidebarMenuButton>
											<CollapsibleTrigger>
												{#snippet child({ props })}
													<SidebarMenuAction
														class="aspect-square size-5 "
														{...props}
													>
														<ChevronRight
															class="transition-transform group-data-[state=open]/collapsible:rotate-90"
														/>
													</SidebarMenuAction>
												{/snippet}
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{#each item.items as subItem (subItem.title)}
														<SidebarMenuItem>
															<SidebarMenuButton
																isActive={subItem.isActive}
															>
																{#snippet child({
																	props,
																})}
																	<a
																		{...props}
																		href={subItem.url}
																	>
																		{subItem.title}
																	</a>
																{/snippet}
															</SidebarMenuButton>
														</SidebarMenuItem>
													{/each}
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								{/each}
							</SidebarMenu>
						</SidebarGroup>
					</ScrollArea>
				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
		<div class="ml-24 flex-1">
			{@render children()}
		</div>
	</div>
</div>
