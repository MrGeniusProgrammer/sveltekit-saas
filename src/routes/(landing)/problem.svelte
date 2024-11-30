<script>
	import { AlertTriangle, Clock, DollarSign, Frown } from "lucide-svelte";

	const problems = [
		{
			icon: Clock,
			title: "Time Wasted on Boilerplate",
			description:
				"Spend months setting up authentication, payments, and basic features instead of focusing on your unique value proposition.",
		},
		{
			icon: DollarSign,
			title: "Increased Development Costs",
			description:
				"Hire more developers or extend project timelines, burning through your runway before you even launch.",
		},
		{
			icon: AlertTriangle,
			title: "Technical Debt Accumulation",
			description:
				"Rush to market with a poorly structured codebase, leading to scaling issues and costly refactors down the line.",
		},
		{
			icon: Frown,
			title: "Frustrated Founders and Teams",
			description:
				"Experience the stress and burnout of trying to juggle all aspects of SaaS development without proper tools and structure.",
		},
	];
</script>

<section class="bg-muted py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-3xl font-bold text-foreground">
			Why do so many developers failed to make a startup?
		</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			{#each problems as problem (problem.title)}
				<div
					class="rounded-lg border border-border bg-background p-6 shadow-sm"
				>
					<div class="mb-4 flex items-center">
						<problem.icon class="mr-3 h-8 w-8 text-destructive" />
						<h3 class="text-xl font-semibold text-foreground">
							{problem.title}
						</h3>
					</div>
					<p class="text-muted-foreground">{problem.description}</p>
				</div>
			{/each}
		</div>
		<div class="mt-12 text-center">
			<p class="text-lg text-muted-foreground">
				Don't let your startup move at a snail's pace. With our
				SvelteKit SaaS Starter Kit, you'll be building at the speed of
				Sonic!
			</p>
		</div>
	</div>
</section>
