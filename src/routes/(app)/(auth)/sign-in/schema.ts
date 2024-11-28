import { UserEmail } from "@/entities/user";
import { z } from "zod";

export const formSchema = z.object({
	userEmail: UserEmail,
});

export type FormSchema = z.infer<typeof formSchema>;
