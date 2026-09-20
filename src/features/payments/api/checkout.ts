import mongoose from "mongoose";
import { getPlanById } from "@/features/monetization/plans";
import { getSubscriptionForUser } from "@/features/monetization/repository";
import type { PaymentProvider } from "../provider";
import {
  createPaymentRecord,
  getPaymentRecordForUser,
  updatePaymentAfterProviderSession,
} from "../repository";
import type { PaymentSession, PaymentStatus } from "../types";

export type CheckoutSessionResult =
  | {
      ok: true;
      paymentId: string;
      planId: "pro";
      amountMinorUnits: number;
      currency: string;
      status: PaymentStatus;
      clientSecret: string;
      publicKey: string;
      paymentMethods: string[];
      url?: string; // hosted checkout URL (Polar); undefined for Paymob's pixel flow
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
 * Lazily constructs the real PaymobProvider. The module chain (provider →
 * config) runs `requireEnv` at import time and throws when PAYMOB_* is unset,
 * so it is imported only here, at call time, never at module scope. Without
 * credentials this rejects with provider_error/502 at runtime; the app still
 * builds and boots.
 */
async function getDefaultProvider(): Promise<PaymentProvider> {
  const { PaymobProvider } = await import("@/features/payments/paymob");
  return new PaymobProvider();
}

export async function createCheckoutSession(
  user: { id: string; email?: string; name?: string },
  input: { planId: "pro"; phoneNumber: string },
  provider?: PaymentProvider
): Promise<CheckoutSessionResult> {
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
  // persisted. On any provider failure (including missing PAYMOB_* credentials,
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
      error instanceof Error ? error.message : String(error)
    );
    return { ok: false, code: "provider_error", status: 502 };
  }

  await updatePaymentAfterProviderSession(record._id.toString(), {
    provider: session.provider,
    providerPaymentId: session.providerPaymentId,
    providerOrderId: session.providerOrderId,
    providerMetadata: { clientSecret: session.clientSecret },
  });

  return {
    ok: true,
    paymentId: record._id.toString(),
    planId: "pro",
    amountMinorUnits: plan.priceMinorUnits,
    currency: plan.currency,
    status: "pending",
    clientSecret: session.clientSecret,
    publicKey: session.publicKey,
    paymentMethods: session.paymentMethods,
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
  return {
    paymentId: record._id.toString(),
    status: record.status,
    planId: record.planId,
    amountMinorUnits: record.amountMinorUnits,
    currency: record.currency,
    updatedAt: record.updatedAt,
  };
}