import { z } from "zod";
import { UserId } from "./user";

export const SessionId = z.string().min(1);
export type SessionId = typeof SessionId._output;

export const SessionExpiresAt = z.date();
export type SessionExpiresAt = typeof SessionExpiresAt._output;

export const Session = z.object({
	id: SessionId,
	userId: UserId,
	expiresAt: SessionExpiresAt,
});
export type Session = typeof Session._output;
