import type { ObjectId } from "mongodb";

export interface BilingualText {
  en: string;
  ar: string;
}

export interface PlanLimits {
  maxSites: number;
  maxPagesPerSite: number;
  maxLanguages: 1 | 2;
  maxPublishedSites: number;
  maxImageBytes: number;
  dailyAiGenerations: number;
  customDomain: boolean;
}

export interface PlanDefinition {
  id: PlanId;
  name: BilingualText;
  limits: PlanLimits;
}

export type PlanId = "free" | "pro";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "ended";

export type PaymentProvider = "manual" | "stripe";

export type AccountStatus = "active" | "suspended" | "frozen";

export type AdminRole = "user" | "super_admin";

export type BillingKind =
  | "manual_payment"
  | "manual_discount"
  | "write_off"
  | "gateway_charge"
  | "gateway_refund"
  | "credit";

export interface BillingRecord {
  _id: ObjectId;
  userId: ObjectId;
  siteId?: ObjectId;
  kind: BillingKind;
  amountMinor: number;
  currency: string;
  description?: string;
  provider?: PaymentProvider | string;
  providerEventId?: string;
  createdBy: string;
  createdAt: Date;
}

export interface CreateBillingRecordInput {
  userId: string;
  siteId?: string;
  kind: BillingKind;
  amountMinor: number;
  currency: string;
  description?: string;
  provider?: PaymentProvider | string;
  providerEventId?: string;
  createdBy: string;
}

export interface BillingFilters {
  kind?: BillingKind;
  provider?: string;
  since?: Date;
}

export interface CurrencyTotal {
  currency: string;
  totalMinor: number;
  count: number;
}

export type LimitKey = keyof PlanLimits;

export type LimitReason =
  | "limit_reached"
  | "requires_upgrade"
  | "account_frozen"
  | "account_suspended";

export interface UsageSnapshot {
  totalSites: number;
  pagesPerSite: Record<string, number>;
  languagesPerSite: Record<string, number>;
  publishedSites: number;
  publishedSiteIds: string[];
  aiGenerationsToday: number;
  largestImageBytes: number;
}

export type RequestedScope = number | { siteId: string; amount: number };

export type CheckLimitResult =
  | { ok: true; remaining: number }
  | {
      ok: false;
      reason: LimitReason;
      limitKey: LimitKey;
      limit: number;
      used: number;
    };

export type CheckLimitRejected = Extract<CheckLimitResult, { ok: false }>;

export interface Subscription {
  _id: ObjectId;
  userId: ObjectId;
  planId: PlanId;
  status: SubscriptionStatus;
  provider?: PaymentProvider;
  providerSubscriptionId?: string;
  currency?: string;
  amountMinorUnits?: number;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  trialEndsAt?: Date;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionInput {
  userId: string;
  planId: PlanId;
  status: SubscriptionStatus;
  provider?: PaymentProvider;
  providerSubscriptionId?: string;
  currency?: string;
  amountMinorUnits?: number;
}

export type UpdateSubscriptionPatch = Partial<
  Omit<Subscription, "_id" | "userId" | "createdAt">
>;
