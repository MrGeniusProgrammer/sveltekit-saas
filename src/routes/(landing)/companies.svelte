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
				stopOnInteraction: false,
				startDelay: 100,
			}),
		]}
		opts={{
			loop: true,
			dragFree: true,
		}}
	>
		<CarouselContent class="-ml-1">
			{#each props.companies as company}
				<CarouselItem class="mx-4 w-full max-w-lg flex-shrink-0 pl-1">
					<img
						src={company.logo}
						alt={company.name}
						width={120}
						height={60}
						class="h-auto w-full"
					/>
				</CarouselItem>
			{/each}
		</CarouselContent>
	</Carousel>
{/snippet}

<section class="py-20">
	<div class="flex w-full flex-col">
		<h2 class="mb-12 px-4 text-center text-3xl font-bold">
			Trusted by Industry Leaders
		</h2>
		<div class="space-y-8">
			{@render CompanyRow({
				companies: companies,
				direction: "right",
				speed: 2,
			})}
		</div>
	</div>
</section>
