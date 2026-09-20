import type {
  CreatePaymentInput,
  PaymentSession,
  PaymentWebhookResult,
} from "./types";

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<PaymentSession>;
  handleWebhook(
    input: unknown,
    hmac?: string,
    timestamp?: string,
    webhookId?: string
  ): Promise<PaymentWebhookResult>;
}