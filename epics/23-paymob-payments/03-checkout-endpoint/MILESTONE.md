# Milestone 03 — Checkout API (create session + status poll)

## Goal

Two thin API routes that let a logged-in user start a Pro purchase and later learn its authoritative status.

- `POST /api/checkout` — create a pending `PaymentRecord` and ask the provider for a payment session (returns `clientSecret`, `publicKey`, `paymentMethods` to the browser).
- `GET /api/checkout/[paymentId]` — owner-gated status poll used by the frontend after `afterPaymentComplete`.

## Dependencies
- M01 (PaymentRecord repo + provider abstraction + plan price + env), M02 (PaymobProvider + Intention client + HMAC) complete.

## Route patterns (copy the house style)
Route handlers stay thin: parse body → zod validate (`src/features/payments/schema.ts` new zod schemas) → call a feature-service function under `src/features/payments/api/` → respond. Auth via `getSession()` from `src/features/auth/lib/session`; ownership via repo query — never trust the client for user/plan/amount.

## `POST /api/checkout` (route → feature-fn `createCheckoutSession`)
Request body (zod):
```ts
{ planId: "pro" }   // nothing else — amount & currency come from the catalog, never the client
```
Flow:
1. `getSession()` → 401 if absent.
2. Validate `planId === "pro"` and `PLANS` entry has `priceMinorUnits` — else 400/404 (no free checkout).
3. If user already `status === "active"` with `provider` set (Pro paid) → 409 `already_pro` (idempotent guard, no double charge path).
4. `createPaymentRecord({ userId, planId, amountMinorUnits, currency: "EGP", description })`.
5. `const provider = new PaymobProvider()` → `createPayment(...)` with customer info gathered from the user record (email/name if available; **phone**: read through `findPhoneIdentity`? No — we don't link phone to checkout in this milestone; the frontend will supply `phone` — see below).
   → **Require `phoneNumber`** from the client body as well (Paymob requires it in `billing_data`). So body is `{ planId: "pro", phoneNumber?: string }`. If absent → 400 `phone_required` (the checkout UI collects it).
6. Persist provider refs: `updatePaymentAfterProviderSession(paymentId, { provider:"paymob", providerPaymentId, providerOrderId, providerMetadata })`.
7. Respond 201 `{ paymentId, planId, amountMinorUnits, currency, status:"pending", clientSecret, publicKey, paymentMethods }`.

Never return the Paymob secret key. `clientSecret` is safe (single-use, 1h expiry).

## `GET /api/checkout/[paymentId]` (route → feature-fn `getCheckoutStatus`)
1. `getSession()` → 401.
2. `getPaymentRecordForUser(paymentId, userId)` → 404 if not owner/null.
3. Respond `{ paymentId, status, planId, amountMinorUnits, currency, updatedAt }` — no secret, no provider keys.

Handle the case where `providerMetadata` may hold raw Paymob payloads: never serialize them to the client.

## Out of scope
Webhook processing, state transitions to paid, frontend UI (M05), plan change/reactivation logic. Reusing the existing `monetization` Subscription/Billing is M04's responsibility.

## Acceptance Criteria
- `tsc`, `lint`, `build` green.
- Unauth `POST /api/checkout` → 401; `GET` with another user's id → 404.
- `POST /api/checkout {planId:"free"}` → 400/404; missing phone → 400.
- Successful call stores a pending PaymentRecord and returns a session (checked via a temp test user in `mongosh` directly against the DB; **do not** create real Paymob intentions — credentials absent, so `createPaymobIntention` will fail. To validate the happy path without live Paymob, make the provider injectable: feature-fn accepts an optional `provider` param defaulting to `new PaymobProvider()`, and the acceptance test passes a stub that returns a fake session. This keeps the route testable offline.)
- No `PAYMOB_SECRET_KEY` in any response payload.