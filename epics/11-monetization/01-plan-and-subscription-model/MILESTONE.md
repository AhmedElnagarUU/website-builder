# Milestone 01 — Plan & Subscription Model

## Goal
Define the plan/subscription/billing data model and backfill every user onto a default Free plan so the rest of the system has a stable entitlement source.

## Shared context — THE PLAN MODEL (stated once, binding)
- **Plan** is software-defined data, not hardcoded branches. A `PlanDefinition` lists every limit as a value:
  ```ts
  interface PlanDefinition {
    id: "free" | "pro";
    name: BilingualText;
    limits: {
      maxSites: number;          // total sites
      maxPagesPerSite: number;   // pages/site (Epic 08)
      maxLanguages: 1 | 2;       // 1 = single-locale; 2 = EN+AR
      maxPublishedSites: number; // concurrent published sites
      maxImageBytes: number;     // per-upload
      dailyAiGenerations: number;// AI generate/regenerate per day
      customDomain: boolean;     // reserved for future via S3/live
    };
  }
  ```
- **Subscription** (per user):
  ```ts
  {
    userId: ObjectId;
    planId: "free" | "pro";
    status: "active" | "trialing" | "past_due" | "canceled" | "ended";
    provider?: "manual" | "stripe" | "..."; // gateway late-wired; null/undefined = free
    providerSubscriptionId?: string;        // reserved for gateway
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    trialEndsAt?: Date;
    cancelAtPeriodEnd?: boolean;
    createdAt; updatedAt;
  }
  ```
- **Account status** on the user record: `accountStatus: "active" | "suspended" | "frozen"` (Freeze = read-only/paused billing; Suspended = fully blocked). Admin sets these (Epic 12).
- **Billing ledger** (separate collection, kept lean; Epic 11 M04 fleshes it out).
- All monetary amounts stored as **integer minor units** (e.g. cents/piasters) with a `currency` string — gateway-friendly, no floats.

## Tasks
1. **01-plan-definition-data** — the `PlanDefinition` list (free/pro), typed in a new `src/features/monetization/` feature.
2. **02-subscription-record-and-migration** — `Subscription` model + repository; migrate existing users to active Free subscriptions and add `accountStatus` to the user model (default `active`).
