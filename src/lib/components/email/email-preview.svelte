<script lang="ts">
	import { convertTailwindToCss } from "@/helpers/tailwindcss";
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
		preview: string;
	}

	let { preview = "", class: className, style, ...props }: Props = $props();

	const renderWhiteSpace = (text: string) => {
		const whiteSpaceCodes = "\xa0\u200C\u200B\u200D\u200E\u200F\uFEFF";
		return whiteSpaceCodes.repeat(150 - text.length);
	};
</script>

<div
	style={`${convertTailwindToCss(cn("hidden overflow-hidden leading-normal opacity-0 max-h-0 max-w-0", className))}${style ?? ""}`}
	class={className}
	{...props}
>
	{preview}
	<div>
		{renderWhiteSpace(preview)}
	</div>
</div>
