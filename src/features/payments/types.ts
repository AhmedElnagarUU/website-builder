import type { Types } from "mongoose";

export type PaymentProviderId = "paymob";

export type PaymentStatus =
  | "pending" // initial, waiting on provider
  | "paid" // authoritatively confirmed by webhook
  | "failed"
  | "cancelled" // expired / cancelled before completion
  | "refunded"
  | "voided";

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
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentRecordInput {
  userId: string;
  planId: "pro";
  amountMinorUnits: number;
  currency: string;
  description: string;
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

export interface PaymentSession {
  provider: PaymentProviderId;
  providerPaymentId: string;
  providerOrderId?: string;
  clientSecret: string;
  publicKey: string;
  paymentMethods: string[];
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