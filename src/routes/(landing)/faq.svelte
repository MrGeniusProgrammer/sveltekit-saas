<script lang="ts">
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger,
	} from "@/components/ui/accordion";

	const faqs = [
		{
			question: "What tech stack does this starter kit use?",
			answer: "The kit leverages SvelteKit, Tailwind CSS, shadcn-svelte, tRPC, Superforms, and integrations like LemonSqueezy and Nodemailer.",
		},
		{
			question: "Is this suitable for non-technical founders?",
			answer: "While some technical knowledge helps, the starter kit includes detailed documentation to guide you step-by-step.",
		},
		{
			question: "How customizable is the kit?",
			answer: "Highly customizable! You can tailor the authentication, UI, and APIs to meet your unique needs.",
		},
		{
			question: "What kind of support do you offer?",
			answer: "We offer comprehensive documentation, video tutorials, and a community forum for all users. Pro and Enterprise plan users also receive priority support and direct access to our development team.",
		},
	];
</script>

<section id="faq" class="bg-background px-4 py-20 md:px-6">
	<div class="container mx-auto">
		<h2 class="mb-12 text-center text-3xl font-bold">
			Frequently Asked Questions
		</h2>
		<Accordion type="single" class="mx-auto w-full max-w-3xl">
			{#each faqs as faq, index}
				<AccordionItem value={`item-${index}`}>
					<AccordionTrigger>{faq.question}</AccordionTrigger>
					<AccordionContent>{faq.answer}</AccordionContent>
				</AccordionItem>
			{/each}
		</Accordion>
	</div>
</section>
