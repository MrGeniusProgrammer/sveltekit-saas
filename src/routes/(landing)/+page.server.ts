import { logger } from "@/helpers/logger";
import { pipe, RTE } from "@/packages/fp-ts";
import { getWelcomeUserEmail } from "@/server/data-access/email";
import { sendEmail } from "@/server/use-cases/email";

export const load = async () => {
	await pipe(
		getWelcomeUserEmail({
			userName: "MrGeniusProgrammer",
			userEmail: "mrgeniusprogrammer69@gmail.com",
			userImage:
				"https://lh3.googleusercontent.com/a/ACg8ocIxtOkWYErGg7VvCunk_e18IhPEBoMdZPK0bOAoqBjGdkw65A=s40-p-mo",
		}),
		RTE.chainTaskEitherKW((data) =>
			sendEmail({
				to: "mrgeniusprogrammer69@gmail.com",
				...data,
			}),
		),
	)({ logger: logger })().then((value) => logger.info(value));
};
