import { z } from "zod";
import { CreatedAt } from "./common";

export const UserId = z.string().min(1);
export type UserId = typeof UserId._output;

export const UserName = z.string().min(1);
export type UserName = typeof UserName._output;

export const UserEmail = z.string().min(1).email();
export type UserEmail = typeof UserEmail._output;

export const UserImage = z.string().min(1).url().nullish();
export type UserImage = typeof UserImage._output;

export const User = z.object({
	id: UserId,
	name: UserName,
	email: UserEmail,
	image: UserImage,
	createdAt: CreatedAt,
});
export type User = typeof User._output;
