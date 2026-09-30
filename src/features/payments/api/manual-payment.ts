import type {
  ManualPaymentInstructions,
  ManualPaymentMethod,
} from "../types";
import { getPlanById } from "@/features/monetization/plans";
import { getSubscriptionForUser } from "@/features/monetization/repository";
import { manualProofSchema } from "../schema";
import {
  cancelManualPayment,
  createPaymentRecord,
  getPaymentRecordById,
  getPaymentRecordForUser,
  isManualExpired,
  makeManualEventId,
  submitManualProofForUser,
  verifyManualPaymentRecord,
} from "../repository";
import {
  getManualPaymentExpiryHours,
  getManualPaymentInstructions,
} from "../lib/manual-payment-config";
import { isAdminEmail } from "../lib/admin";
import { isManualMethod } from "../lib/payment-methods";
import { nextPeriodEnd } from "../lib/period";
import {
  appendBillingRecord,
  restoreAccount,
  upsertSubscription,
} from "@/features/monetization/repository";

export type ManualCheckoutResult =
  | {
      ok: true;
      paymentId: string;
      planId: "pro";
      amountMinorUnits: number;
      currency: string;
      status: "initiated";
      method: ManualPaymentMethod;
      instructions: ManualPaymentInstructions;
    }
  | {
      ok: false;
      code: "invalid_plan" | "already_pro";
      status: number;
    };

export async function createManualCheckoutSession(
  user: { id: string; email?: string; name?: string },
  input: { planId: "pro"; phoneNumber: string; method: ManualPaymentMethod }
): Promise<ManualCheckoutResult> {
  const plan = getPlanById(input.planId);
  if (!plan || typeof plan.priceMinorUnits !== "number" || !plan.currency) {
    return { ok: false, code: "invalid_plan", status: 400 };
  }

  const subscription = await getSubscriptionForUser(user.id);
  if (subscription?.status === "active" && subscription.provider) {
    return { ok: false, code: "already_pro", status: 409 };
  }

  const record = await createPaymentRecord({
    userId: user.id,
    planId: "pro",
    amountMinorUnits: plan.priceMinorUnits,
    currency: plan.currency,
    description: `Pro plan (${input.method})`,
    status: "initiated",
    paymentMethod: input.method,
  });

  return {
    ok: true,
    paymentId: record._id.toString(),
    planId: "pro",
    amountMinorUnits: plan.priceMinorUnits,
    currency: plan.currency,
    status: "initiated",
    method: input.method,
    instructions: getManualPaymentInstructions(input.method),
  };
}

export type ManualProofResult =
  | { ok: true; status: "awaiting_verification" }
  | { ok: false; code: "validation_error" | "not_found" | "expired" | "invalid_state" };

export async function submitManualProof(
  paymentId: string,
  userId: string,
  body: unknown
): Promise<ManualProofResult> {
  const parsed = manualProofSchema.safeParse(body);
  if (!parsed.success) return { ok: false, code: "validation_error" };

  const record = await getPaymentRecordForUser(paymentId, userId);
  if (!record || !isManualMethod(record.paymentMethod)) {
    return { ok: false, code: "not_found" };
  }

  if (isManualExpired(record, new Date(), getManualPaymentExpiryHours())) {
    await cancelManualPayment(paymentId, userId);
    return { ok: false, code: "expired" };
  }

  const submitted = await submitManualProofForUser(paymentId, userId, parsed.data);
  if (!submitted) return { ok: false, code: "invalid_state" };
  return { ok: true, status: "awaiting_verification" };
}

export type VerifyManualPaymentResult =
  | { ok: true }
  | { ok: false; code: "not_admin" | "not_found" | "invalid_state" };

export async function verifyManualPayment(
  paymentId: string,
  actorEmail: string
): Promise<VerifyManualPaymentResult> {
  if (!isAdminEmail(actorEmail)) return { ok: false, code: "not_admin" };

  const record = await getPaymentRecordById(paymentId);
  if (!record || !isManualMethod(record.paymentMethod)) {
    return { ok: false, code: "not_found" };
  }

  if (isManualExpired(record, new Date(), getManualPaymentExpiryHours())) {
    await cancelManualPayment(paymentId, record.userId.toString());
    return { ok: false, code: "invalid_state" };
  }

  const claimed = await verifyManualPaymentRecord(
    paymentId,
    record.userId.toString()
  );
  if (!claimed) return { ok: false, code: "invalid_state" };

  const userId = record.userId.toString();
  const amountMinorUnits = record.amountMinorUnits;
  const currency = record.currency;
  const now = new Date();
  const eventId = makeManualEventId(paymentId, "sub");

  await upsertSubscription({
    userId,
    planId: "pro",
    status: "active",
    provider: "manual",
    providerSubscriptionId: eventId,
    currency,
    amountMinorUnits,
    currentPeriodStart: now,
    currentPeriodEnd: nextPeriodEnd(now),
    trialEndsAt: undefined,
  });

  await appendBillingRecord({
    userId,
    kind: "gateway_charge",
    amountMinor: amountMinorUnits,
    currency,
    provider: "manual",
    providerEventId: makeManualEventId(paymentId, "charge"),
    createdBy: "admin_manual",
    description: `${record.paymentMethod} payment (Pro monthly)`,
  });

  await restoreAccount(userId);
  return { ok: true };
}