import { env } from "@/env";
import { createCodeError } from "@/helpers/error";
import { TE } from "@/packages/fp-ts";
import { createTransport } from "nodemailer";

const transport = createTransport(
	{
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		secure: env.NODE_ENV !== "development",
		auth: {
			user: env.SMTP_AUTH_USER,
			pass: env.SMTP_AUTH_PASSWORD,
		},
	},
	{
		from: `"${env.SMTP_FROM_USERNAME}" <${env.SMTP_FROM_EMAIL}>`,
	},
);

interface SendMailParams {
	to: string | string[];
	subject: string;
	html: string;
}

export const sendMail = (params: SendMailParams) =>
	TE.tryCatch(
		() =>
			transport.sendMail({
				to: Array.isArray(params.to) ? params.to.join(", ") : params.to,
				subject: params.subject,
				html: params.html,
			}),
		(error) =>
			createCodeError({
				code: "send-email-failed",
				message: "Sending email failed",
				cause: error,
			}),
	);
