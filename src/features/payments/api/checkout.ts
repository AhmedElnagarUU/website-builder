import mongoose from "mongoose";
import { getPlanById } from "@/features/monetization/plans";
import { getSubscriptionForUser } from "@/features/monetization/repository";
import type { PaymentProvider } from "../provider";
import {
  createPaymentRecord,
  getPaymentRecordForUser,
  isManualExpired,
  cancelManualPayment,
  updatePaymentAfterProviderSession,
} from "../repository";
import { isManualMethod } from "../lib/payment-methods";
import { getManualPaymentExpiryHours } from "../lib/manual-payment-config";
import { createManualCheckoutSession } from "./manual-payment";
import type { ManualPaymentInstructions, PaymentMethod, PaymentSession, PaymentStatus } from "../types";

export type CheckoutSessionResult =
  | {
      ok: true;
      paymentId: string;
      planId: "pro";
      amountMinorUnits: number;
      currency: string;
      status: PaymentStatus;
      url?: string; // Polar hosted checkout URL the browser should navigate to
      method?: never;
      instructions?: never;
    }
  | {
      ok: true;
      paymentId: string;
      planId: "pro";
      amountMinorUnits: number;
      currency: string;
      status: "initiated";
      method: "vodafone_cash" | "instapay";
      instructions: ManualPaymentInstructions;
      url?: never;
    }
  | {
      ok: false;
      code: "invalid_plan" | "already_pro" | "provider_error" | "phone_required";
      status: number;
    };

export interface CheckoutStatusResult {
  paymentId: string;
  status: PaymentStatus;
  planId: "pro";
  amountMinorUnits: number;
  currency: string;
  updatedAt: Date;
}

/**
 * Lazily constructs the real provider. The module chain (provider → config)
 * runs `requireEnv` at import time and throws when the corresponding secrets
 * are unset, so it is imported only here, at call time, never at module scope.
 * Polar is the ONLY payment provider; missing POLAR_* credentials reject with
 * provider_error/502 at runtime, but the app still builds and boots.
 */
async function getDefaultProvider(): Promise<PaymentProvider> {
  const { PolarProvider } = await import("@/features/payments/polar");
  return new PolarProvider();
}

export async function createCheckoutSession(
  user: { id: string; email?: string; name?: string },
  input: { planId: "pro"; phoneNumber: string; method: PaymentMethod },
  provider?: PaymentProvider
): Promise<CheckoutSessionResult> {
  if (isManualMethod(input.method)) {
    const manual = await createManualCheckoutSession(user, {
      planId: input.planId,
      phoneNumber: input.phoneNumber,
      method: input.method,
    });
    if (manual.ok) {
      return {
        ok: true,
        paymentId: manual.paymentId,
        planId: manual.planId,
        amountMinorUnits: manual.amountMinorUnits,
        currency: manual.currency,
        status: manual.status,
        method: manual.method,
        instructions: manual.instructions,
      };
    }
    return manual;
  }

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
    description: "Pro plan",
  });

  // Provider resolution AND the provider call happen here, after the record is
  // persisted. On any provider failure (including missing POLAR_* credentials,
  // which surface only now) the PaymentRecord stays pending with no provider
  // refs — an orphaned-pending record; the client only ever sees provider_error.
  let session: PaymentSession;
  try {
    const resolvedProvider = provider ?? (await getDefaultProvider());
    session = await resolvedProvider.createPayment({
      internalPaymentId: record._id.toString(),
      planId: "pro",
      amountMinorUnits: plan.priceMinorUnits,
      currency: plan.currency,
      description: "Pro plan",
      customer: {
        email: user.email ?? "",
        name: user.name ?? "",
        phoneNumber: input.phoneNumber,
      },
    });
  } catch (error) {
    console.error(
      `checkout: payment provider rejected the session (plan ${input.planId})`,
      error instanceof Error
        ? {
            message: error.message,
            name: error.name,
            cause: (error as { cause?: unknown }).cause,
            stack: error.stack,
          }
        : error
    );
    return { ok: false, code: "provider_error", status: 502 };
  }

  await updatePaymentAfterProviderSession(record._id.toString(), {
    provider: session.provider,
    providerPaymentId: session.providerPaymentId,
    providerOrderId: session.providerOrderId,
    providerMetadata: {
      hosted_checkout_url: session.url,
      checkout_id: session.providerPaymentId,
    },
  });

  return {
    ok: true,
    paymentId: record._id.toString(),
    planId: "pro",
    amountMinorUnits: plan.priceMinorUnits,
    currency: plan.currency,
    status: "pending",
    url: session.url,
  };
}

export async function getCheckoutStatus(
  paymentId: string,
  userId: string
): Promise<CheckoutStatusResult | null> {
  if (!mongoose.Types.ObjectId.isValid(paymentId)) return null;
  const record = await getPaymentRecordForUser(paymentId, userId);
  if (!record) return null;

  // Un-verified manual payments expire at read time (no background job).
  if (
    isManualMethod(record.paymentMethod) &&
    isManualExpired(record, new Date(), getManualPaymentExpiryHours())
  ) {
    await cancelManualPayment(paymentId, userId);
    record.status = "cancelled";
    record.updatedAt = new Date();
  }

  return {
    paymentId: record._id.toString(),
    status: record.status,
    planId: record.planId,
    amountMinorUnits: record.amountMinorUnits,
    currency: record.currency,
    updatedAt: record.updatedAt,
  };
}