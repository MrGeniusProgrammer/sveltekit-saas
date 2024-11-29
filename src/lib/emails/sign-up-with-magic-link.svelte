<script lang="ts">
	import {
		EmailBody,
		EmailButton,
		EmailContainer,
		EmailHead,
		EmailHr,
		EmailHtml,
		EmailImg,
		EmailLink,
		EmailPreview,
		EmailSection,
		EmailText,
	} from "@/components/email";
	import { env } from "@/env";

	let { token }: { token: string } = $props();
</script>

<EmailHtml>
	<EmailHead />
	<EmailPreview preview="Your magic sign up link for Sveltekit SaaS Kit" />
	<EmailBody
		style={{
			backgroundColor: "#ffffff",
			fontFamily:
				'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
		}}
	>
		<EmailContainer
			style={{
				margin: "0 auto",
				padding: "20px 0 48px",
				maxWidth: "560px",
			}}
		>
			<EmailImg
				src={`${env.PUBLIC_BASE_URL}/favicon.png`}
				width="42"
				height="42"
				alt="Linear"
				style={{
					borderRadius: 22,
					width: 42,
					height: 42,
				}}
			/>
			<EmailText
				style={{
					fontSize: "24px",
					letterSpacing: "-0.5px",
					lineHeight: "1.4",
					fontWeight: "400",
					color: "#484848",
					padding: "18px 0 0",
				}}
			>
				Your magic sign up link for Sveltekit SaaS Kit
			</EmailText>
			<EmailSection
				style={{
					padding: "28px 0 28px",
				}}
			>
				<EmailButton
					style={{
						backgroundColor: "#18181b",
						borderRadius: "4px",
						fontWeight: "600",
						color: "#fff",
						fontSize: "16px",
						textDecoration: "none",
						textAlign: "center",
						display: "block",
						padding: "12px 24px",
					}}
					href={`${env.PUBLIC_BASE_URL}/sign-up/magic-link/${token}`}
				>
					Sign up
				</EmailButton>
			</EmailSection>
			<EmailText
				style={{
					margin: "0 0 16px",
					fontSize: "16px",
					lineHeight: "1.4",
					color: "#3c4149",
				}}
			>
				This link will only be valid for the next 5 minutes.
			</EmailText>
			<EmailHr
				style={{
					borderColor: "#dfe1e4",
					margin: "42px 0 26px",
				}}
			/>
			<EmailText
				style={{
					fontSize: "14px",
					color: "#b4becc",
				}}
			>
				<EmailLink
					href={env.PUBLIC_BASE_URL}
					style={{ color: "#b4becc" }}
				>
					Sveltekit SaaS Kit
				</EmailLink>
			</EmailText>
		</EmailContainer>
	</EmailBody>
</EmailHtml>
