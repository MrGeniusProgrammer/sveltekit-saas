<script lang="ts">
	import { IconLogo } from "@/components/icon";
	import { Button } from "@/components/ui/button";
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
		SidebarGroupContent,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarMenuSub,
		SidebarMenuSubButton,
		SidebarMenuSubItem,
		SidebarProvider,
		SidebarRail,
	} from "@/components/ui/sidebar";
	import { ChevronRight, GalleryVerticalEnd } from "lucide-svelte";
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
			class="supports-backdrop-blur:bg-background/60 absolute h-full w-full flex-none border border-b backdrop-blur transition-colors duration-500 dark:bg-transparent"
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
	<div class="mx-auto min-h-screen max-w-[140ch] px-4 lg:px-8">
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg">
								{#snippet child({ props })}
									<a href="#" {...props}>
										<div
											class="aspect-square flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
										>
											<GalleryVerticalEnd
												class="size-4"
											/>
										</div>
										<div
											class="flex flex-col gap-0.5 leading-none"
										>
											<span class="font-semibold"
												>Documentation</span
											>
											<span class="">v1.0.0</span>
										</div>
									</a>
								{/snippet}
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
											<SidebarMenuButton
												class="flex items-center justify-between"
											>
												<a
													href={item.url}
													class="flex-1 font-medium"
												>
													{item.title}
												</a>
												<CollapsibleTrigger>
													{#snippet child({ props })}
														<Button
															variant="ghost"
															size="icon"
															{...props}
														>
															<ChevronRight
																class="transition-transform group-data-[state=open]/collapsible:rotate-90"
															/>
														</Button>
													{/snippet}
												</CollapsibleTrigger>
											</SidebarMenuButton>
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
				<SidebarRail />
			</Sidebar>
		</SidebarProvider>
		<div class="h-full w-full">
			{@render children()}
		</div>
	</div>
</div>
