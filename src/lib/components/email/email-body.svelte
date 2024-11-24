<script lang="ts">
	import { convertTailwindToCss } from "@/helpers/tailwindcss";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className,
		style,
		children,
		...props
	}: HTMLAttributes<HTMLBodyElement> = $props();
</script>

<body
	style={`${convertTailwindToCss(className ?? "")}${style ?? ""}`}
	class={className}
	{...props}
>
	{@render children?.()}
</body>
