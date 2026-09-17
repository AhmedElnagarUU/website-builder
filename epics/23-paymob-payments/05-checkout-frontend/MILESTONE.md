# Milestone 05 — Checkout Frontend (Pixel + inline section on /pricing)

## Goal

Let a logged-in user upgrade to Pro on the existing `/pricing` page: click Pro CTA → inline checkout section appears → phone collected → `POST /api/checkout` → Paymob Pixel mounts (card / Google Pay / Apple Pay) → on provider completion the UI polls `GET /api/checkout/[paymentId]` until the **backend** reports a terminal state. Pixel initialization stays isolated in one component; the section is provider-agnostic.

## Dependencies
- M03 routes live (`POST /api/checkout` returns `{ clientSecret, publicKey, paymentMethods, paymentId, ... }`; `GET /api/checkout/[paymentId]` returns `{ status, ... }`).
- i18n via `messages/en.json` + `messages/ar.json` — no hardcoded strings (CODE_RULES §3).

## Architecture (provider boundary on the FE)

```
CheckoutSection  (src/features/payments/components/checkout-section.tsx)
  ├─ collects phone + name (inline form)
  ├─ POST /api/checkout → session
  └─ renders <PaymentFrame session>          // provider-agnostic shell
        └─ <PaymobPixel clientSecret publicKey methods .../>   // the isolated edge
```
- `PaymobPixel.tsx` — the ONLY file that knows "paymob" / the CDN `<script>` URLs. Everything above it works on an opaque `session`.
- RTL: read current locale (`next-intl`); if `ar`, pass Pixel `customStyle.Direction = "rtl"` (Paymob Pixel supports RTL natively — see mission §4 & official sample).
- `afterPaymentComplete` → **do not mark paid**; call `onComplete` → section starts polling the status route.
- `onPaymentCancel` (Apple Pay) → reset to intro state, show "cancelled" message, allow retry.
- Errors: server returns `{ error: code }` codes from M03 (`already_pro`, `phone_required`, `provider_error`, …) → map to i18n keys.

## UI states (bilingual keys to add)
Add keys for: `checkout.title`, `checkout.subtitle`, `checkout.phone_label`, `checkout.phone_placeholder`, `checkout.name_label`, `checkout.pay_button`, `checkout.loading`, `checkout.processing`, `checkout.cancelled`, `checkout.failed`, `checkout.success`, `checkout.already_pro`, `checkout.provider_error`, `checkout.retry`. (Theme/visual: match existing pricing page components; Tailwind, no new UI lib.)

## Which component changes
- `src/features/monetization/components/PricingCta.tsx` — replace the current "coming soon" toggle with a state that shows `<CheckoutSection />` inline (the section renders below the CTA when activated). Keep existing "current plan / already Pro" states. If user is not signed in, CTA still navigates to sign-in (existing behavior).
- The pricing page itself: no route changes.

### Security invariants (mission §15)
- The browser NEVER sees `PAYMOB_SECRET_KEY` / `PAYMOB_HMAC_SECRET` — only `clientSecret` + `publicKey` from the checkout response.
- No `NEXT_PUBLIC_PAYMOB_*` env vars used in code.

## Out of scope (binding)
Success = only rendered when the **polled backend status** is `paid` (never trust the pixel's own success callback alone). Refunds/void UI. Any other page/route. Dashboard "manage my subscription" flows.

## Acceptance Criteria
- `tsc`, `lint`, `build` green.
- `/pricing` renders; clicking Pro CTA opens the checkout section inline; phone validation enforced client-side (required, basic shape).
- Flow works offline end-to-end with a fake/stubbed session (badge "paid" only after poll says paid), i.e. the section is testable without Paymob credentials.
- `grep -rn "paymob" src/` only hits: `features/payments/paymob/**`, `features/payments/components/paymob-pixel.tsx`, `messages/*.json` keys, and the webhook/checkout routes. No secrets in client bundle.
- All UI copy is bilingual (both `en.json` and `ar.json` updated); no inline hardcoded user-facing strings in TSX.