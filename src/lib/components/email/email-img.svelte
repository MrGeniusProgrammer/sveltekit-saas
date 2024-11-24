<script lang="ts">
	import { convertTailwindToCss } from "@/helpers/tailwindcss";
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className,
		style,
		...props
	}: HTMLAttributes<HTMLImageElement> = $props();
</script>

<img
	style={`${convertTailwindToCss(cn("block outline-none border-none no-underline", className))}${style ?? ""}`}
	class={className}
	{...props}
/>
