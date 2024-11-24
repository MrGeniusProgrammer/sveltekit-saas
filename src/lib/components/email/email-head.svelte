<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...props }: HTMLAttributes<HTMLHeadElement> = $props();
</script>

<head {...props}>
	<meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
	{@render children?.()}
</head>
