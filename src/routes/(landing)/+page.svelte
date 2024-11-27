<script lang="ts">
	import Companies from "./companies.svelte";
	import Faq from "./faq.svelte";
	import Features from "./features.svelte";
	import Footer from "./footer.svelte";
	import Header from "./header.svelte";
	import Pricing from "./pricing.svelte";
	import Testimonials from "./testimonials.svelte";
</script>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-grow">
		<!-- <Hero /> -->
		<Features />
		<Companies />
		<Pricing />
		<Testimonials />
		<Faq />
	</main>
	<Footer />
</div>
