import { UserName } from "@/entities/user";
import { z } from "zod";

export const formSchema = z.object({
	userName: UserName,
});

export type FormSchema = z.infer<typeof formSchema>;
