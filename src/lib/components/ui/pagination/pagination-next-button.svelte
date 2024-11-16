<script lang="ts">
	import { buttonVariants } from '@/components/ui/button/index.js';
	import { cn } from '@/utils.js';
	import { Pagination as PaginationPrimitive } from 'bits-ui';
	import ChevronRight from 'svelte-radix/ChevronRight.svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: PaginationPrimitive.NextButtonProps = $props();
</script>

{#snippet Fallback()}
	<span>Next</span>
	<ChevronRight class="size-4" />
{/snippet}

<PaginationPrimitive.NextButton
	bind:ref
	{...restProps}
	class={cn(
		buttonVariants({ variant: 'ghost', className: 'gap-1 pr-2.5' }),
		className,
	)}
	children={children || Fallback}
/>
