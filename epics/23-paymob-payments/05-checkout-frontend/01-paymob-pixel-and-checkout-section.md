# Task 01 — PaymobPixel component (isolated CDN loader) + CheckoutSection + PricingCta wiring

## Context
Epic 23 M05: all checkout frontend. Two components + one edit. Read the parent MILESTONE.md first — the boundary rules and state machine are binding. Read `src/features/monetization/components/PricingCta.tsx` and the `/pricing` page (`src/app/[locale]/pricing/page.tsx`) to match existing patterns, and `messages/en.json` + `messages/ar.json` for the i18n structure (key naming convention e.g. `pricing.*`).

Read before starting (mandatory order): `CODE_RULES.md` → this task → `epics/23-paymob-payments/05-checkout-frontend/MILESTONE.md`.

## Deliverable A — `src/features/payments/components/paymob-pixel.tsx`
`"use client"`. Props:
```tsx
interface PaymobPixelProps {
  clientSecret: string;
  publicKey: string;
  paymentMethods: string[];       // ["card","google-pay","apple-pay"]
  onComplete: () => void;         // user finished with the Pixel UI; parent then POLLS (never trusts)
  onCancel?: () => void;          // Apple Pay cancel
  onError: (messageKey: string) => void;
}
```
Behavior (all official-doc-driven; mission §11/§12):
- Client-only: mount nothing until `typeof window !== "undefined"`.
- Load scripts+syles once (module-scope guard against double-inject):
  - `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/paymob-pixel@latest/styles.css">`
  - `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/paymob-pixel@latest/main.css">`
  - `<script type="module" src="https://cdn.jsdelivr.net/npm/paymob-pixel@latest/main.js">`
- After script load, instantiate the global `Pixel` (typed via a local `declare global` interface — do NOT invent a `paymob` npm type package): new Pixel({ publicKey, clientSecret, paymentMethods, elementId: "paymob-elements", afterPaymentComplete: () => onComplete(), onPaymentCancel: () => onCancel?.(), customStyle: RTL when ar }). Set `customStyle.Direction` = "rtl" for Arabic (and appropriate label/placeholder texts in Arabic from the docs sample, only if straightforward).
- Re-render safety: element id must exist; destroy previous `Pixel` instance on unmount if the SDK exposes any teardown (in practice `new Pixel(...)` mounts into the node — guard duplicate initialization with a ref). Clean up event listeners. Wrap init in try/catch → `onError('checkout.provider_error')`.
- Loading state + "iframe not ready" handling: render nothing until `onReady`? Keep minimal — a `<div id="paymob-elements">` always present; callbacks drive the parent.

## Deliverable B — `src/features/payments/components/checkout-section.tsx`
`"use client"`. Inline section (RTL-safe logical layout) with internal step state machine:
```
idle → form(phone required, name optional, prefilled from session user if available) 
  → creating (POST /api/checkout) → ready(PaymobPixel) 
  → processing (after pixel complete: poll GET /api/checkout/[paymentId] every 2s, max ~60s)
  → success / failed / cancelled / already_pro   (terminal, with retry buttons)
```
- Calls the API with `fetch`; consume `{ error: code }` shapes from M03. Show bilingual messages for all outcomes (keys from MILESTONE: `checkout.*`).
- Success state only from `GET /api/checkout/[paymentId]` returning `status:"paid"`. Show "upgrade succeeded" + a link back to dashboard.
- `provider_error` → message + retry. `already_pro` → message (their plan already active).
- Accept optional `initialOpen?: boolean` prop to mount-open. Component import must not break SSR (it's a client component; the pricing page renders it fine).

## Deliverable C — `src/features/monetization/components/PricingCta.tsx`
- On "Upgrade to Pro" (non-signed-in → sign-in nav as today; signed-in) → set local state `open=true` → render `<CheckoutSection />` inline below the CTA.
- The Pro card stays as the purchase entry point; **remove/disable** the "coming soon" reveal (`pricing.coming_soon` key may stay in messages but no longer shown — check how PricingCta toggles it and confirm the page doesn’t hardcode it elsewhere).
- Must not break existing "Your current plan" / plan comparison states.

## Out of scope
Success indication without backend confirmation (forbidden), dashboard billing management, refund UI, other pages, `withEntitlement` changes.

## Acceptance Criteria
- `tsc`, `lint`, `build` green (build rule).
- `/pricing` loads; Pro CTA (signed-in session via a temporary dev account) opens inline section; phone+name form validates.
- Offline test path: stub `fetch("/api/checkout")` in the browser devtools or (cleaner) verify the section handles a fake 201 `{ clientSecret: "...", paymentMethods: ["card"], publicKey: "test" }` → mounts Pixel element div with the right element id and injects the CDN `<script>` tags exactly once (guard against double-inject on re-render); poll loop stops on `status:"paid"` and shows success.
- `grep -rn "PAYMOB" src/components src/features/payments src/messages` → only `checkout.*` UI keys + `paymob-pixel.tsx` references; no secret names in client code.
- Arabic: all new strings present in `messages/ar.json`; Pixel `customStyle.Direction === "rtl"` for `ar`.