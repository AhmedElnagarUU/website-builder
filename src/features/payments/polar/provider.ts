import type { PaymentProvider } from "../provider";
import type {
  CreatePaymentInput,
  PaymentSession,
  PaymentWebhookResult,
} from "../types";
import {
  getPolarProductIdPro,
  getPolarWebhookSecret,
} from "./config";
import { createCheckoutSession, PolarProviderError } from "./client";
import { verifyAndParsePolarWebhook, WebhookVerificationError } from "./hmac";
import { statusFromPolarEvent } from "./status-map";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return undefined;
}

export class PolarProvider implements PaymentProvider {
  async createPayment(input: CreatePaymentInput): Promise<PaymentSession> {
    const result = await createCheckoutSession({
      productId: getPolarProductIdPro(),
      customerExternalId: input.internalPaymentId,
      successUrl: `${APP_URL}/pricing?paymentId=${input.internalPaymentId}`,
      currency: input.currency,
      customerEmail: input.customer.email || undefined,
      customerName: input.customer.name || undefined,
    });

    return {
      provider: "polar",
      providerPaymentId: result.checkoutId,
      clientSecret: result.clientSecret,
      publicKey: "",
      paymentMethods: [],
      url: result.url,
    };
  }

  // `input` is the RAW body string (Standard Webhooks sign the exact bytes),
  // `hmac` the `webhook-signature` header, `timestamp` the
  // `webhook-timestamp` header.
  async handleWebhook(
    input: unknown,
    hmac?: string,
    timestamp?: string,
    webhookId?: string
  ): Promise<PaymentWebhookResult> {
    if (!hmac || !timestamp || !webhookId || typeof input !== "string") {
      throw new PolarProviderError("invalid_hmac");
    }

    const headers: Record<string, string> = {
      "webhook-signature": hmac,
      "webhook-timestamp": timestamp,
      "webhook-id": webhookId,
    };

    let parsed;
    try {
      parsed = verifyAndParsePolarWebhook(
        input,
        headers,
        getPolarWebhookSecret()
      );
    } catch (err) {
      if (err instanceof WebhookVerificationError) {
        throw new PolarProviderError("invalid_hmac");
      }
      throw err;
    }

    const data = parsed.data;
    const orderId = data.order;
    const orderReferenceId =
      orderId && typeof orderId === "object" && typeof (orderId as Record<string, unknown>).id === "string"
        ? String((orderId as Record<string, unknown>).id)
        : undefined;

    return {
      provider: "polar",
      providerTransactionId: String(data.id ?? ""),
      providerOrderId: orderReferenceId,
      status: statusFromPolarEvent(parsed.type),
      amountMinorUnits: toNumber(data.net_amount) ?? toNumber(data.total_amount),
      currency: typeof data.currency === "string" ? data.currency : undefined,
      paymentMethod:
        typeof data.payment_processor === "string"
          ? data.payment_processor
          : undefined,
      metadata: { raw: data, event: parsed.type },
    };
  }
}