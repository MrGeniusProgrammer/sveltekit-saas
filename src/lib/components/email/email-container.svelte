<script lang="ts">
	import { convertTailwindToCss } from "@/helpers/tailwindcss";
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		style,
		class: className,
		children,
		...props
	}: HTMLAttributes<HTMLDivElement> = $props();

	const inlineStyle = `${convertTailwindToCss(cn("max-w-[37.5rem]", className))}${style ?? ""}`;
</script>

<div>
	{@html `<!--[if mso | IE]>
          <table role="presentation" width="100%" align="center" style="${inlineStyle}" class="${className}"><tr><td></td><td style="width:37.5em;background:#ffffff">
        <![endif]-->`}
</div>
<div style={inlineStyle} class={className} {...props}>
	{@render children?.()}
</div>
<div>
	{@html `<!--[if mso | IE]>
          </td><td></td></tr></table>
          <![endif]-->`}
</div>
