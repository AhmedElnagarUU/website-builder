# EPIC 24 — Migrate Billing & Payments from Paymob to Polar

## Objective

Replace **Paymob** with **Polar** as the live payment/billing provider for the
Pro subscription while **preserving every existing business rule** — most
critically the **15-day free trial** — and ensuring the **provider is the
sole source of truth for payment state** (rule: webhook is authoritative; UI
redirect/success page is never proof of payment).

This is a **provider swap at the boundary**, not a redesign. The repo already
has a `PaymentProvider` seam (`src/features/payments/provider.ts`) that Paymob
implements. Polar becomes a second implementation of that same seam; Paymob
remains in place (Rule 15 — no premature deletion) until Polar is proven in
production.

## FAQ / Rationale (assumptions made explicit)

- **SDK? No.** The repo integrates Paymob with **raw `fetch` + node `crypto`**,
  zero npm deps (confirmed: Paymob has no SDK in `package.json`). Polar will
  follow the identical pattern: `fetch` to `https://api.polar.sh` (or sandbox)
  for server-side calls, plus **Standard Webhooks** HMAC verification
  (`POLAR_WEBHOOK_SECRET`) for webhooks — **no new npm dependency**. The
  official SDK `@polar-sh/sdk` is **not** used; flagged as an option you can
  approve separately. [CODE_RULES §4 binding: no new deps without approval]
- **Trial stays app-controlled (15-day invariant preserved).** The repo's trial
  is NOT provider-driven: `TRIAL_DURATION_DAYS = 15` (`const.ts:7`),
  `trialEndsAt` stored on the Subscription doc, `enforceTrialStatus()` called
  at the start of `withEntitlement`, `suspendAccount`/`restoreAccount` as the
  only hard gate (403), and `checkLimit` treating a `paid` webhook as the
  restore trigger. **Polar trial is NOT used** — we keep the app-side 15-day
  trial on the FREE plan exactly as-ishol and only rely on Polar for the paid
  `pro` transition. Moving trial into Polar would change business behavior —
  out of scope.
- **Webhook = source of truth for paid**, same as today: Paymob webhook route
  (`src/app/api/api/webhooks/paymob/route.ts`) verifies HMAC → resolves to
  `PaymentRecord` via unique sparse `providerTransactionId` → transitions
  `paid` → `upsertSubscription(active)` → `restoreAccount`. Polar webhook
  (`/api/webhooks/polar`) does the same: verify Standard-Webhooks HMAC →
  idempotent claim on `providerTransactionId` → same transitions.
- **Idempotency preserved:** unique sparse `providerTransactionId` +
  `providerEventId` (billing) are the anchors; duplicate webhook deliveries are
  ignored (same 11000/duplicate pattern already in `repository.ts` +
  `api/webhook.ts`).

## Scope (Polar missions POLAR-M01..POLAR-M13, per polar.md)

- Deep repo audit (done — mapped in Traceability below).
- Polar config module + provider seam (new `src/features/payments/polar/`).
- Checkout session creation via Polar, redirect to hosted Polar checkout.
- Webhook endpoint with Standard Webhooks HMAC verification + idempotency.
- Subscription lifecycle sync (created/active/trial→paid/canceled/revoked/
  past_due → app states).
- Trial requirement preserved: paid **or** 15-day trial active → access; else
  suspended (403).
