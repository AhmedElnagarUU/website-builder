# Task 01 — Payment record schema, repository, and provider abstraction

## Context
Epic 23 M01 establishes the provider-agnostic payment foundation. The app sells exactly one thing: the Pro plan upgrade (EGP 499/mo). There is no order/cart domain — the mission (`prompt/paymob.md`) asks us to adapt, introducing the minimum payment persistence the transaction needs. Money must stay integer minor units.

Read before starting (mandatory order): `CODE_RULES.md` in full → this task → parent `epics/23-paymob-payments/01-payment-domain/MILESTONE.md`. Read `src/features/monetization/repository.ts` + `src/features/monetization/billing.schema.ts` + `src/shared/db/mongoose.ts` to mirror the house style exactly.

## Deliverables

### A. `src/features/payments/types.ts`
```ts
import type { Types } from "mongoose";

export type PaymentProviderId = "paymob";

export type PaymentStatus =
  | "pending"   // initial, waiting on provider
  | "paid"      // authoritatively confirmed by webhook
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
```
Plus the boundary DTOs/signatures mandated by the MILESTONE.md "Shared contract" section (`CreatePaymentInput`, `PaymentSession`, `PaymentWebhookResult`, `PaymentProvider`, `CreatePaymentRecordInput`). Put `PaymentProvider` interface in `src/features/payments/provider.ts` as specified — type-only file, no implementation.

### B. `src/features/payments/payment-record.schema.ts`
Mongoose schema via `getModel("Payment", schema)` from `src/shared/db/mongoose.ts`. Fields per MILESTONE.md. Handle `createdAt`/`updatedAt` manually in the repository (do NOT enable schema timestamps — match house style). Indexes defined in the schema:
- `{ userId: 1 }`
- `{ providerTransactionId: 1 }, { unique: true, sparse: true }` — the idempotency seam (mirrors `BillingModel`).
- `{ status: 1 }`

### C. `src/features/payments/repository.ts`
Implement exactly the functions listed under "PaymentRecord — repository" in MILESTONE.md. House rules:
- `mongoose.Types.ObjectId` for id conversions, `findOne({...}).lean()`, cast `doc as unknown as PaymentRecord`.
- `markPaymentStatus` should reject illegal transitions? No — keep it a dumb setter here; webhook milestone owns state-machine discipline. But DO guard: a second callback with the SAME `providerTransactionId` must be detectable via `findPaymentByProviderTransactionId`.
- Handle duplicate-key code 11000 (for providerTransactionId race) the same way `storePhoneIdentity` does (no `MongoError` import — check `err.code`).
- `findPaymentByReference` resolves a record by `providerPaymentId` == ref OR `_id.toString()` == ref (covers `special_reference`/`merchant_order_id` mapping).

### D. Plan price in catalog
`src/features/monetization/types.ts`: extend `PlanDefinition` with `priceMinorUnits?: number; currency?: string;`.
`src/features/monetization/plans.ts`: Pro gets `priceMinorUnits: 49900, currency: "EGP"`. Free: none.

`src/features/monetization/types.ts`: extend `PaymentProvider` union `"manual" | "stripe"` → add `"paymob"`.

### E. `.env.example` — add Paymob section
```
# Paymob
PAYMOB_SECRET_KEY=
PAYMOB_PUBLIC_KEY=
PAYMOB_HMAC_SECRET=
PAYMOB_BASE_URL=https://accept.paymob.com
PAYMOB_PAYMENT_METHODS=card,google-pay,apple-pay
```

Do NOT create `paymob/config.ts` yet — that's M02 (next task). This task stays Paymob-agnostic.

## Out of scope
- Paymob client/intention calls, HMAC, webhook, any `api/` route, any frontend/component — later milestones.
- Touching `monetization/repository.ts` or `monetization/*.schema.ts` beyond the two one-line type/catalog edits above.

## Acceptance Criteria
- `tsc --noEmit`, `lint`, `build` (build rule: stop dev server → `Remove-Item -Recurse -Force .next` → `npm run build` plainly → restart `start-dev.bat`) all green.
- All exports above present with exact names/signatures from MILESTONE.md.
- `grep -rn "from \"mongodb\"" /src/features/payments` → no matches (types come from mongoose).
- No `paymob/` folder, no API routes, no components created.
- `.env.example` has the 5 new vars, no credentials.