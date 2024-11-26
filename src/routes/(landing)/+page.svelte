<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { CircleCheck, CircleX } from "lucide-svelte";
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<div class="flex w-full max-w-xl flex-wrap gap-2.5">
		<Card>
			<CardHeader>
				<CardTitle>Basic</CardTitle>
			</CardHeader>
			<CardContent class="flex flex-col justify-center gap-1.5">
				<div class="flex items-center gap-2">
					<CircleCheck class="size-6" />
					<p class="text-lg leading-tight">Simple</p>
				</div>
				<div class="flex items-center gap-2">
					<CircleCheck class="size-6" />
					<p class="text-lg leading-tight">Simple</p>
				</div>
				<div class="flex items-center gap-2">
					<CircleCheck class="size-6" />
					<p class="text-lg leading-tight">Simple</p>
				</div>
				<div class="flex items-center gap-2">
					<CircleCheck class="size-6" />
					<p class="text-lg leading-tight">Simple</p>
				</div>
			</CardContent>
		</Card>
	</div>
</div>
