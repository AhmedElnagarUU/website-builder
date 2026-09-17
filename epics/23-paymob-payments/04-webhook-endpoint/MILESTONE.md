# Milestone 04 — Paymob Webhook (authoritative state transitions)

## Goal

Server-to-server (no session) receipt of Paymob's `TRANSACTION` callbacks. Verify HMAC, resolve our record, apply idempotent state transitions, and — only on `paid` — upgrade the subscription and open billing/entitlements. This endpoint is the **source of truth** for payment outcome; nothing in the frontend may be.

## Dependencies
- M01 (PaymentRecord repo, idempotency seam), M02 (HMAC verify, Provider.handleWebhook, `statusFromTransaction`), M03 (feature-service patterns). `monetization` repo fns (unchanged): `upsertSubscription`, `appendBillingRecord`, `restoreAccount`, `suspendAccount`, `getSubscriptionForUser`.

## Route: `POST /api/webhooks/paymob` (no auth — verification is the auth)
Thin handler:
1. Read raw JSON body `{ type?: string, obj?: unknown }`; extract `hmac` from **`request.nextUrl.searchParams.get("hmac")`**.
2. If `!obj || !hmac` → 400 (never act).
3. `PaymobProvider().handleWebhook(body, hmac)` → throws `PaymobProviderError` on HMAC failure → **401** (log the failure safely: event id/handler, NO credentials, NO raw payload; mission §14). On success returns `PaymentWebhookResult`.
4. Delegate to feature fn `processPaymobWebhook(result)` (below) → respond 200 `{ received: true }` on success and on already-processed; mapped provider errors → 502. Never throw out of the handler (Paymob retries otherwise; but we still keep idempotency so a retry is harmless).

## Feature fn `src/features/payments/api/webhook.ts`
```ts
export async function processPaymobWebhook(result: PaymentWebhookResult): Promise<{ outcome: "processed" | "duplicate_ignored" | "payment_not_found" }>
```

### Idempotency + resolution (order matters)
1. `findPaymentByProviderTransactionId(result.providerTransactionId)`:
   - found AND already `paid`/`failed`/`refunded`/`voided`/`cancelled` → **`duplicate_ignored`** (no work — callbacks may repeat; mission §13/§21 duplicate-webhook test).
   - found and still `pending` → continue to transition it.
2. Not found by transaction id → `findPaymentByReference(result.providerOrderId)` (maps `special_reference`/`merchant_order_id`, i.e. our `providerPaymentId` or `_id`). If that also misses → `payment_not_found` (log safely, 200 to stop retry loops).
3. Race belt-and-suspenders: before writing, re-check `findPaymentByProviderTransactionId` inside the transition; if the record UPDATE returns `matchedCount === 0` with `status` no longer pending (or the unique index threw 11000), treat as duplicate. **No duplicate subscription upsert / no duplicate billing record.**

### Paid transition (only from `pending` → `paid`)
- `markPaymentStatus(paymentId, "paid", { providerTransactionId, paymentMethod, providerMetadata })` (sets the unique idempotency key BEFORE or atomically-with the billing append so a retried webhook dedupes).
- `upsertSubscription({ userId, planId: "pro", status: "active", provider: "paymob", providerSubscriptionId: providerTransactionId, currency: result.currency ?? "EGP", amountMinorUnits: result.amountMinorUnits ?? 49900, currentPeriodStart: now, currentPeriodEnd: now + 30d, trialEndsAt: undefined })`.
- `appendBillingRecord({ userId, kind: "gateway_charge", amountMinor: amountMinorUnits, currency, provider: "paymob", providerEventId: providerTransactionId, createdBy: "gateway", description: "Paymob charge (Pro monthly)" })` — `providerEventId` unique sparse index is the **second** idempotency check; a 11000 here → treat as duplicate_ignored and return (already recorded).
- `restoreAccount(userId)` (un-suspends; mission §5 + existing `withEntitlement` resume logic).

### Failed transition
- `markPaymentStatus(paymentId, "failed", { providerTransactionId, paymentMethod })`. No subscription/billing changes (mission §5: "Payment marked failed / Order remains unpaid").
- `pending` → leave as pending (still awaiting 3DS etc.).

## Webhook URL config
No dashboard is reachable from here — that is deployment/Remaining Work (report). The Intention `notification_url` is set at session creation (`/api/webhooks/paymob`), which already points callbacks here when credentials exist.

## Out of scope (binding)
Refunds/voids (documented as future work in a code comment only). Frontend. Credentials provisioning. Any change to `monetization/repository.ts`.

## Acceptance Criteria
- `tsc`, `lint`, `build` green.
- HMAC fail → 401, zero state changes (verify via temp record in DB stays pending).
- Duplicate callback (same `obj.id`) → `duplicate_ignored`, still 200, no second subscription/billing row.
- Paid callback → record `paid`, subscription `active`, one billing row (seat-gate via unique index).
- Failed callback → record `failed`, untouched subscription/billing.
- Payload with unknown reference → 200 `payment_not_found`, nothing written.
- No secrets logged (code inspection); no PAN in stored metadata (M02 strips `source_data`).