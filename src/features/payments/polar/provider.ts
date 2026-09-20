import type { PaymentProvider } from "../provider";
import type {
  CreatePaymentInput,
  PaymentSession,
  PaymentWebhookResult,
} from "../types";
import {
  getPolarPriceIdPro,
  getPolarProductIdPro,
  getPolarWebhookSecret,
} from "./config";
import { createCheckoutSession, PolarProviderError } from "./client";
import { verifyPolarWebhookHmac } from "./hmac";
import { statusFromPolarEvent } from "./status-map";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface PolarWebhookPayload {
  type?: unknown;
  data?: Record<string, unknown>;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : undefined;
}

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
      priceId: getPolarPriceIdPro(),
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

    const valid = verifyPolarWebhookHmac(
      input,
      hmac,
      getPolarWebhookSecret(),
      timestamp,
      webhookId
    );
    if (!valid) throw new PolarProviderError("invalid_hmac");

    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch {
      throw new PolarProviderError("invalid_hmac");
    }
    const payload =
      parsed && typeof parsed === "object"
        ? (parsed as PolarWebhookPayload)
        : {};

    const type = typeof payload.type === "string" ? payload.type : "";
    const data = asRecord(payload.data);
    if (!type || !data) throw new PolarProviderError("invalid_hmac");

    const orderId = asRecord(data.order)?.id;
    const transactionId = String(data.id ?? "");
    const orderReferenceId =
      typeof orderId === "string" ? orderId : undefined;

    return {
      provider: "polar",
      providerTransactionId: transactionId,
      providerOrderId: orderReferenceId,
      status: statusFromPolarEvent(type),
      amountMinorUnits: toNumber(data.net_amount) ?? toNumber(data.total_amount),
      currency: typeof data.currency === "string" ? data.currency : undefined,
      paymentMethod:
        typeof data.payment_processor === "string"
          ? data.payment_processor
          : undefined,
      metadata: { raw: data, event: type },
    };
  }
}