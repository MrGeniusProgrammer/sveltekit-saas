<script lang="ts">
	import { Clock, Code, Coins, Rocket } from "lucide-svelte";

	const benefits = [
		{
			icon: Rocket,
			title: "Launch Faster",
			description:
				"Save weeks of development time and launch a fully-functional MVP quickly.",
		},
		{
			icon: Clock,
			title: "Focus on Core Value",
			description:
				"Spend your time building features that matter to your users, not reinventing the wheel.",
		},
		{
			icon: Code,
			title: "Developer-Friendly",
			description:
				"Built with SvelteKit, offering unparalleled performance and developer experience.",
		},
		{
			icon: Coins,
			title: "Cost-Effective",
			description:
				"Reduce development costs by starting with a solid, feature-rich foundation.",
		},
	];
</script>

<section id="features" class="overflow-hidden py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-3xl font-bold">
			Why Choose Our SvelteKit SaaS Starter?
		</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each benefits as feature (feature.title)}
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
