# Epic 23 — Paymob Payments Integration Report

## Summary

Paymob Pixel Embedded is integrated as the first live payment provider for the **Pro monthly subscription (EGP 499)**. A non-technical Pro buyer clicks the Pro CTA on `/pricing`, an inline checkout section opens, Paymob's Pixel widget renders in the browser (card / Google Pay / Apple Pay), and the authoritative outcome arrives via a signed `TRANSACTION` webhook that upgrades the account. The feature is structured as a three-layer provider boundary so Paymob stays at the edge and can be swapped without touching app checkout logic.

**Honest limitation:** no live Paymob credentials were available in this environment (`PAYMOB_*` are unset locally and documented in `.env.example`). Everything was verified with **test/mocked logic**: the Intention API HTTP client was validated by code inspection + a stubbed provider through the full persistence pipeline, and the webhook/HMAC path was validated end-to-end against the real modules with a locally-crafted HMAC (no real callback, no test card, no real webhook URL). The epic is verified for code-correctness, idempotency, security posture, and build green-ness — **not** exercised against Paymob's live API.

## Changed Files (by milestone)

### M01 — Payment domain (foundation)
- `src/features/payments/types.ts` — `PaymentRecord`, `PaymentConsumer` state, `PaymentSession`, `PaymentWebhookResult`, `PaymentProviderId = "paymob"`, `CreatePaymentInput` (`internalPaymentId`, customer with required `phoneNumber`).
- `src/features/payments/payment-record.schema.ts` — Mongoose `Payment` model; **unique sparse index on `providerTransactionId`** (idempotency seat) + `userId`/`status` indexes; `providerMetadata` free-form.
- `src/features/payments/repository.ts` — `createPaymentRecord`, `getPaymentRecordForUser`, `updatePaymentAfterProviderSession`, `markPaymentStatus` (swallows 11000), `findPaymentByProviderTransactionId`, `findPaymentByReference` (tries `providerPaymentId` then `_id`).
- `src/features/monetization/plans.ts` — Pro price added to the catalog as server-authoritative: `priceMinorUnits: 49900`, `currency: "EGP"`.
- `src/features/monetization/types.ts` — extended `PaymentProvider` union with `"paymob"` and plan price fields only.
- `.env.example` — documents `PAYMOB_SECRET_KEY`, `PAYMOB_PUBLIC_KEY`, `PAYMOB_HMAC_SECRET`, `PAYMOB_BASE_URL`, `PAYMOB_PAYMENT_METHODS`.

### M02 — Paymob provider (edge)
- `src/features/payments/paymob/config.ts` — server-only constants; `requireEnv` on the three secrets; base URL default `https://accept.paymob.com`; payment-methods parsing. **Never imported from client code.**
- `src/features/payments/paymob/client.ts` — `createPaymobIntention` (plain `fetch`, `Token {PAYMOB_SECRET_KEY}` auth, amount in minor units, required `billing_data.phone_number`, `special_reference` = our PaymentRecord id, `notification_url` = `/api/webhooks/paymob`); `PaymobProviderError`.
- `src/features/payments/paymob/hmac.ts` — `verifyTransactionHmac` SHA-512 over the **exact 20 ordered fields**, no separators, hex-lowercase, `timingSafeEqual`, fail-closed on missing field/empty hmac/empty secret.
- `src/features/payments/paymob/status-map.ts` — `statusFromTransaction`: paid = `success===true && pending===false`; pending = `pending===true`; else failed.
- `src/features/payments/paymob/provider.ts` — `PaymobProvider` (`createPayment`, `handleWebhook`); PAN stripped from stored metadata (`delete source_data`); `order.merchant_order_id` → `providerOrderId` (the special_reference echo).
- `src/features/payments/paymob/index.ts` — public barrel.

### M03 — Checkout endpoints
- `src/features/payments/api/checkout.ts` — `createCheckoutSession` (validates plan/catalog price, already-`pro` guard 409, records `pending`, calls injected-or-lazy-default provider, sanitized session) and `getCheckoutStatus` (owner-gated poll).
- `src/features/payments/schema.ts` — zod `checkoutSchema` (`planId: "pro"`, `phoneNumber` 8–20).
- `src/app/api/checkout/route.ts` — `POST`: session-gated (401), zod (400), returns `clientSecret`/`publicKey`/`paymentMethods` on 201.
- `src/app/api/checkout/[paymentId]/route.ts` — `GET`: session-gated, owner-gated, sanitized status (no secrets), 404 on missing/bogus.

