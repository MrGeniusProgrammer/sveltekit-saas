<script lang="ts">
	import { Button } from "@/components/ui/button";
</script>

<header class="bg-background px-4 py-4 md:px-6">
	<div class="container mx-auto flex items-center justify-between">
		<a href="/" class="text-2xl font-bold text-primary">SaaSPro</a>
		<nav class="hidden space-x-4 md:flex">
			<a href="#features" class="text-sm font-medium hover:underline"
				>Features</a
			>
			<a href="#pricing" class="text-sm font-medium hover:underline"
				>Pricing</a
			>
			<a href="#testimonials" class="text-sm font-medium hover:underline"
				>Testimonials</a
			>
			<a href="#faq" class="text-sm font-medium hover:underline">FAQ</a>
		</nav>
		<div class="flex items-center space-x-4">
			<a href="/sign-in">
				<Button>Sign in</Button>
			</a>
		</div>
	</div>
</header>
