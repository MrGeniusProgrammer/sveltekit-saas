<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { BarChart, Shield, Users, Zap } from "lucide-svelte";

	const features = [
		{
			title: "Lightning Fast",
			description:
				"Experience unparalleled speed and performance with our optimized platform.",
			icon: Zap,
		},
		{
			title: "Bank-Grade Security",
			description:
				"Rest easy knowing your data is protected by state-of-the-art security measures.",
			icon: Shield,
		},
		{
			title: "Advanced Analytics",
			description:
				"Gain valuable insights with our powerful analytics and reporting tools.",
			icon: BarChart,
		},
		{
			title: "Team Collaboration",
			description:
				"Foster seamless teamwork with our intuitive collaboration features.",
			icon: Users,
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
