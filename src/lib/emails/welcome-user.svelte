<script lang="ts">
	import {
		EmailBody,
		EmailButton,
		EmailColumn,
		EmailContainer,
		EmailHead,
		EmailHeading,
		EmailHr,
		EmailHtml,
		EmailImg,
		EmailLink,
		EmailPreview,
		EmailSection,
		EmailText,
	} from "@/components/email";
	import type { UserEmail, UserImage, UserName } from "@/entities/user";

	let {
		userName,
		userEmail,
		userImage,
	}: { userName: UserName; userEmail: UserEmail; userImage: UserImage } =
		$props();
</script>

<EmailHtml>
	<EmailHead>
		<EmailPreview preview={`Welcome to Our Service, ${userName}!`} />
	</EmailHead>
	<EmailBody>
		<EmailContainer>
			<!-- Header Section -->
			<EmailSection>
				<EmailImg
					src="/assets/logo.png"
					alt="Service Logo"
					width="150"
					height="50"
					style="margin: 0 auto; display: block;"
				/>
			</EmailSection>
			<!-- Welcome Section -->
			<EmailSection>
				<EmailHeading>Welcome, {userName}!</EmailHeading>
				<EmailText>
					Hi {userName},<br /><br />
					Thank you for joining us! We’re thrilled to have you on board.
					Here’s everything you need to get started with our service.
				</EmailText>
				<EmailImg
					src={userImage}
					alt="{userName}'s Profile Picture"
					width="100"
					height="100"
					style="border-radius: 50%; margin: 20px auto; display: block;"
				/>
			</EmailSection>
			<!-- Account Info Section -->
			<EmailSection>
				<EmailColumn>
					<EmailText>
						<strong>Your Details:</strong>
					</EmailText>
					<EmailHr />
					<EmailText>
						<strong>Name:</strong>
						{userName}<br />
						<strong>Email:</strong>
						{userEmail}
					</EmailText>
				</EmailColumn>
			</EmailSection>
			<!-- Call-to-Action Section -->
			<EmailSection>
				<EmailButton
					href="https://your-saas.com/dashboard"
					style="background-color: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;"
				>
					Get Started
				</EmailButton>
			</EmailSection>
			<!-- Footer Section -->
			<EmailSection>
				<EmailText>
					Need help? Visit our <EmailLink
						href="https://your-saas.com/support"
						>Support Center</EmailLink
					>.
				</EmailText>
			</EmailSection>
		</EmailContainer>
	</EmailBody>
</EmailHtml>
