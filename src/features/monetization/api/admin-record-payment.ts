import { z } from "zod";
import { ObjectId } from "mongodb";
import { appendBillingRecord, userExists } from "../repository";
import { requireAdmin } from "../lib/admin-auth";
import type { BillingRecord } from "../types";

export const adminRecordPaymentSchema = z
  .object({
    kind: z.enum(["manual_payment", "manual_discount", "write_off", "credit"]),
    amountMinor: z.number().int("amountMinor must be an integer"),
    currency: z.string().regex(/^[A-Z]{3}$/, "currency must be a 3-letter code"),
    description: z.string().max(500).optional(),
    siteId: z.string().refine((v) => ObjectId.isValid(v), "invalid siteId").optional(),
  })
  .strip();

export type AdminRecordPaymentResult =
  | { ok: true; record: BillingRecord }
  | {
      ok: false;
      error: "unauthorized" | "forbidden" | "not_found" | "invalid_input";
    };

export async function adminRecordPaymentForUser(
  userId: string,
  rawBody: unknown
): Promise<AdminRecordPaymentResult> {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return {
      ok: false,
      error: auth.response.status === 401 ? "unauthorized" : "forbidden",
    };
  }

  if (!ObjectId.isValid(userId)) {
    return { ok: false, error: "not_found" };
  }
  const exists = await userExists(userId);
  if (!exists) return { ok: false, error: "not_found" };

  const parsed = adminRecordPaymentSchema.safeParse(rawBody);
  if (!parsed.success) {
    return { ok: false, error: "invalid_input" };
  }

  const record = await appendBillingRecord({
    userId,
    siteId: parsed.data.siteId,
    kind: parsed.data.kind,
    amountMinor: parsed.data.amountMinor,
    currency: parsed.data.currency,
    description: parsed.data.description,
    provider: "manual",
    createdBy: auth.adminUserId,
  });
  return { ok: true, record };
}