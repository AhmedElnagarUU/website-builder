# Epic 23 — Paymob Pixel Embedded Payments

## Objective

Integrate **Paymob Pixel Embedded** as the first live payment provider so a user can upgrade from the Free/Trial plan to **Pro** and pay directly (card / Google Pay / Apple Pay) inside the app.

The product sells exactly **one thing today**: the monthly **Pro subscription** (EGP 499/month). There is **no cart/order/e-commerce domain** in this codebase — the mission asks us to adapt to that reality, not invent an order system. The "order" is the Pro plan purchase.

Stack in play: Next.js App Router · better-auth · MongoDB via Mongoose · Tailwind · next-intl · plain server `fetch` (no Paymob SDK, no new npm dependency).

## Source of truth

- `prompt/paymob.md` (the mission; read IN FULL)
- Official Paymob docs — must be checked at implementation time, not from memory:
  - Pixel Embedded: https://developers.paymob.com/paymob-docs/developers/checkout-experiences/pixel-embedded
  - Create Intention: https://developers.paymob.com/paymob-docs/intention-apis/create-intention
  - Webhooks + HMAC: https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac
- Mission decisions (verified against current 2026 docs):
  - Intention API: `POST {base}/v1/intention/`, auth header `Token {PAYMOB_SECRET_KEY}` (NOT `Bearer`). Amount is **cents/minor units** (EGP 499 → `49900`). `billing_data.phone_number` is **required**.
  - Paymob HMAC: **SHA-512** (not 256) over **20 transaction fields in Paymob's exact order**, no separators, hex-lowercase — compared against the `?hmac=` **query parameter** of the callback (NOT against the raw body). Callback body is `{ type: "TRANSACTION", obj: {...} }`.
  - Pixel: CDN script + 2 stylesheets (`https://cdn.jsdelivr.net/npm/paymob-pixel@latest/...`), instantiated with `publicKey`, `clientSecret`, `paymentMethods` (`"card" | "google-pay" | "apple-pay"`), `elementId`. `client_secret` is single-use and expires in 1 hour.

## Decisions (binding)

1. **Price & currency:** `PRO_PLAN_ID` priced at **EGP 499/month** = `priceMinorUnits: 49900`, `currency: "EGP"` — added to the plan catalog (`plans.ts`) as the server-authoritative price. Base URL `https://accept.paymob.com` (EGY). Frontend amount is never trusted.
2. **Checkout UI:** inline checkout section embedded on the existing `/pricing` page (below the Pro CTA) — no new route, no modal.
3. **Flow:**
   ```
   /pricing Pro CTA → POST /api/checkout (session-gated)
     → server validates plan, computes amount from catalog
     → create PaymentRecord (pending)
     → PaymobProvider.createPayment() → Paymob Intention
     → store provider refs + client_secret → return safe session
   → frontend initializes Paymob Pixel with publicKey + clientSecret
   → customer pays in Pixel
   → Paymob sends TRANSACTION callback to POST /api/webhooks/paymob?hmac=
     → verify SHA-512 HMAC → idempotent update
     → PaymentRecord → paid; Subscription → active(provider:"paymob");
       BillingRecord gateway_charge appended (dedupe via providerEventId unique index); account restored
   → frontend afterPaymentComplete → poll GET /api/checkout/[paymentId] until terminal
   ```
   The **backend webhook is the source of truth**. `afterPaymentComplete` never marks an order paid.
4. **Provider boundary** (mission §7/§17/§24) — three layers, Paymob stays at the edge:
   ```
   App checkout logic  →  PaymentProvider abstraction  →  PaymobProvider (paymob/ folder)
   Checkout UI shell   →  Provider-agnostic section    →  PaymobPixel component (isolated)
   ```
   Business logic (`checkout`, `webhook` handlers) must call the abstraction, never `paymob.*` directly.
5. **No new npm dependencies.** Intention API = plain `fetch`; Pixel = CDN script tags. `crypto` (node built-in) for HMAC.
6. **Env vars** (follow existing conventions, add to `.env.example`, never commit real credentials):
   ```
   PAYMOB_SECRET_KEY=          # server-only; NEVER exposed to browser
   PAYMOB_PUBLIC_KEY=          # safe to send to the client for Pixel init
   PAYMOB_BASE_URL=https://accept.paymob.com
   PAYMOB_HMAC_SECRET=         # server-only, from Paymob dashboard
   PAYMOB_PAYMENT_METHODS=card,google-pay,apple-pay   # names, commas ok
   ```
   `client_secret` is safe to return to the frontend (expires in 1h, single-use). `PAYMOB_SECRET_KEY`/`PAYMOB_HMAC_SECRET` must never appear in: `NEXT_PUBLIC_*`, client components, API responses, or logs.

## Constraints & invariants

- Read `CODE_RULES.md` in full; follow feature-based structure, route-handler-thin pattern, zod validation, integer-minor-units money rule, bilingual UI strings via `messages/{en,ar}.json` (no hardcoded strings), RTL-aware UI, better-auth boundary untouched.
- Payment-record persistence lives in a new `src/features/payments/` feature (schemas/repository/provider boundary). Existing `monetization` repo functions (`upsertSubscription`, `appendBillingRecord`, `restoreAccount`, …) are reused as-is; extend `PaymentProvider` union in `monetization/types.ts` with `"paymob"` only where needed by existing types.
- Idempotency: `PaymentRecord.providerTransactionId` unique sparse index + existing `BillingRecord.providerEventId` unique sparse index + short-circuit on already-processed state. No duplicate order/payment/fulfillment under repeated callbacks or races.
- Never log secrets or full payment credentials; log verification failures safely.
- Webhook route responds regardless (return proper status per app conventions) and never crashes the request loop.

## Milestones (execution order)

1. `01-payment-domain/` — PaymentProvider abstraction, PaymentRecord model+repository, plan price in catalog, config+env. Foundation.
2. `02-paymob-provider/` — Paymob config/client (Intention API), `PaymobProvider` implementing the abstraction, status mapping, SHA-512 HMAC verification.
3. `03-checkout-endpoint/` — `POST /api/checkout` (create session) + `GET /api/checkout/[paymentId]` (owner-gated status poll).
4. `04-webhook-endpoint/` — `POST /api/webhooks/paymob?hmac=` — verify, idempotent state transitions (payment/subscription/billing/restore).
5. `05-checkout-frontend/` — PaymobPixel component (CDN, lifecycle, RTL), checkout section on `/pricing`, PricingCta wiring, i18n.
6. `06-validation/` — tsc, lint, build, runtime + security checks, migration-style report.

One task per agent session; dependencies are binding; out-of-scope is binding.