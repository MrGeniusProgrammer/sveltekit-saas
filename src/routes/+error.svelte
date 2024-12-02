<script>
	import { Button } from "@/components/ui/button";
	import { page } from "$app/stores";
	import { AlertCircle, ArrowLeft } from "lucide-svelte";
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background/50 to-background/100 px-4 py-12 sm:px-6 lg:px-8"
>
	<AlertCircle class="mb-8 h-24 w-24 text-red-500" aria-hidden="true" />
	<h1 class="mb-4 text-5xl font-extrabold text-primary">
		Error {$page.status}
	</h1>
	<p class="mb-8 max-w-md text-center text-xl text-muted-foreground">
		{$page.error.message}
	</p>
	<Button href="/" size="lg">
		<ArrowLeft class="mr-2 h-5 w-5" />
		Back to Home
	</Button>
	<p class="mt-8 text-center text-sm text-muted-foreground">
		If you believe this is a mistake, please contact support.
	</p>
</div>
