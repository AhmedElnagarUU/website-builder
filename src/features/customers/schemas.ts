import { z } from "zod";

const trimmedString = (max: number) =>
  z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1).max(max));

const optionalString = (max: number) =>
  trimmedString(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const createCustomerSchema = z
  .object({
    name: trimmedString(120),
    email: z
      .string()
      .trim()
      .max(200)
      .email()
      .optional()
      .or(z.literal("").transform(() => undefined)),
    phone: optionalString(40),
  })
  .strip();

export const updateCustomerSchema = z
  .object({
    name: trimmedString(120).optional(),
    email: z
      .string()
      .trim()
      .max(200)
      .email()
      .optional()
      .or(z.literal("").transform(() => undefined)),
    phone: optionalString(40),
    notes: z.array(trimmedString(500)).optional(),
  })
  .strip();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
