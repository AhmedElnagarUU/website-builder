# Milestone 01 — Payment Domain (abstraction + record + data)

## Goal

Establish the provider-agnostic payment foundation the whole epic builds on, without touching Paymob-specific code yet:

1. `PaymentProvider` abstraction (interface + input/session/result DTOs).
2. `PaymentRecord` persistence (schema + repository) with terminal/pending states and an idempotency seam.
3. Pro plan price in the catalog (EGP 499 = `49900` minor units).
4. Paymob config module + env vars in `.env.example`.

## Shared contract (stated once, binding for all later milestones)

### Provider boundary — `src/features/payments/provider.ts`

```ts
export interface CreatePaymentInput {
  internalPaymentId: string;      // PaymentRecord._id as string
  planId: "pro";
  amountMinorUnits: number;       // server-computed, never client
  currency: string;               // "EGP"
  description: string;            // e.g. "Monomastic Pro — monthly"
  customer: {
    email: string;
    name: string;                 // full name, may be empty in signup
    phoneNumber: string;          // billing_data.phone_number is REQUIRED by Paymob
  };
}

export interface PaymentSession {
  provider: PaymentProviderId;    // "paymob"
  providerPaymentId: string;      // provider's intention/payment id
  providerOrderId?: string;       // provider's order id
  clientSecret: string;           // safe to send to browser
  publicKey: string;              // provider public key for the Pixel
  paymentMethods: string[];       // e.g. ["card","google-pay","apple-pay"]
}

export interface PaymentWebhookResult {
  provider: PaymentProviderId;
  providerTransactionId: string;  // idempotency key (unique sparse)
  providerOrderId?: string;       // maps back to our record via special_reference
  status: "paid" | "failed" | "pending" | "refunded" | "voided";
  amountMinorUnits?: number;
  currency?: string;
  paymentMethod?: string;
  metadata: Record<string, unknown>;
}

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<PaymentSession>;
  handleWebhook(input: unknown, hmac?: string): Promise<PaymentWebhookResult>;
}

export type PaymentProviderId = "paymob";
```

Other files may export extra internal helpers, but these exported names/signatures are what `03`/`04` depend on — do not rename them.

### PaymentRecord — `src/features/payments/payment-record.schema.ts` + types

```ts
export type PaymentStatus =
  | "pending"   // initial, waiting on provider
  | "paid"      // authoritatively confirmed by webhook
  | "failed"
  | "cancelled" // expired / cancelled before completion
  | "refunded"
  | "voided";
```

Schema (`timestamps: false`, manage `createdAt`/`updatedAt` in repo like the rest of the app):
- `userId: ObjectId` (indexed, non-unique)
- `planId: "pro"`
- `status: PaymentStatus` (default `"pending"`, indexed)
- `amountMinorUnits: number`
- `currency: string`
- `description?: string`
- `provider?: PaymentProviderId`  — set once provider call succeeds
- `providerPaymentId?: string`    — Paymob intention `id`
- `providerOrderId?: string`      — Paymob `intention_order_id`
- `providerTransactionId?: string`— webhook transaction id (unique sparse index = idempotency seam)
- `providerMetadata?: Mixed`      — provider-specific payload kept at the boundary
- `paymentMethod?: string`
- `createdAt: Date`, `updatedAt: Date`

Repository — `src/features/payments/repository.ts`:
- `createPaymentRecord(input: { userId: string; planId: "pro"; amountMinorUnits: number; currency: string; description: string; }): Promise<PaymentRecord>` (snake-case fields in the row; `createdBy` not needed here)
- `getPaymentRecordForUser(paymentId: string, userId: string): Promise<PaymentRecord | null>` (ownership check — 404 pattern)
- `updatePaymentAfterProviderSession(paymentId, patch: { provider, providerPaymentId, providerOrderId, providerMetadata? }): Promise<void>`
- `markPaymentStatus(paymentId, status, extra?: { providerTransactionId?, paymentMethod?, providerMetadata? }): Promise<void>`
- `findPaymentByProviderTransactionId(providerTransactionId: string): Promise<PaymentRecord | null>` (idempotency read)
- `findPaymentByReference(ref: string): Promise<PaymentRecord | null>` — resolves our own record from `special_reference` (`order.merchant_order_id`) on webhook

Follow the exact existing repo style (`repositories read from `getModel`/schema modules, `.lean()`, snake_case fields, code-11000 duplicate handling, never raw `mongodb` driver type imports — use `mongoose.Types.ObjectId` like `monetization/repository.ts`).

### Plan catalog price — `src/features/monetization/plans.ts` + `types.ts`

- `PlanDefinition` gains: `priceMinorUnits?: number; currency?: string;`
- Pro plan: `priceMinorUnits: 49900, currency: "EGP"`. Free: undefined.
- This is the server-authoritative price for `03`.

### Paymob config — `src/features/payments/paymob/config.ts`

Server-side only, fail-fast, exported as plain constants (follow `ai-config.ts`/`s3.ts` style):
```ts
export const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY;      // resolve + throw if missing
export const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY;      // resolve + throw if missing
export const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET;    // resolve + throw if missing
export const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com";
export const PAYMOB_PAYMENT_METHODS = (process.env.PAYMOB_PAYMENT_METHODS || "card").split(",").map(s => s.trim());
```
Do not import this module from any client component.

### Env vars — `.env.example`

Add (with short comments) under a `# Paymob` section: `PAYMOB_SECRET_KEY`, `PAYMOB_PUBLIC_KEY`, `PAYMOB_HMAC_SECRET`, `PAYMOB_BASE_URL` (default comment `https://accept.paymob.com`), `PAYMOB_PAYMENT_METHODS`.

Share the section between ES6-example target `src/features/payments/` and allow `.env.example` formatting to match the file's existing style.

## Dependencies
- Must exist before starting: Epics 17 (Mongoose layer — new schema uses `getModel`), 20/21/22 (monetization data + trial).
- `monetization/types.ts` `PaymentProvider` union: add `"paymob"` so existing `Subscription.provider`/`BillingRecord.provider` can carry it.

## Out of scope (binding)
- NO Paymob HTTP calls, NO Pixel frontend, NO routes/webhooks yet (that is `02`/`03`/`04`/`05`).
- Do NOT modify `monetization/repository.ts` logic for subscription/billing/restore — reuse as-is later.
- Do NOT create the ephemeral "1h valid session/order" concept on top of `PaymentRecord` — `status` handles lifecycle (cancelled = expired/abandoned).

## Acceptance Criteria
- `npx tsc --noEmit` clean; `npm run lint` clean; `npm run build` green (stop dev server first, delete `.next`, run plainly, restart).
- Both new feature modules (`payments/provider.ts`, `payments/repository.ts`) plus schema exist with the exported contracts above.
- `PaymentStatus` has exactly the six values listed.
- No client-side file imports from `paymob/config.ts`.
- `.env.example` lists the five Paymob vars; no real credentials anywhere.
- Verify by code inspection + `grep` that no route/webhook/Pixel code was added in this milestone.