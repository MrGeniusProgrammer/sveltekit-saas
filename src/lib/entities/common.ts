import { z } from "zod";

export type CreatedAt = Date;
export const CreatedAt = z.date();

export type UpdatedAt = Date;
export const UpdatedAt = z.date();
