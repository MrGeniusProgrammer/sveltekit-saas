<script lang="ts">
	import { cn } from "@/utils.js";
	import { Menubar as MenubarPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 8,
		alignOffset = -4,
		align = "start",
		side = "bottom",
		portalProps,
		...restProps
	}: MenubarPrimitive.ContentProps & {
		portalProps?: MenubarPrimitive.PortalProps;
	} = $props();
</script>

<MenubarPrimitive.Portal {...portalProps}>
	<MenubarPrimitive.Content
		bind:ref
		{sideOffset}
		{align}
		{alignOffset}
		{side}
		class={cn(
			"z-50 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none",
			className,
		)}
		{...restProps}
	/>
</MenubarPrimitive.Portal>
