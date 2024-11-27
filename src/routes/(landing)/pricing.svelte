<script lang="ts">
	import { Button } from "@/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { getApiClient } from "@/helpers/trpc";
	import { Check, Loader2 } from "lucide-svelte";
	import { toast } from "svelte-sonner";

	const plans = [
		{
			name: "Starter",
			price: "$29",
			description: "Perfect for small teams and startups",
			id: 1214,
			features: [
				"Up to 5 users",
				"Basic analytics",
				"24/7 support",
				"1 GB storage",
			],
		},
		{
			name: "Pro",
			price: "$99",
			description: "Ideal for growing businesses",
			id: 1214,
			features: [
				"Up to 20 users",
				"Advanced analytics",
				"Priority support",
				"10 GB storage",
				"Custom integrations",
			],
		},
		{
			name: "Enterprise",
			price: "Custom",
			description: "For large-scale operations",
			id: 1214,
			features: [
				"Unlimited users",
				"Enterprise-grade analytics",
				"Dedicated account manager",
				"Unlimited storage",
				"Custom development",
			],
		},
	];

	const api = getApiClient();
	const apiUtils = api.createUtils();

	const createCheckoutUrlResult =
		api.payment.createCheckoutUrl.createMutation({
			onSettled(data, error, variables, context) {
				apiUtils.auth.validateRequest.refetch();
			},
			onSuccess(data, variables, context) {
				toast.success("Succesfully created a checkout url");
				window.location.href = data;
			},
			onError(error, variables, context) {
				toast.error(error.message);
			},
		});
</script>

<section id="pricing" class="bg-background px-4 py-20 md:px-6">
	<div class="container mx-auto">
		<h2 class="mb-12 text-center text-3xl font-bold">Choose Your Plan</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each plans as plan}
				<Card class="flex flex-col">
					<CardHeader>
						<CardTitle>{plan.name}</CardTitle>
						<CardDescription>{plan.description}</CardDescription>
					</CardHeader>
					<CardContent class="flex-grow">
						<p class="mb-4 text-4xl font-bold">
							{plan.price}
							<span class="text-sm font-normal">/month</span>
						</p>
						<ul class="space-y-2">
							{#each plan.features as feature}
								<li class="flex items-center">
									<Check class="mr-2 h-5 w-5 text-primary" />
									<span>{feature}</span>
								</li>
							{/each}
						</ul>
					</CardContent>
					<CardFooter>
						<Button
							class="w-full"
							disabled={$createCheckoutUrlResult.isPending}
							onclick={() =>
								$createCheckoutUrlResult.mutateAsync({
									paymentVariantId: plan.id,
								})}
						>
							{#if $createCheckoutUrlResult.isPending}
								<Loader2 class="mr-2 size-4 animate-spin" />
							{/if}
							Get Started
						</Button>
					</CardFooter>
				</Card>
			{/each}
		</div>
	</div>
</section>
