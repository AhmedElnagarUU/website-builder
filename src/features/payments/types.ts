import type { Types } from "mongoose";

export type PaymentProviderId = "polar";

// Payment method the user picked, distinct from the provider that executes
// the payment. Manual methods (Vodafone Cash / InstaPay) have no automated
// provider: they go through PaymentRecord + human verification.
export type PaymentMethod = "polar" | "vodafone_cash" | "instapay";
export type ManualPaymentMethod = Extract<PaymentMethod, "vodafone_cash" | "instapay">;

export type PaymentStatus =
  | "pending" // polar: initial, waiting on provider
  | "initiated" // manual: instructions shown, waiting for user proof
  | "awaiting_verification" // manual: proof submitted, waiting for admin
  | "paid" // authoritatively confirmed (polar webhook or manual admin verify)
  | "failed"
  | "cancelled" // expired / cancelled before completion
  | "refunded"
  | "voided";

export interface ManualProof {
  reference: string;
  paidAt?: string;
  note?: string;
}

export interface PaymentRecord {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  planId: "pro";
  status: PaymentStatus;
  amountMinorUnits: number;
  currency: string;
  description?: string;
  provider?: PaymentProviderId;
  providerPaymentId?: string;
  providerOrderId?: string;
  providerTransactionId?: string;
  providerMetadata?: Record<string, unknown>;
  paymentMethod?: PaymentMethod;
  proof?: ManualProof;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentRecordInput {
  userId: string;
  planId: "pro";
  amountMinorUnits: number;
  currency: string;
  description: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

export interface CreatePaymentInput {
  internalPaymentId: string; // PaymentRecord._id as string
  planId: "pro";
  amountMinorUnits: number;
  currency: string;
  description: string;
  customer: {
    email: string;
    name: string;
    phoneNumber: string;
  };
}

export interface ManualPaymentInstructions {
  method: ManualPaymentMethod;
  number: string;
}

export interface PaymentSession {
  provider: PaymentProviderId;
  providerPaymentId: string;
  providerOrderId?: string;
  url: string; // Polar hosted checkout redirect URL
}

export interface PaymentWebhookResult {
  provider: PaymentProviderId;
  providerTransactionId: string;
  providerOrderId?: string;
  status: "paid" | "failed" | "pending" | "refunded" | "voided";
  amountMinorUnits?: number;
  currency?: string;
  paymentMethod?: string;
  metadata: Record<string, unknown>;
}