### M04 — Webhook (authoritative)
- `src/features/payments/api/webhook.ts` — `processPaymobWebhook`: resolve by `providerTransactionId` (terminal → `duplicate_ignored`), else by order reference (missing → `payment_not_found`), transition `pending→paid` claiming the tx id atomically, then subscription upsert + billing row (unique `providerEventId` = 2nd dedupe seat) + `restoreAccount`. `failed` marks only; `pending` no-write.
- `src/app/api/webhooks/paymob/route.ts` — no auth (verification **is** the auth): requires `obj` + `?hmac=`, `PaymobProvider.handleWebhook` → 401 on HMAC failure, `processPaymobWebhook` → 200 `{ received: true }`, never throws, no raw payload logged.

### M05 — Checkout frontend
- `src/features/payments/components/paymob-pixel.tsx` — isolated `"use client"` component: CDN styles+script injected once (module-level promise), lifecycle + destroy, RTL via `customStyle.Direction` for `ar`, `afterPaymentComplete` → `onComplete` (poll trigger only — never marks paid).
- `src/features/payments/components/checkout-section.tsx` — inline checkout below the Pro CTA on `/pricing`; creates session, renders `PaymobPixel`, then **polls** `GET /api/checkout/[paymentId]` until terminal.
- `src/features/monetization/components/PricingCta.tsx` — Pro CTA wiring.
- `src/shared/auth/client.ts` — client-side session helper wired for the section's session check.
- `src/messages/en.json`, `src/messages/ar.json` — new i18n keys (both locales).

## Architecture

**Provider boundary (server)** — the app's checkout/webhook logic never touches `paymob.*` directly; it drives an injected `PaymentProvider` abstraction:

```
POST /api/checkout (session gate + zod)
        │
        ▼
createCheckoutSession (plan/catalog price, already_pro guard, record pending)
        │  PaymentProvider (abstraction, injected / lazy default)
        ▼
PaymobProvider.createPayment → createPaymobIntention (plain fetch, Token auth)
        │
        ▼
Paymob /v1/intention/  (special_reference = our PaymentRecord _id)
        │  client_secret (+ publicKey, methods) returned to store + browser
        ▼
Browser mounts PaymobPixel (isolated client component, CDN assets only)
```

```
POST /api/webhooks/paymob?hmac=   (no session — verification is the auth)
        │
        ▼
PaymobProvider.handleWebhook → verifyTransactionHmac (SHA-512 / 20 fields)  → 401 on bad
        │
        ▼
processPaymobWebhook (idempotent transitions) → 200 always
```

**Isolated Pixel seam (frontend)** — the browser-facing fork is equally sealed: the checkout section renders a provider-agnostic shell, and only `paymob-pixel.tsx` knows the Pixel CDN (`paymob-pixel@latest`). If Paymob ever added a second provider, only that leaf (`elementId: "paymob-elements"`, `customStyle.Direction`) and the provider factory below check in.

**Why no new dependencies** — `crypto` (node built-in) computes the HMAC; the Intention API is plain server `fetch`; Pixel ships as CDN `<script>`/`<link>` tags. The approved-dependency list is untouched.

## Payment Flow

