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
	style={`${convertTailwindToCss(
		cn("inline-block w-full leading-none no-underline", className),
	)}${style ?? ""}`}
	class={className}
	target="_blank"
	{...props}
>
	<span>
		{@html `<!--[if mso]><i style="letter-spacing: 0px;mso-font-width:-100%;mso-text-raise:0px" hidden>&nbsp;</i><![endif]-->`}
	</span>
	{@render children?.()}
	<span>
		{@html `<!--[if mso]><i style="letter-spacing: 0px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]-->`}
	</span>
</a>
