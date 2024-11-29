<script lang="ts">
	import {
		EmailBody,
		EmailButton,
		EmailContainer,
		EmailHead,
		EmailHr,
		EmailHtml,
		EmailImg,
		EmailPreview,
		EmailSection,
		EmailText,
	} from "@/components/email";
	import type { UserEmail, UserImage, UserName } from "@/entities/user";
	import { env } from "@/env";

	let {
		userName,
		userEmail,
		userImage,
	}: { userName: UserName; userEmail: UserEmail; userImage: UserImage } =
		$props();
</script>

<EmailHtml>
	<EmailHead />
	<EmailPreview
		preview="The sales intelligence platform that helps you uncover qualified leads."
	/>
	<EmailBody
		style={{
			backgroundColor: "#fff",
			fontFamily:
				"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
		}}
	>
		<EmailContainer
			style={{
				margin: "0 auto",
				padding: "20px 0 48px",
			}}
		>
			<EmailImg
				src={`${env.PUBLIC_BASE_URL}/favicon.png`}
				width="170"
				height="50"
				alt="Koala"
				style={{
					margin: "0 auto",
				}}
			/>
			<EmailText
				style={{
					fontSize: "16px",
					lineHeight: "26px",
				}}
			>
				Hi {userName},
			</EmailText>
			<EmailText
				style={{
					fontSize: "16px",
					lineHeight: "26px",
				}}
			>
				Welcome to Sveltekit SaaS Kit, the sales intelligence platform
				that helps you uncover qualified leads and close deals faster.
			</EmailText>
			<EmailSection
				style={{
					textAlign: "center",
				}}
			>
				<EmailButton
					style={{
						backgroundColor: "#18181b",
						borderRadius: "4px",
						color: "#fff",
						fontSize: "16px",
						textDecoration: "none",
						textAlign: "center",
						display: "inline-block",
						padding: "12px",
					}}
					href={env.PUBLIC_BASE_URL}
				>
					Get started
				</EmailButton>
			</EmailSection>
			<EmailHr
				style={{
					borderColor: "#dfe1e4",
					margin: "20px 0",
				}}
			/>
			<EmailText
				style={{
					color: "#b4becc",
					fontSize: "12px",
				}}
			>
				Sveltekit SaaS Kit
			</EmailText>
		</EmailContainer>
	</EmailBody>
</EmailHtml>
