import { z } from "zod";
import { REQUEST_STATUSES } from "./types";

const trimmedString = (max: number) =>
  z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1).max(max));

export const createRequestFromDashboardSchema = z
  .object({
    customerId: z.string().min(1),
    serviceId: z.string().optional(),
    message: trimmedString(2000).optional(),
  })
  .strip();

export const updateRequestStatusSchema = z
  .object({
    status: z.enum(REQUEST_STATUSES),
  })
  .strip();

export const addRequestNoteSchema = z
  .object({
    note: trimmedString(1000),
  })
  .strip();

export const submitPublicRequestSchema = z
  .object({
    name: trimmedString(120),
    email: z
      .string()
      .trim()
      .max(200)
      .email()
      .optional()
      .or(z.literal("").transform(() => undefined)),
    phone: trimmedString(40)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    serviceId: z.string().optional(),
    message: trimmedString(2000),
  })
  .strip();

export type CreateRequestInput = z.infer<typeof createRequestFromDashboardSchema>;
export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;
export type AddRequestNoteInput = z.infer<typeof addRequestNoteSchema>;
export type SubmitPublicRequestInput = z.infer<typeof submitPublicRequestSchema>;
