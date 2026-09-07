import { z } from "zod";
import { ObjectId } from "mongodb";
import { adminSetSubscription, getSubscriptionForUser, userExists } from "../repository";
import { requireAdmin } from "../lib/admin-auth";
import type { Subscription } from "../types";

export const adminSetSubscriptionSchema = z
  .object({
    planId: z.enum(["free", "pro"]),
    status: z.enum([
      "active",
      "trialing",
      "past_due",
      "canceled",
      "ended",
    ]),
    currency: z
      .string()
      .regex(/^[A-Z]{3}$/, "currency must be a 3-letter code")
      .optional(),
    amountMinor: z
      .number()
      .int("amountMinor must be an integer")
      .nonnegative()
      .optional(),
    currentPeriodStart: z
      .string()
      .datetime()
      .optional()
      .transform((v) => (v ? new Date(v) : undefined)),
    currentPeriodEnd: z
      .string()
      .datetime()
      .optional()
      .transform((v) => (v ? new Date(v) : undefined)),
    trialEndsAt: z
      .string()
      .datetime()
      .optional()
      .transform((v) => (v ? new Date(v) : undefined)),
    cancelAtPeriodEnd: z.boolean().optional(),
  })
  .strip();

export type AdminSetSubscriptionResult =
  | { ok: true; subscription: Subscription }
  | { ok: false; error: "unauthorized" | "forbidden" | "not_found" | "invalid_input" };

export async function adminSetSubscriptionForUser(
  userId: string,
  rawBody: unknown
): Promise<AdminSetSubscriptionResult> {
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

  const parsed = adminSetSubscriptionSchema.safeParse(rawBody);
  if (!parsed.success) {
    return { ok: false, error: "invalid_input" };
  }

  await adminSetSubscription(userId, parsed.data);
  const subscription = await getSubscriptionForUser(userId);
  if (!subscription) return { ok: false, error: "not_found" };
  return { ok: true, subscription };
}