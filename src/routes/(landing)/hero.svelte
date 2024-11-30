<script>
	import {
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "@/components/ui/avatar";
	import { Button } from "@/components/ui/button";
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from "@/components/ui/tooltip";

	const avatars = [
		{ src: "/test.jpg", alt: "User 1", name: "User 1" },
		{ src: "/placeholder.svg", alt: "User 2", name: "User 1" },
		{ src: "/placeholder.svg", alt: "User 3", name: "User 1" },
		{ src: "/placeholder.svg", alt: "User 4", name: "User 1" },
		{ src: "/placeholder.svg", alt: "User 5", name: "User 1" },
		{ src: "/placeholder.svg", alt: "User 6", name: "User 1" },
	];
</script>

<section class="py-32">
	<div class="container mx-auto px-4 md:px-6">
		<div
			class="flex flex-col items-center justify-center md:justify-start lg:flex-row"
		>
			<div
				class="mb-10 flex flex-col items-center text-center md:items-start md:text-start lg:mb-0 lg:w-1/2"
			>
				<h1 class="mb-6 text-2xl font-bold md:text-4xl lg:text-5xl">
					Build, Launch, and Grow Your SaaS in Days – Not Weeks
				</h1>
				<p class="mb-8 max-w-2xl text-lg md:text-xl">
					Introducing the <b>SvelteKit SaaS Starter Kit:</b> the ultimate
					toolkit for turning your SaaS idea into reality. Whether you're
					a solo founder or part of a fast-paced startup, our kit has everything
					you need to get your product off the ground quickly and efficiently.
				</p>
				<Button
					size="lg"
					class="mb-8"
					href="https://github.com/MrGeniusProgrammer/sveltekit-saas"
				>
					Get Started
				</Button>
				<div class="flex flex-wrap items-center justify-center gap-2">
					{#each avatars as avatar, index (index)}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger
									class={index !== 0 ? "-ml-3" : ""}
								>
									<Avatar class="border-2 border-background">
										<AvatarImage
											src={avatar.src}
											alt={avatar.alt}
											class="cursor-pointer"
										/>
										<AvatarFallback>
											{avatar.name
												.slice(0, 2)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</TooltipTrigger>
								<TooltipContent>
									<span
										class="text-sm font-bold leading-tight"
									>
										{avatar.name}
									</span>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					{/each}
					<span class="ml-3 text-sm text-muted-foreground">
						Join 10,000+ developers
					</span>
				</div>
			</div>
			<div class="lg:w-1/2">
				<img
					src="/placeholder.svg"
					alt="Product screenshot"
					class="rounded-lg shadow-lg"
				/>
			</div>
		</div>
	</div>
</section>
