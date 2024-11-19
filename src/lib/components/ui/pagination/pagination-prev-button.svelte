<script lang="ts">
	import { buttonVariants } from "@/components/ui/button/index.js";
	import { cn } from "@/utils.js";
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import ChevronLeft from "svelte-radix/ChevronLeft.svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: PaginationPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
	<span>Previous</span>
	<ChevronLeft class="size-4" />
{/snippet}

<PaginationPrimitive.PrevButton
	bind:ref
	{...restProps}
	class={cn(
		buttonVariants({ variant: "ghost", className: "gap-1 pl-2.5" }),
		className,
	)}
	children={children || Fallback}
/>
