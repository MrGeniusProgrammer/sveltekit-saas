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
	import { LoaderCircle } from "lucide-svelte";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { formSchema, type FormSchema } from "./schema";

	const form = superForm<FormSchema>(
		{
			userName: "",
		},
		{
			validators: zodClient(formSchema),
		},
	);

	let { form: formData, enhance, delayed, timeout } = form;
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<form
		action="?/sign-up-with-magic-link"
		method="POST"
		class="w-full max-w-lg"
		use:enhance
	>
		<FormField {form} name="userName">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Username</FormLabel>
					<Input
						{...props}
						bind:value={$formData.userName}
						placeholder="Joe"
						autocapitalize="none"
						autocomplete="name"
						autocorrect="on"
						disabled={$delayed}
					/>
				{/snippet}
			</FormControl>
			<FormDescription />
			<FormFieldErrors />
		</FormField>
		<div class="grid gap-2">
			<div class="grid gap-1"></div>
			<Button type="submit" disabled={$delayed}>
				{#if $delayed}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Sign Up
			</Button>
		</div>
	</form>
</div>
