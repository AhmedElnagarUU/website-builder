import type { PaymentProvider } from "../provider";
import type {
  CreatePaymentInput,
  PaymentSession,
  PaymentWebhookResult,
} from "../types";
import { PAYMOB_HMAC_SECRET, PAYMOB_PAYMENT_METHODS, PAYMOB_PUBLIC_KEY } from "./config";
import { createPaymobIntention, PaymobProviderError } from "./client";
import { verifyTransactionHmac } from "./hmac";
import { statusFromTransaction } from "./status-map";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const NOTIFICATION_URL = `${APP_URL}/api/webhooks/paymob`;

function splitName(name: string): { first: string; last: string } {
  const trimmed = name.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) {
    const single = trimmed || "NA";
    return { first: single, last: "NA" };
  }
  return {
    first: trimmed.slice(0, spaceIndex).trim() || "NA",
    last: trimmed.slice(spaceIndex + 1).trim() || "NA",
  };
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function sourceDataType(obj: Record<string, unknown>): string | undefined {
  const sourceData = obj.source_data;
  if (sourceData && typeof sourceData === "object") {
    const type = (sourceData as Record<string, unknown>).type;
    if (typeof type === "string" || typeof type === "number") return String(type);
  }
  return undefined;
}

// PAN lives under source_data and is sensitive — never persist it.
function stripSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...obj };
  delete copy.source_data;
  return copy;
}

interface WebhookPayload {
  type?: unknown;
  obj?: Record<string, unknown>;
}

export class PaymobProvider implements PaymentProvider {
  async createPayment(input: CreatePaymentInput): Promise<PaymentSession> {
    if (!input.customer.phoneNumber || !input.customer.phoneNumber.trim()) {
      throw new PaymobProviderError("billing phone_number is required");
    }

    const { first, last } = splitName(input.customer.name);
    const result = await createPaymobIntention({
      amount: input.amountMinorUnits,
      currency: input.currency,
      paymentMethods: PAYMOB_PAYMENT_METHODS,
      items: [{ name: input.description, amount: input.amountMinorUnits }],
      billingData: {
        first_name: first,
        last_name: last,
        email: input.customer.email || undefined,
        phone_number: input.customer.phoneNumber,
      },
      notificationUrl: NOTIFICATION_URL,
      specialReference: input.internalPaymentId,
    });

    return {
      provider: "paymob",
      providerPaymentId: result.intentionId,
      providerOrderId: result.orderId,
      clientSecret: result.clientSecret,
      publicKey: PAYMOB_PUBLIC_KEY,
      paymentMethods: PAYMOB_PAYMENT_METHODS,
    };
  }

  async handleWebhook(input: unknown, hmac?: string): Promise<PaymentWebhookResult> {
    if (!hmac) throw new PaymobProviderError("invalid_hmac");

    const payload = input as WebhookPayload;
    const obj = payload?.obj;
    if (!obj || typeof obj !== "object") {
      throw new PaymobProviderError("invalid_hmac");
    }

    const valid = verifyTransactionHmac(obj, hmac, PAYMOB_HMAC_SECRET);
    if (!valid) throw new PaymobProviderError("invalid_hmac");

    // `special_reference` (our PaymentRecord id) is echoed back by Paymob as
    // `order.merchant_order_id` — that is what resolves to our record via
    // findPaymentByReference. Paymob's own `order.id` stays in metadata.raw.
    const order = obj.order;
    const orderRecord =
      order && typeof order === "object"
        ? (order as Record<string, unknown>)
        : undefined;
    const merchantOrderId = orderRecord
      ? String(orderRecord.merchant_order_id ?? "")
      : "";

    return {
      provider: "paymob",
      providerTransactionId: String(obj.id ?? ""),
      providerOrderId: merchantOrderId || undefined,
      status: statusFromTransaction(obj),
      amountMinorUnits: toNumber(obj.amount_cents),
      currency: typeof obj.currency === "string" ? obj.currency : undefined,
      paymentMethod: sourceDataType(obj),
      metadata: { raw: stripSensitive(obj) },
    };
  }
}