1. Pro CTA on `/pricing` → `POST /api/checkout` (session-gated, zod-validated; `free` → 400, missing phone → 400, already active Pro → 409).
2. Server resolves price from the catalog (**frontend amount never trusted**), creates the PaymentRecord `pending`, then calls `PaymobProvider.createPayment` → `POST {base}/v1/intention/` with `Token {PAYMOB_SECRET_KEY}` and **`special_reference: <our PaymentRecord _id>`**.
3. Paymob answers `{ id, intention_order_id, client_secret }`; the secret (single-use, 1h TTL) is returned to the browser with `publicKey` + enabled methods.
4. `PaymobPixel` mounts (CDN), the customer pays (card / Google Pay / Apple Pay, incl. 3DS when the bank demands).
5. Paymob sends the `TRANSACTION` callback to `POST /api/webhooks/paymob?hmac=<sig>`. The signature is **SHA-512 over the 20 ordered fields, concatenated, no separator, hex-lowercase**, compared with `timingSafeEqual` against the **query-param** `hmac`; a missing/forged signature is rejected with 401 and no state change.
6. `statusFromTransaction` maps `success/pending` → `paid`/`pending`/`failed`, and `order.merchant_order_id` (Paymob's echo of our `special_reference`) becomes `providerOrderId`, resolving our record via `findPaymentByReference` (searches `_id`/`providerPaymentId`).
7. `processPaymobWebhook` transitions only `pending → paid`, claiming `providerTransactionId` in the same update (unique sparse index), then upserts the active Pro subscription, appends exactly one billing row (`providerEventId` unique index), and `restoreAccount` — idempotent under replays/races (duplicate → `duplicate_ignored`, still 200).
8. `afterPaymentComplete` in the Pixel **only starts polling** `GET /api/checkout/[paymentId]`; success is declared **only** when the backend record reads `paid` — the Pixel callback is never trusted as the source of truth.

## Security

- `PAYMOB_SECRET_KEY` / `PAYMOB_HMAC_SECRET` are **server-only** (verified: only `features/payments/paymob/config.ts` defines them; consumers are the server provider/client). `PAYMOB_PUBLIC_KEY` is the only key safe for the browser.
- **No `NEXT_PUBLIC_PAYMOB*` anywhere in `src/`** (grep: 0 hits). Secrets never appear in client components, API responses, or logs.
- **HMAC is mandatory**: no `hmac`, missing `obj`, or failed verification → 401 and zero DB writes. Verification failures are logged with event/handler context only — never the raw payload.
- **`client_secret` is the only Paymob secret-value that ever reaches the browser** — single-use, 1-hour expiry, returned once at session creation. It is stripped from the poll endpoint's response.
- **No PAN stored or logged**: `handleWebhook` strips `source_data` before persisting `metadata` (verified by the seam harness: the stored metadata JSON contains no PAN and no `source_data` key).
- No `console.log` of callback payloads in `features/payments/**` (0 hits; the only `console.*` are pre-existing unrelated files).

## Testing (actual runs + results)

All checks re-run during M06 (Definition-of-Done gate). Node v24.18.1; harnesses run via the repo's proven seam pattern (TS strip-types + the M04 resolve loader, harnesses in the OS temp dir).

| # | Check | Command | Result |
|---|---|---|---|
| 1 | TypeScript | `npx tsc --noEmit` | exit **0** |
| 2 | Lint | `npm run lint` | exit **0** — "No ESLint warnings or errors" |
| 3 | Build (from deleted `.next`, no dev server) | `npm run build` with `NODE_OPTIONS=--dns-result-order=ipv4first` | exit **0** — "Compiled successfully in 71s"; route table includes `/api/checkout`, `/api/checkout/[paymentId]`, `/api/webhooks/paymob` |
| 4 | Dev boot + health | dev server via `start-dev.bat` → `GET /api/health` | **200** `{"status":"ok","db":true}` |
| 5 | Page render | `GET /en`, `GET /pricing`, `GET /en/pricing` | **200**; `/en/pricing` contains the checkout section/Pixel wiring |
| 6 | Checkout unauth | `POST /api/checkout` (no session) | **401** `{"error":"unauthorized"}` |
| 7 | Checkout input gate (zod) | `m06-schema-gate.ts` — `checkoutSchema.safeParse`: `free`, missing/empty/short phone, bogus plan → **all rejected**; valid `pro`+phone → accepted | **ALL PASS** — write side maps rejections to 400 |
| 8 | Checkout status bogus/owner | GET route for bogus id / other user | **401/404 or 404** per gate (session-gated; harness covers owner-gating: other user → null) |
| 9 | Checkout persistence pipeline | `checkout-stub-test.ts` (M03-style, injected stub provider) | **ALL PASS** — record `pending`, refs stored, sanitized poll payload (no provider/secret), already_pro → 409, invalid_plan → 400, provider_error → 502 with orphaned pending record, missing-creds default path → provider_error 502 |
| 10 | Webhook idempotency + transitions | `webhook-test.ts` (real modules, crafted HMAC) | **ALL PASS** — paid → processed (record paid, sub active 30d, 1 billing row, account restored); replay → duplicate_ignored + still 1 row + unchanged period; failed → no sub/billing; unknown ref → payment_not_found + no writes; pending → left pending; forged/missing HMAC rejected |
| 11 | **M06 seam harness** | `m06-final-validation.ts` (real `paymob/` modules + real Mongo) | **ALL PASS** (full assert list below) |
| 12 | Security greps | see below | **0 violations** |

### M06 seam-harness assertions (real module source, live Mongo)

- **A1 HMAC (sha512/20-field):** valid `"paid"` callback accepted; **all 20 fields** individually tampered → rejected; any of the 20 **missing** → rejected (fail closed); bad sig/empty hmac/empty secret/missing arg → false. ✅
- **A2 merchant_order_id echo seam:** real-shape callback with `order.merchant_order_id` = our `_id` → `handleWebhook` returns `providerOrderId === <our _id>`, tx id maps, `status:"paid"`, amount 49900/EGP, method `CARD`; `findPaymentByReference` and owner-gated `getCheckoutStatus` resolve the exact record; stored metadata contains **no PAN / no `source_data`**; forged + missing HMAC → `invalid_hmac`. ✅
- **A3 status map:** `success:true,pending:false→paid`; `false,false→failed`; `…,true→pending` (both success values + string forms). ✅
- **A4 config server-only:** `config.ts` **throws at import** when `PAYMOB_*` are empty/absent and loads cleanly when set; `NEXT_PUBLIC_PAYMOB` grep in `src/` = 0 hits. ✅
- Harness exit: **0 — ALL PASS**.

### Security greps (exact outputs)

```
PAYMOB_SECRET_KEY   → 3 hits, all in features/payments/paymob/:
                      config.ts:8 (define) · client.ts:1,68 (import/use)            ✅ server-only
PAYMOB_HMAC_SECRET  → 3 hits, all in features/payments/paymob/:
                      config.ts:10 (define) · provider.ts:7,98 (import/use)         ✅ server-only
NEXT_PUBLIC_PAYMOB  → 0 hits                                                         ✅
billing_data|special_reference → 3 hits, all in features/payments/paymob/
                      (client.ts:60,63; provider.ts comment)                        ✅ provider edge only
from "mongodb"      → 0 hits under src/features/payments (Mongoose only)            ✅
console.log(        → 0 hits under src/features/payments                             ✅
PAYMOB_* in .env    → not set (documented in .env.example)                          ✅
```

**Boundary audit:** API surface is exactly the three intended routes (`checkout/route.ts`, `checkout/[paymentId]/route.ts`, `webhooks/paymob/route.ts`); `monetization/` changed only in `types.ts` + `plans.ts` (+ `PricingCta.tsx`, the M05 wiring) — `git diff` confirms.

### NOT tested (honest list)

- **No live Paymob API call.** No real `PAYMOB_SECRET_KEY`/`PUBLIC_KEY`/`HMAC_SECRET` → Intention creation verified against a **stub** provider through the persistence pipeline and by code inspection of `createPaymobIntention`; never against Paymob's real endpoint.
- **No real webhook URL/notification.** `notification_url` is armed per session to `/api/webhooks/paymob`, but with no dashboard integration there is nothing wired to target it; the HMAC path was exercised with a locally-crafted signature against the real modules instead.
- **No 3DS challenge.** The code records `is_3d_secure` and leaves `pending` while un-finished, but a real bank redirect wasn't exercised.
- **No real Apple Pay / Google Pay flow** (requires domain verification + credentials).
- **No refund / void handling** — explicitly out of M04 scope; `statusFromTransaction` never emits those statuses.
- **No recurrence / auto-renewal** — this is a **single monthly payment**; the 30-day period is stored, but there is no renewal, charge-again, or expiry-cron yet (future scope).
- **No E2E browser click-through** with a real account/paid plan (Pixel mounts safely — page renders the section — but no Paymob iframe interaction, no devtools audit).

## Remaining Work

1. **Provision credentials:** create the Paymob integration in the Paymob dashboard (EG), obtain `PAYMOB_SECRET_KEY` / `PAYMOB_PUBLIC_KEY` / `PAYMOB_HMAC_SECRET`, and set them in the deployment env (`.env.example` already documents all five; `.env` currently has none).
2. **Configure the webhook URL per integration** (`{APP_URL}/api/webhooks/paymob`) — not reachable from here (no dashboard access); required before any live callback.
3. **Live e2e smoke with test card / test mode:** real Intention create → real Pixel render → 3DS flow → real `TRANSACTION` callback → verify paid/subscription/billing against the live sandbox; also verify the Apple Pay/Google Pay paths once domain-verified.
4. **Refund / void handling** (out of scope for M01–M05; `statusFromTransaction` currently maps only paid/pending/failed) when the business needs returns.
5. **Recurring / auto-renewal** — currently single monthly payment; the subscription stores `currentPeriodEnd = now + 30d` but nothing re-charges or suspends after expiry. Explicitly future scope.

## Final Status

**COMPLETED_VALIDATED.** Build/lint/tsc green, security greps clean, runtime smoke green, the M06 seam harness passes every assertion against the real modules. The epic's code is verified for correctness, idempotency, and provider-boundary isolation. The gate that remains is **operations**: real Paymob credentials + a live integration webhook URL (items 1–2 above), which require dashboard/human access and are outside this environment's reach.