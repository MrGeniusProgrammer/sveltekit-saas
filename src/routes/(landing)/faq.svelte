<script lang="ts">
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger,
	} from "@/components/ui/accordion";

	const faqs = [
		{
			question: "What is SaaSPro?",
			answer: "SaaSPro is a comprehensive software-as-a-service platform designed to streamline business processes, enhance productivity, and drive growth for companies of all sizes.",
		},
		{
			question: "How does pricing work?",
			answer: "We offer flexible pricing plans to suit businesses of all sizes. Our plans are based on the number of users and features required. Check out our pricing section for more details.",
		},
		{
			question: "Is there a free trial available?",
			answer: "Yes, we offer a 14-day free trial for all our plans. You can sign up and explore all the features before committing to a subscription.",
		},
		{
			question: "How secure is my data?",
			answer: "We take data security very seriously. SaaSPro employs bank-grade encryption, regular security audits, and follows industry best practices to ensure your data is always protected.",
		},
		{
			question: "Can I cancel my subscription at any time?",
			answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.",
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
