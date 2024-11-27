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

<section id="features" class="bg-background px-4 py-20 md:px-6">
	<div class="container mx-auto">
		<h2 class="mb-12 text-center text-3xl font-bold">Powerful Features</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each features as feature}
				<Card>
					<CardHeader>
						<feature.icon class="mb-4 h-10 w-10 text-primary" />
						<CardTitle>{feature.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription>{feature.description}</CardDescription>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>
