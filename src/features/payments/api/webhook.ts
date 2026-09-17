import type { PaymentRecord, PaymentStatus, PaymentWebhookResult } from "../types";
import {
  findPaymentByProviderTransactionId,
  findPaymentByReference,
  markPaymentStatus,
} from "../repository";
import {
  appendBillingRecord,
  restoreAccount,
  upsertSubscription,
} from "@/features/monetization/repository";

export type WebhookOutcome = "processed" | "duplicate_ignored" | "payment_not_found";

// Refunds/voids are future work: statusFromTransaction (M02) never emits
// "refunded"/"voided", so this module only applies paid/failed/pending.

const TERMINAL_STATUSES: PaymentStatus[] = [
  "paid",
  "failed",
  "refunded",
  "voided",
  "cancelled",
];

function isTerminal(status: PaymentStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

// Same code-11000 duplicate pattern as storePhoneIdentity (no driver types).
function isDuplicateKeyError(err: unknown): boolean {
  return (
    err instanceof Error &&
    "code" in err &&
    (err as { code: number }).code === 11000
  );
}

// +30 days via setDate, mirroring the trial pattern in
// monetization/repository.ts resolveSubscriptionForUser (not calendar months).
function nextPeriodEnd(now: Date): Date {
  const end = new Date(now);
  end.setDate(end.getDate() + 30);
  return end;
}

/**
 * Authoritative webhook processing. Order matters (MILESTONE M04):
 * 1. resolve by transaction id (unique sparse) -> terminal means duplicate,
 *    pending means continue the transition;
 * 2. else resolve by order reference -> missing means payment_not_found;
 * 3. the paid transition claims the transaction id atomically inside the
 *    status update, re-reads it, then upgrades subscription -> billing row
 *    (unique sparse providerEventId) -> account restore.
 */
export async function processPaymobWebhook(
  result: PaymentWebhookResult
): Promise<{ outcome: WebhookOutcome }> {
  const byTransaction = await findPaymentByProviderTransactionId(
    result.providerTransactionId
  );
  if (byTransaction) {
    if (isTerminal(byTransaction.status)) {
      return { outcome: "duplicate_ignored" };
    }
    return transition(byTransaction, result);
  }

  if (!result.providerOrderId) {
    return { outcome: "payment_not_found" };
  }
  const byReference = await findPaymentByReference(result.providerOrderId);
  if (!byReference) {
    console.error("paymob webhook: unknown payment reference (ignored)");
    return { outcome: "payment_not_found" };
  }
  if (isTerminal(byReference.status)) {
    return { outcome: "duplicate_ignored" };
  }
  return transition(byReference, result);
}

async function transition(
  payment: PaymentRecord,
  result: PaymentWebhookResult
): Promise<{ outcome: WebhookOutcome }> {
  if (result.status === "paid") {
    // Claim the transaction id in the SAME update that flips pending -> paid:
    // the unique sparse index on providerTransactionId rejects a second record
    // trying to claim the same transaction (markPaymentStatus swallows 11000).
    await markPaymentStatus(payment._id.toString(), "paid", {
      providerTransactionId: result.providerTransactionId,
      paymentMethod: result.paymentMethod,
      providerMetadata: result.metadata,
    });

    // Belt and suspenders: re-read by transaction id. If the claim was lost to
    // a concurrent callback, fulfill only the record that owns the transaction.
    const claimed = await findPaymentByProviderTransactionId(
      result.providerTransactionId
    );
    if (!claimed || claimed.status !== "paid") {
      return { outcome: "duplicate_ignored" };
    }

    const userId = claimed.userId.toString();
    const amountMinorUnits = result.amountMinorUnits ?? 49900;
    const currency = result.currency ?? "EGP";
    const now = new Date();

    await upsertSubscription({
      userId,
      planId: "pro",
      status: "active",
      provider: "paymob",
      providerSubscriptionId: result.providerTransactionId,
      currency,
      amountMinorUnits,
      currentPeriodStart: now,
      currentPeriodEnd: nextPeriodEnd(now),
      trialEndsAt: undefined,
    });

    try {
      await appendBillingRecord({
        userId,
        kind: "gateway_charge",
        amountMinor: amountMinorUnits,
        currency,
        provider: "paymob",
        providerEventId: result.providerTransactionId,
        createdBy: "gateway",
        description: "Paymob charge (Pro monthly)",
      });
    } catch (err) {
      if (isDuplicateKeyError(err)) {
        // Same transaction already billed: unique sparse providerEventId.
        return { outcome: "duplicate_ignored" };
      }
      throw err;
    }

    await restoreAccount(userId);
    return { outcome: "processed" };
  }

  if (result.status === "failed") {
    await markPaymentStatus(payment._id.toString(), "failed", {
      providerTransactionId: result.providerTransactionId,
      paymentMethod: result.paymentMethod,
    });
    return { outcome: "processed" };
  }

  // "pending" still awaiting completion (and out-of-scope refunded/voided):
  // no state write.
  return { outcome: "processed" };
}