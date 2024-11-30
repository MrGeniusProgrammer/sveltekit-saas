<script lang="ts">
	import {
		Code,
		CreditCard,
		FileCode,
		Key,
		Mail,
		Palette,
	} from "lucide-svelte";

	const features = [
		{
			icon: Key,
			title: "Authentication, Simplified",
			description:
				"Magic Links for secure, passwordless login and OAuth integration with Google and GitHub.",
		},
		{
			icon: CreditCard,
			title: "Built-In Payments",
			description:
				"Fully integrated with LemonSqueezy to handle subscriptions and one-time payments effortlessly.",
		},
		{
			icon: Mail,
			title: "Professional Email Made Easy",
			description:
				"Robust email integration using Nodemailer, with templates for signups, notifications, and more.",
		},
		{
			icon: Code,
			title: "Type-Safe APIs with tRPC",
			description:
				"End-to-end type-safe remote procedure calls for confident app scaling.",
		},
		{
			icon: Palette,
			title: "Sleek UI with shadcn-svelte",
			description:
				"Beautiful, customizable UI components for a polished user experience.",
		},
		{
			icon: FileCode,
			title: "Smart Forms with Superforms",
			description:
				"Handle complex form actions with ease, paired with robust Zod validation.",
		},
	];
</script>

<section id="features" class="overflow-hidden py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-3xl font-bold">
			Powerful Features for Your Success
		</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each features as feature (feature.title)}
				<div class="text-center">
					<feature.icon class="mx-auto mb-4 h-12 w-12" />
					<h3 class="mb-2 text-xl font-semibold">
						{feature.title}
					</h3>
					<p class="text-muted-foreground">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
