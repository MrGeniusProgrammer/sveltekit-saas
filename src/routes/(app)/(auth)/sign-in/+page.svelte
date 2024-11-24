<script lang="ts">
	import { Button } from "@/components/ui/button";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { getLogErrorMessage, getLogSuccessMessage } from "@/helpers/logger";
	import { getApiClient } from "@/helpers/trpc";
	import { Github } from "lucide-svelte";
	import { toast } from "svelte-sonner";

	const api = getApiClient();
	const apiUtils = api.createUtils();

	const signInWithProviderResult =
		api.auth.signInWithAccountProvider.createMutation();
</script>

<div class="flex h-screen w-screen items-center justify-center px-6">
	<Card class="w-full max-w-lg ">
		<CardHeader>
			<CardTitle class="text-xl">Sign In with any providers</CardTitle>
		</CardHeader>
		<CardContent class="flex flex-col gap-2">
			<Button
				variant="secondary"
				disabled={$signInWithProviderResult.isPending}
				onclick={() =>
					$signInWithProviderResult.mutateAsync(
						{ accountProvider: "github" },
						{
							onSettled(data, variables, context) {
								apiUtils.auth.validateRequest.refetch();
							},
							onSuccess(data, variables, context) {
								toast.success(
									getLogSuccessMessage(
										"User signing with provider Github",
									),
								);
								window.location.href = data;
							},
							onError(error, variables, context) {
								toast.error(
									getLogErrorMessage(
										"User signing with provider Github",
									),
								);
							},
						},
					)}
			>
				<Github class="mr-2 size-4" />
				Github
			</Button>
			<Button
				variant="secondary"
				disabled={$signInWithProviderResult.isPending}
				onclick={() =>
					$signInWithProviderResult.mutateAsync(
						{ accountProvider: "google" },
						{
							onSettled(data, variables, context) {
								apiUtils.auth.validateRequest.refetch();
							},
							onSuccess(data, variables, context) {
								toast.success(
									getLogSuccessMessage(
										"User signing with provider Google",
									),
								);
								window.location.href = data;
							},
							onError(error, variables, context) {
								toast.error(
									getLogErrorMessage(
										"User signing with provider Google",
									),
								);
							},
						},
					)}
			>
				<Github class="mr-2 size-4" />
				Google
			</Button>
		</CardContent>
	</Card>
</div>
