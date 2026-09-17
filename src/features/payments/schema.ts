import { z } from "zod";

export const checkoutSchema = z.object({
  planId: z.literal("pro"),
  phoneNumber: z.string().min(8).max(20), // E.164-ish; Paymob requires phone
});