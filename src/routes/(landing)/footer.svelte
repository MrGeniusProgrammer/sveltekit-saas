<script>
	import { Facebook, Instagram, Linkedin, Twitter } from "lucide-svelte";
</script>

<footer class="bg-muted px-4 py-12 md:px-6">
	<div class="container mx-auto">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			<div>
				<h3 class="mb-4 text-lg font-semibold">SaaSPro</h3>
				<p class="text-sm text-muted-foreground">
					Revolutionizing business processes with cutting-edge SaaS
					solutions.
				</p>
			</div>
			<div>
				<h4 class="mb-4 text-sm font-semibold">Product</h4>
				<ul class="space-y-2">
					<li>
						<a
							href="#features"
							class="text-sm text-muted-foreground hover:text-primary"
							>Features</a
						>
					</li>
					<li>
						<a
							href="#pricing"
							class="text-sm text-muted-foreground hover:text-primary"
							>Pricing</a
						>
					</li>
					<li>
						<a
							href="#faq"
							class="text-sm text-muted-foreground hover:text-primary"
							>FAQ</a
						>
					</li>
				</ul>
			</div>
			<div>
				<h4 class="mb-4 text-sm font-semibold">Company</h4>
				<ul class="space-y-2">
					<li>
						<a
							href="/about"
							class="text-sm text-muted-foreground hover:text-primary"
							>About Us</a
						>
					</li>
					<li>
						<a
							href="/careers"
							class="text-sm text-muted-foreground hover:text-primary"
							>Careers</a
						>
					</li>
					<li>
						<a
							href="/contact"
							class="text-sm text-muted-foreground hover:text-primary"
							>Contact</a
						>
					</li>
				</ul>
			</div>
			<div>
				<h4 class="mb-4 text-sm font-semibold">Legal</h4>
				<ul class="space-y-2">
					<li>
						<a
							href="/privacy"
							class="text-sm text-muted-foreground hover:text-primary"
							>Privacy Policy</a
						>
					</li>
					<li>
						<a
							href="/terms"
							class="text-sm text-muted-foreground hover:text-primary"
							>Terms of Service</a
						>
					</li>
					<li>
						<a
							href="/cookie-policy"
							class="text-sm text-muted-foreground hover:text-primary"
							>Cookie Policy</a
						>
					</li>
				</ul>
			</div>
		</div>
		<div
			class="mt-12 flex flex-col items-center justify-between border-t border-muted-foreground/20 pt-8 md:flex-row"
		>
			<p class="text-sm text-muted-foreground">
				&copy; {new Date().getFullYear()} SaaSPro. All rights reserved.
			</p>
			<div class="mt-4 flex space-x-4 md:mt-0">
				<a href="#" class="text-muted-foreground hover:text-primary">
					<Facebook class="h-5 w-5" />
					<span class="sr-only">Facebook</span>
				</a>
				<a href="#" class="text-muted-foreground hover:text-primary">
					<Twitter class="h-5 w-5" />
					<span class="sr-only">Twitter</span>
				</a>
				<a href="#" class="text-muted-foreground hover:text-primary">
					<Instagram class="h-5 w-5" />
					<span class="sr-only">Instagram</span>
				</a>
				<a href="#" class="text-muted-foreground hover:text-primary">
					<Linkedin class="h-5 w-5" />
					<span class="sr-only">LinkedIn</span>
				</a>
			</div>
		</div>
	</div>
</footer>
