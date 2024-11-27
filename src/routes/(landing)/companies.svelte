<script lang="ts">
	import {
		Carousel,
		CarouselContent,
		CarouselItem,
	} from "@/components/ui/carousel";
	import autoScroll from "embla-carousel-auto-scroll";

	const companies = [
		{ name: "TechCorp", logo: "/placeholder.svg" },
		{ name: "InnovateCo", logo: "/placeholder.svg" },
		{ name: "FutureTech", logo: "/placeholder.svg" },
		{ name: "NextGen Solutions", logo: "/placeholder.svg" },
		{ name: "GlobalSoft", logo: "/placeholder.svg" },
		{ name: "SmartSystems", logo: "/placeholder.svg" },
		{ name: "DataDrive", logo: "/placeholder.svg" },
		{ name: "CloudNine", logo: "/placeholder.svg" },
		{ name: "AI Dynamics", logo: "/placeholder.svg" },
		{ name: "CyberShield", logo: "/placeholder.svg" },
		{ name: "Quantum Leap", logo: "/placeholder.svg" },
		{ name: "EcoTech", logo: "/placeholder.svg" },
	];
</script>

{#snippet CompanyRow(props: {
	companies: typeof companies;
	direction: "right" | "left";
	speed: number;
})}
	<Carousel
		plugins={[
			autoScroll({
				direction: props.direction === "left" ? "forward" : "backward",
				speed: props.speed,
				stopOnMouseEnter: true,
				playOnInit: true,
			}),
		]}
		opts={{
			loop: true,
		}}
		class="flex overflow-hidden whitespace-nowrap"
	>
		<CarouselContent class="-ml-1">
			{#each props.companies as company}
				<CarouselItem class="mx-8 flex-shrink-0 pl-1">
					<img
						src={company.logo}
						alt={company.name}
						width={120}
						height={60}
						class="h-auto max-w-[120px]"
					/>
				</CarouselItem>
			{/each}
		</CarouselContent>
	</Carousel>
{/snippet}

<section class="overflow-hidden px-4 py-20 md:px-6">
	<div class="container mx-auto">
		<h2 class="mb-12 text-center text-3xl font-bold">
			Trusted by Industry Leaders
		</h2>
		<div class="space-y-8">
			{@render CompanyRow({
				companies: companies.slice(0, 4),
				direction: "right",
				speed: 2,
			})}
			{@render CompanyRow({
				companies: companies.slice(4, 8),
				direction: "left",
				speed: 1.2,
			})}
			{@render CompanyRow({
				companies: companies.slice(8, 12),
				direction: "right",
				speed: 1.3,
			})}
		</div>
	</div>
</section>
