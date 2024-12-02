<script>
	import {
		SiFacebook,
		SiInstagram,
		SiLinkedin,
		SiTwitter,
	} from "@icons-pack/svelte-simple-icons";
</script>

<footer class="border-t px-4 py-12 md:px-6">
	<div class="container mx-auto">
		<div class="flex flex-wrap gap-8">
			<div>
				<h3 class="mb-4 text-lg font-semibold">SveltekitSaaS</h3>
				<p class="max-w-md text-sm text-muted-foreground">
					We’ve built this kit to simplify the complexities of SaaS
					development so you can focus on building your app’s core
					value.
				</p>
			</div>
			<div
				class="flex min-w-56 flex-1 flex-row flex-wrap justify-between lg:justify-evenly"
			>
				<div>
					<h4 class="mb-4 text-sm font-semibold">Product</h4>
					<ul class="space-y-2">
						<li>
							<a
								href="/#features"
								class="text-sm text-muted-foreground hover:text-foreground"
								>Features</a
							>
						</li>
						<li>
							<a
								href="/#pricing"
								class="text-sm text-muted-foreground hover:text-foreground"
								>Pricing</a
							>
						</li>
						<li>
							<a
								href="/#faq"
								class="text-sm text-muted-foreground hover:text-foreground"
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
								class="text-sm text-muted-foreground hover:text-foreground"
								>About Us</a
							>
						</li>
						<li>
							<a
								href="/careers"
								class="text-sm text-muted-foreground hover:text-foreground"
								>Careers</a
							>
						</li>
						<li>
							<a
								href="/contact"
								class="text-sm text-muted-foreground hover:text-foreground"
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
								href="/legal/privacy-policy"
								class="text-sm text-muted-foreground hover:text-foreground"
								>Privacy Policy</a
							>
						</li>
						<li>
							<a
								href="/legal/terms-of-service"
								class="text-sm text-muted-foreground hover:text-foreground"
								>Terms of Service</a
							>
						</li>
						<li>
							<a
								href="/legal/cookie-policy"
								class="text-sm text-muted-foreground hover:text-foreground"
								>Cookie Policy</a
							>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div
			class="mt-12 flex flex-col items-center justify-between border-t border-muted-foreground/20 pt-8 md:flex-row"
		>
			<p class="text-sm text-muted-foreground">
				&copy; {new Date().getFullYear()} SveltekitSaaS. All rights reserved.
			</p>
			<div class="mt-4 flex space-x-4 md:mt-0">
				<a href="#" class="text-muted-foreground hover:text-foreground">
					<SiFacebook size={24} />
					<span class="sr-only">Facebook</span>
				</a>
				<a href="#" class="text-muted-foreground hover:text-foreground">
					<SiTwitter size={24} />
					<span class="sr-only">Twitter</span>
				</a>
				<a href="#" class="text-muted-foreground hover:text-foreground">
					<SiInstagram size={24} />
					<span class="sr-only">Instagram</span>
				</a>
				<a href="#" class="text-muted-foreground hover:text-foreground">
					<SiLinkedin size={24} />
					<span class="sr-only">LinkedIn</span>
				</a>
			</div>
		</div>
	</div>
</footer>
