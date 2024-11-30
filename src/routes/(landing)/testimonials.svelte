<script lang="ts">
	import {
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "@/components/ui/avatar";
	import { Card, CardContent, CardFooter } from "@/components/ui/card";
	import {
		Carousel,
		CarouselContent,
		CarouselItem,
	} from "@/components/ui/carousel";
	import autoScroll from "embla-carousel-auto-scroll";

	const testimonials = [
		{
			name: "Sarah Johnson",
			role: "CEO, TechStart",
			content:
				"SaaSPro has transformed the way we operate. The efficiency gains are remarkable!",
			avatar: "/placeholder.svg",
		},
		{
			name: "Michael Chen",
			role: "CTO, InnovateCorp",
			content:
				"The analytics provided by SaaSPro have given us invaluable insights into our business processes.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Emily Rodriguez",
			role: "Operations Manager, GlobalTech",
			content:
				"Customer support is top-notch. Any issues we've had were resolved quickly and efficiently.",
			avatar: "/placeholder.svg",
		},
		{
			name: "David Kim",
			role: "Founder, StartupX",
			content:
				"SaaSPro's intuitive interface has made onboarding new team members a breeze.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Laura Martinez",
			role: "Marketing Director, GrowthCo",
			content:
				"The ROI we've seen since implementing SaaSPro has exceeded our expectations.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
		{
			name: "Alex Thompson",
			role: "Product Manager, InnoTech",
			content:
				"SaaSPro's features have significantly streamlined our product development process.",
			avatar: "/placeholder.svg",
		},
	];
</script>

{#snippet TestimonialRow(props: {
	testimonials: typeof testimonials;
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
			{#each props.testimonials as testimonial}
				<CarouselItem
					class="mx-4 w-full max-w-[300px] flex-shrink-0 pl-1"
				>
					<Card>
						<CardContent class="pt-6">
							<p class="mb-4">"{testimonial.content}"</p>
						</CardContent>
						<CardFooter class="flex items-center">
							<Avatar class="mr-2">
								<AvatarImage
									src={testimonial.avatar}
									alt={testimonial.name}
									class="size-6"
								/>
								<AvatarFallback>
									{testimonial.name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div>
								<p class="font-semibold">
									{testimonial.name}
								</p>
								<p class="text-sm text-muted-foreground">
									{testimonial.role}
								</p>
							</div>
						</CardFooter>
					</Card>
				</CarouselItem>
			{/each}
		</CarouselContent>
	</Carousel>
{/snippet}

<section id="testimonials" class="overflow-hidden py-20">
	<div class="w-full">
		<h2 class="mb-12 px-4 text-center text-3xl font-bold">
			What Our Customers Say
		</h2>
		<div class="w-full space-y-8">
			{@render TestimonialRow({
				testimonials: testimonials.slice(0, 8),
				direction: "left",
				speed: 2,
			})}
			{@render TestimonialRow({
				testimonials: testimonials.slice(8, -1),
				direction: "right",
				speed: 1.7,
			})}
		</div>
	</div>
</section>
