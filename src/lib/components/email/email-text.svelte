<script lang="ts">
	import { convertTailwindToCss } from "@/helpers/tailwindcss";
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className,
		style,
		children,
		...props
	}: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p
	style={`${convertTailwindToCss(cn("leading-tight mx-4", className))}${style ?? ""}`}
	class={className}
	{...props}
>
	{@render children?.()}
</p>
