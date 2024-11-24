<script lang="ts">
	import { convertTailwindToCss } from "@/helpers/tailwindcss";
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className,
		style,
		...props
	}: HTMLAttributes<HTMLHRElement> = $props();
</script>

<hr
	style={`${convertTailwindToCss(cn("w-full border-none border-t", className))}${style ?? ""}`}
	class={className}
	{...props}
/>
