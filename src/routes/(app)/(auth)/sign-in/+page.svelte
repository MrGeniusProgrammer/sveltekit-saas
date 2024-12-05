<script lang="ts">
	import { Button } from "@/components/ui/button";
	import {
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel,
	} from "@/components/ui/form";
	import { Input } from "@/components/ui/input";
	import { getLogErrorMessage, getLogSuccessMessage } from "@/helpers/logger";
	import { getApiClient } from "@/helpers/trpc";
	import { SiGithub, SiGoogle } from "@icons-pack/svelte-simple-icons";
	import { LoaderCircle } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { formSchema, type FormSchema } from "./schema";

	let isLoading = $state(false);
	let isTimeout = $state(false);

	const api = getApiClient();
	const apiUtils = api.createUtils();

	const signInWithProviderResult =
		api.auth.signInWithAccountProvider.createMutation({
			onSettled() {
				apiUtils.auth.validateRequest.refetch();
			},
			onSuccess(data, variables) {
				toast.success(
					getLogSuccessMessage(
						`User signing with provider ${variables.accountProvider[0].toUpperCase()}${variables.accountProvider.slice(1)}`,
					),
				);
				window.location.href = data;
			},
			onError(error, variables) {
				toast.error(
					getLogErrorMessage(
						`User signing with provider ${variables.accountProvider[0].toUpperCase()}${variables.accountProvider.slice(1)}`,
					),
				);
			},
		});

	$effect(() => {
		isLoading = $signInWithProviderResult.isPending;
	});

	const form = superForm<FormSchema>(
		{
			userEmail: "",
		},
		{
			validators: zodClient(formSchema),
			onResult(event) {
				if (event.result.type === "success") {
					const data = event.result.data as unknown as {
						isSigingUp: boolean;
					};

					if (data.isSigingUp) {
						toast.info("Please check your mail inbox to sign up");
					} else {
						toast.info("Please check your mail inbox to sign in");
					}
				}
			},
		},
	);

	const { form: formData, enhance, delayed, timeout } = form;

	$effect(() => {
		isLoading = $delayed;
	});

	$effect(() => {
		isTimeout = $timeout;
	});
</script>

<div class="flex h-screen w-screen items-center justify-center px-6">
	<div
		class="mx-auto flex w-full min-w-[350px] max-w-md flex-col justify-center space-y-6"
	>
		<div class="flex flex-col space-y-2 text-center">
			<h1 class="text-2xl font-semibold tracking-tight">
				Create an account
			</h1>
			<p class="text-sm text-muted-foreground">
				Enter your email below to create your account
			</p>
		</div>
		<div class="flex flex-col gap-6">
			<form use:enhance action="?/sign-in" method="POST">
				<FormField {form} name="userEmail">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel class="sr-only">Email</FormLabel>
							<Input
								{...props}
								bind:value={$formData.userEmail}
								placeholder="name@example.com"
								type="email"
								autocapitalize="none"
								autocomplete="email"
								autocorrect="off"
								disabled={isLoading}
							/>
						{/snippet}
					</FormControl>
					<FormDescription />
					<FormFieldErrors />
				</FormField>
				<div class="grid gap-2">
					<div class="grid gap-1"></div>
					<Button type="submit" disabled={isLoading}>
						{#if isLoading}
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Sign In with Email
					</Button>
				</div>
			</form>
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<div class="flex flex-col space-y-2">
				<Button
					variant="outline"
					onclick={() =>
						$signInWithProviderResult.mutateAsync({
							accountProvider: "google",
						})}
					type="button"
					disabled={isLoading}
				>
					{#if isLoading}
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					{:else}
						<SiGoogle />
					{/if}
					Google
				</Button>
				<Button
					variant="outline"
					onclick={() =>
						$signInWithProviderResult.mutateAsync({
							accountProvider: "github",
						})}
					type="button"
					disabled={isLoading}
				>
					{#if isLoading}
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					{:else}
						<SiGithub />
					{/if}
					GitHub
				</Button>
			</div>
		</div>
		<p class="px-8 text-center text-sm text-muted-foreground">
			By clicking continue, you agree to our
			<a
				href="/legal/terms-of-service"
				class="underline underline-offset-4 hover:text-primary"
			>
				Terms of Service
			</a>
			and
			<a
				href="/legal/privacy-policy"
				class="underline underline-offset-4 hover:text-primary"
			>
				Privacy Policy
			</a>
			.
		</p>
	</div>
</div>
