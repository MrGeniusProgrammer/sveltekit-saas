<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import Dash from "svelte-radix/Dash.svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} role="separator" {...restProps}>
	{#if children}
		{@render children?.()}
	{:else}
		<Dash />
	{/if}
</div>
