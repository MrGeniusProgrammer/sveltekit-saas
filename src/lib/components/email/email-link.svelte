<script lang="ts">
	import { convertTailwindToCss } from "@/helpers/tailwindcss";
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className,
		style,
		children,
		...props
	}: HTMLAttributes<HTMLAnchorElement> = $props();
</script>

<a
	style={`${convertTailwindToCss(cn("no-underline", className))}${style ?? ""}`}
	class={className}
	target="_blank"
	{...props}
>
	{@render children?.()}
</a>
