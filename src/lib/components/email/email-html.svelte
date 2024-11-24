<script lang="ts">
	import { convertTailwindToCss } from "@/helpers/tailwindcss";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends Omit<HTMLAttributes<HTMLHtmlElement>, "style"> {
		lang?: string;
	}

	let {
		lang = "en",
		children,
		class: className,
		style,
		...props
	}: Props = $props();
</script>

<html
	{lang}
	style={`${convertTailwindToCss(className ?? "")}${style ?? ""}`}
	class={className}
	{...props}
>
	{@render children?.()}
</html>
