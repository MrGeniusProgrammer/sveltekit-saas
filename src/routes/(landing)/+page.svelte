<script lang="ts">
	import { ScrollArea } from "@/components/ui/scroll-area";
	import Companies from "./companies.svelte";
	import Cta from "./cta.svelte";
	import Faq from "./faq.svelte";
	import Features from "./features.svelte";
	import Footer from "./footer.svelte";
	import Header from "./header.svelte";
	import Hero from "./hero.svelte";
	import Pricing from "./pricing.svelte";
	import Testimonials from "./testimonials.svelte";
</script>

<ScrollArea class="flex h-screen flex-col">
	<Header />
	<main class="flex-grow">
		<Hero />
		<Companies />
		<Features />
		<Pricing />
		<Faq />
		<Testimonials />
		<Cta />
	</main>
	<Footer />
</ScrollArea>
