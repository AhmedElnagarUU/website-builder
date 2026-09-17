# Task 01 — Paymob webhook route + idempotent state transitions

## Context
Epic 23 M04: the authoritative backend endpoint Paymob calls with transaction callbacks. Everything here is server-only, unauthenticated-by-session — soundness comes from HMAC verification and idempotent writes. Read the parent MILESTONE.md carefully; the ordering rules there are the acceptance contract.

Read before starting (mandatory order): `CODE_RULES.md` → this task → `epics/23-paymob-payments/04-webhook-endpoint/MILESTONE.md` → M01/M02 contracts (`payments/provider.ts`, `paymob/hmac.ts`, `paymob/provider.ts`, `status-map.ts`, `payments/repository.ts`) → existing repo calls `upsertSubscription`/`appendBillingRecord`/`restoreAccount` in `src/features/monetization/repository.ts`.

Do not touch `money` logic in `monetization/repository.ts` — reuse the exported functions exactly as they are.

## Deliverables

### `src/features/payments/api/webhook.ts`
```ts
export type WebhookOutcome = "processed" | "duplicate_ignored" | "payment_not_found";

export async function processPaymobWebhook(result: PaymentWebhookResult): Promise<{ outcome: WebhookOutcome }>
```
Implement the MILESTONE's numbered resolution/transition order verbatim. Key discipline points:
- **Set the idempotency key early.** Pass `providerTransactionId` inside the same `markPaymentStatus` update that flips `pending → paid`; set after a successful `markPaymentStatus` re-run of `findPaymentByProviderTransactionId` before touching subscription/billing.
- On `paid`, the unique sparse `providerEventId` index on Billing (11000 → `duplicate_ignored`) AND a `matchedCount === 0` / duplicate-tx on Payment both count as duplicate.
- Never branch on raw `obj` here — `PaymentWebhookResult` is the only shape this module consumes.
- Log safely: `console.error("paymob webhook: invalid hmac (tx id hidden)")` style — no raw payload, no keys, no PAN (M02 already strips `source_data`). Use the app's existing logging conventions if any (grep for `console.*` usage patterns first).

### `src/app/api/webhooks/paymob/route.ts` (POST)
Thin handler per MILESTONE. Read raw body as JSON (Web APIs: `await request.json()` — note this route never reads cookies/session). Extract `hmac = request.nextUrl.searchParams.get("hmac")`. Map outcomes:
- `{ ok: true, status: 200 }` for processed/duplicate_ignored/payment_not_found (always 200 — stops Paymob retries; the JSON differs slightly: `{ received: true, outcome }`).
- `PaymobProviderError("invalid_hmac")` → 401 `{ error: "invalid_hmac" }`.
- other provider errors → 200 `{ error: "provider_error" }` (do not leak details; never 4xx that triggers retries for a real failure — but HMAC failures SHOULD 4xx? Mission says return appropriate response per app conventions; the industry pattern is 200-to-stop-retries ONLY for genuinely consumed events, 401 for forgeries. We follow: HMAC fail → 401; everything validated → 200.)
- Ensure the handler never throws uncaught (wrap in try/catch → 200 `{ error: ... }` fallback).

### Status writes are the ONLY writes
No other script modifies payment/subscription/billing from this endpoint.

## Out of scope
Refunds/voids. Frontend. Credentials. Any edits to `monetization/`.

## Acceptance Criteria
- `tsc`, `lint`, `build` green (build rule).
- Offline-verifiable behavior (no real Paymob creds): using the dev server + a stubbed/mocked path or a direct script to invoke `processPaymobWebhook` with a crafted `PaymentWebhookResult`:
  1. valid HMAC + known pending record → `processed`, record `paid`, subscription `active`, exactly one billing row.
  2. same callback replayed → `duplicate_ignored`, still exactly one billing row, subscription untouched.
  3. invalid hmac → throws `PaymobProviderError`; record stays `pending`.
  4. unknown ref → `payment_not_found`, nothing written.
  (If a real callback can't be simulated without Paymob, you may write a tiny throwaway Node/`mongosh` script under the OS temp dir — do NOT add test files to the repo.)
- Grep the route + webhook module: no `PAYMOB_SECRET_KEY`, no `PAYMOB_HMAC_SECRET`, no `console.log(`, no raw `obj` beyond the narrow M02-sanitized path.