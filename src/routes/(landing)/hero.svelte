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
		{ src: "/placeholder.svg", alt: "User 1", name: "User 1" },
		{ src: "/placeholder.svg", alt: "User 2", name: "User 1" },
		{ src: "/placeholder.svg", alt: "User 3", name: "User 1" },
		{ src: "/placeholder.svg", alt: "User 4", name: "User 1" },
		{ src: "/placeholder.svg", alt: "User 5", name: "User 1" },
		{ src: "/placeholder.svg", alt: "User 6", name: "User 1" },
	];
</script>

<section class="py-20">
	<div class="container mx-auto px-4 md:px-6">
		<div class="flex flex-col items-center lg:flex-row">
			<div class="mb-10 lg:mb-0 lg:w-1/2">
				<h1 class="mb-6 text-4xl font-bold lg:text-5xl">
					Simplify Your Workflow
				</h1>
				<p class="mb-8 max-w-2xl text-xl">
					Streamline your tasks, collaborate seamlessly, and boost
					productivity with our intuitive platform.
				</p>
				<div class="mb-8 flex items-center">
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
						Join 10,000+ users
					</span>
				</div>
				<Button size="lg">Get Started</Button>
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
