<script lang="ts">
	import { convertTailwindToCss } from "@/helpers/tailwindcss";
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		style,
		class: className,
		children,
		...props
	}: HTMLAttributes<HTMLTableElement> = $props();
</script>

<table
	style={`${convertTailwindToCss(cn("w-full", className))}${style ?? ""}`}
	align="center"
	border={0}
	cellPadding={0}
	cellSpacing={0}
	role="presentation"
	class={className}
	{...props}
>
	<tbody>
		<tr style={convertTailwindToCss("grid grid-columns-1 grid-flow-col")}>
			{@render children?.()}
		</tr>
	</tbody>
</table>
