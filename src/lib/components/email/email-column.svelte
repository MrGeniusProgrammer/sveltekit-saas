<script lang="ts">
	import { convertTailwindToCss } from "@/helpers/tailwindcss";
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		style,
		class: className,
		children,
		...props
	}: HTMLAttributes<HTMLTableCellElement> = $props();
</script>

<td
	style={`${convertTailwindToCss(cn("inline-flex justify-center items-center", className))}${style ?? ""}`}
	class={className}
	role="presentation"
	{...props}
>
	{@render children?.()}
</td>
