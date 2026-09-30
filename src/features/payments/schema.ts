import { z } from "zod";

export const paymentMethodSchema = z.enum(["polar", "vodafone_cash", "instapay"]);

export const checkoutSchema = z.object({
  planId: z.literal("pro"),
  phoneNumber: z.string().min(8).max(20), // E.164-ish billing phone, relayed to the provider
  name: z.string().trim().max(120).optional(),
  method: paymentMethodSchema.default("polar"),
});

export const manualProofSchema = z.object({
  reference: z.string().trim().min(3).max(80),
  paidAt: z.string().trim().max(10).optional(), // ISO date string, display only
  note: z.string().trim().max(500).optional(),
});