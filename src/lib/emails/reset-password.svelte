<script lang="ts">
	import {
		EmailBody,
		EmailHead,
		EmailHeading,
		EmailHtml,
		EmailPreview,
	} from "@/components/email";

	let { code }: { code: string } = $props();
</script>

<EmailHtml>
	<EmailHead>
		<EmailPreview preview="A fun test with my own email" />
	</EmailHead>
	<EmailBody>
		<EmailHeading as="h1" class="text-xs">
			{code}
		</EmailHeading>
	</EmailBody>
</EmailHtml>
