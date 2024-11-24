import { redirect } from "@sveltejs/kit";
import { isSome } from "fp-ts/lib/Option";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	if (isSome(event.locals.user) || isSome(event.locals.session)) {
		throw redirect(302, "/");
	}
};
