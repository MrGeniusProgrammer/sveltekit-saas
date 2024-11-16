<script lang="ts">
	import { buttonVariants } from '@/components/ui/button/index.js';
	import { cn } from '@/utils.js';
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import ChevronLeft from 'svelte-radix/ChevronLeft.svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: CalendarPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
	<ChevronLeft class="size-4" />
{/snippet}

<CalendarPrimitive.PrevButton
	bind:ref
	class={cn(
		buttonVariants({ variant: 'outline' }),
		'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
		className,
	)}
	{...restProps}
	children={children || Fallback}
/>
