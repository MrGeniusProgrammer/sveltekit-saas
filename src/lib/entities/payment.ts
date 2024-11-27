import { z } from "zod";

export const PaymentVariantId = z.number();
export type PaymentVariantId = typeof PaymentVariantId._output;

export const PaymentCheckoutUrl = z.string().min(1).url();
export type PaymentCheckoutUrl = typeof PaymentCheckoutUrl._output;
