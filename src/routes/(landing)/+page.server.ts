import ResetPassword from "@/emails/reset-password.svelte";
import { logger } from "@/helpers/logger";
import { render } from "svelte/server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const data = render(ResetPassword, { props: { code: "05040" } });
	logger.info(data, "Rendring component");
	return {
		data: [],
	};
};
