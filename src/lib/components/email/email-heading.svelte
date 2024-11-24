<script lang="ts">
	import { convertTailwindToCss } from "@/helpers/tailwindcss";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	}

	let {
		as = "h1",
		class: className,
		style,
		children,
		...props
	}: Props = $props();
</script>

<svelte:element
	this={as}
	style={`${convertTailwindToCss(className ?? "")}${style ?? ""}`}
	class={className}
	{...props}
>
	{@render children?.()}
</svelte:element>