- Env vars added to `.env.example` (real names from official docs; values
  empty — you supply `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, etc. later).
- Paymob removal (POLAR-M13) — **only after** Polar proven in production.

## Out of scope (polar.md binding)

- Do NOT remove/redesign the trial business rule → moved into Polar.
- Do NOT change MongoDB/Mongoose models or auth architecture.
- No usage-based billing, seats, license keys, metered pricing.
- No multi-currency/multi-product expansion beyond the one Pro plan.
- Do NOT add new npm dependencies without approval.

## Provider mapping (Paymob → Polar)

| Existing Current (Paymob) | Polar Equivalent | App Change Required |
| ------------------------- | ---------------- | ------------------- |
| Checkout session via `POST /intention/` (client_secret/public_key pixel) | Hosted checkout session (`checkouts.create`) → `url` redirect; no pixel | Server creates checkout, redirect to hosted URL |
| `intention_order_id` special_reference → PaymentRecord id | `external_customer_id` links logged-in user; order/subscription carries customer | Map Polar customer ↔ app userId via `external_customer_id` = `{our user id}` |
| `providerTransactionId` (Paymob txn) | Polar `order.id` / `subscription.id` | Store provider ids in PaymentRecord `providerTransactionId`/`providerOrderId` |
| HMAC SHA-512 20-field (Paymob) | **Standard Webhooks** HMAC (`POLAR_WEBHOOK_SECRET`, timestamps + replay protection) | Replace signature check; add replay-window handling |
| `notification_url` static env | Polar dashboard-configured webhook endpoint | Add webhook endpoint in Polar dashboard; route at `/api/webhooks/polar` |
| Trial 15-day (app) | Polar trial NOT used | Keep app `trialEndsAt` logic unchanged |

## Webhook Strategy

- New route `POST /api/webhooks/polar` (no auth session — public, verifies
  Polar signature).
- Standard Webhooks spec: verify `webhook-signature` HMAC over body using
  `POLAR_WEBHOOK_SECRET`; check `webhook-timestamp` within replay window
  (prevent replay attacks); read raw body before JSON parse.
- Idempotency: claim `PaymentRecord.providerTransactionId` (sparse unique) in
  the SAME update that flips to `paid`; duplicates → `duplicate_ignored`.
- Events handled: `order.paid` (fulfill paid), `order.failed`,
  `subscription.active`, `subscription.revoked`, `subscription.canceled`,
  `subscription.past_due` (map to app states without premature site disable —
  site stays until period end, matching current behavior).
- Webhook must never throw (returns 200 for provider_error like today) and
  never claim a payment before Polar actually confirms it.

## Trial Strategy (15-day invariant — this is THE business rule to keep)

Today the trial is **app-controlled**:
`enforceTrialStatus()` lazily suspends on expiry (403); a paid webhook calls
`restoreAccount`. The Polar migration does NOT move the trial into Polar.
Model used (polar.md Rule 5 chose app-controlled):

```
User signs up → app issues 15-day trial (trialEndsAt = now+15d, status trialing)
→ access granted while trial active
→ trial expires → enforceTrialStatus suspends account (403)
→ user pays via Polar → order.paid webhook → upsertSubscription(active) +
  restoreAccount → access restored
```

## Subscription lifecycle mapping

| Polar event | App subscription status |
| ----------- | ----------------------- |
| `subscription.active` / `order.paid` | `active` (paid) — restore access |
| `subscription.canceled` / `revoked` | canceled/revoked — access until period end |
| `subscription.past_due` | keep active until `currentPeriodEnd` (no premature disable) |
| trial expiry (app-side) | suspended (403) until paid |

## Environment impact (new vars → real `.env.example`, values filled by YOU)

```
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
POLAR_ORGANIZATION_ID=
POLAR_PRODUCT_ID_PRO=
POLAR_PRICE_ID_PRO=
POLAR_BASE_URL=                # default https://api.polar.sh
```

Secrets never exposed to the browser (server-only), same guarantee as Paymob.

## Database impact

- No schema changes to `PaymentRecord`/`Subscription`; Polar ids stored in
  existing `providerTransactionId`/`providerOrderId`/`providerMetadata` fields.
- No new models required (trial stays on existing Subscription doc).

## Existing customer migration

- If no production Paymob customers exist yet → no data migration needed
  (clean cutover; document this).
- If they do exist: keep them on Paymob until cutover, then backfill
  subscriptions with a one-off script (Polar-M11, only created if data exists).

## Testing

- Unit: Polar config require env on demand; Standard-Webhooks HMAC verify
  (valid/invalid/expired replay); status mapping.
- Webhook: valid event, invalid signature, duplicate event, out-of-order event,
  malformed payload, delayed delivery.
- Trial: 15-day expiration → suspended; Polar paid → restore; renewal /
  cancellation preserved.
- Regression: non-payment flows unchanged.

## Risk & rollback

- Risk: webhook verification mismatch → fail-closed (401) so no false paid.
- Risk: replay attacks → timestamp window + idempotency.
- Rollback: Polar code behind the same `PaymentProvider` seam; revert to
  `PaymobProvider` by flipping the active provider — Paymob intact until
  POLAR-M13.

## Missions (dependency-ordered)

POLAR-M01 — Repo audit (DONE — see Traceability).
POLAR-M02 — Polar provider module: `paymentProvider`, config, Standard-Webhooks
  HMAC verify, status mapping (foundation).
POLAR-M03 — Checkout: create Polar checkout session on plan upgrade, redirect
  to hosted Polar checkout; keep 409 already_pro guard.
POLAR-M04 — Webhook route `/api/webhooks/polar` with verification +
  idempotency + subscription sync + restoreAccount.
POLAR-M05 — Env + integration: fill real Polar values, wire `POLAR_*`,
  dashboard webhook endpoint, sandbox verification.
POLAR-M11 — (Conditional) existing-customer backfill if production Paymob data
  exists.
POLAR-M13 — Remove Paymob only after Polar proven in production.

## Traceability

| Requirement | Current (Paymob) | Target (Polar) | Mission |
| ----------- | ---------------- | -------------- | ------- |
| Checkout | `POST /api/checkout` → Paymob intention, pixel | Polar hosted checkout `url` redirect | POLAR-M03 |
| Customer identity | Paymob billing_data (email/phone) | Polar `external_customer_id` = app userId | POLAR-M03 |
| Subscription activation | Paymob webhook HMAC → upsert(active) | Polar `order.paid`/`subscription.active` webhook | POLAR-M04 |
| 15-day trial | app `trialEndsAt` + suspend/restore | unchanged (app-controlled) | POLAR-M04 |
| Webhook signature | Paymob HMAC SHA-512 20-field | Standard Webhooks HMAC + replay window | POLAR-M04 |
| Access enforcement | `entitlement.ts`/`checkLimit` + `enforceTrialStatus` | unchanged | — |
| Payment failure | status-map pending/failed → suspended | Polar `order.failed`/past_due → keep until period end | POLAR-M04 |
| Existing customer data | — | conditional backfill | POLAR-M11 |
| Paymob removal | — | delete `paymob/` only after production proof | POLAR-M13 |
