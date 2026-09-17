# Task 01 — Checkout session + status routes

## Context
Epic 23 M03: the API the frontend needs to start a Pro purchase and poll its status. Server-computed amounts only; provvider is injected so the route is testable without live Paymob credentials.

Read before starting (mandatory order): `CODE_RULES.md` → this task → parent `epics/23-paymob-payments/03-checkout-endpoint/MILESTONE.md` → M01+M02 milestone contracts → existing route pattern `src/app/api/trial/status/route.ts` and `src/app/api/sites/route.ts` (how thin handlers + `getSession` + `withEntitlement` look). Keep this milestone's routes off `withEntitlement` (a checkout shouldn't be blocked by plan limits), but session is mandatory.

## Deliverables

### `src/features/payments/schema.ts` (zod)
```ts
export const checkoutSchema = z.object({
  planId: z.literal("pro"),
  phoneNumber: z.string().min(8).max(20),   // E.164-ish; Paymob requires phone
});
```
Export for reuse by route + feature fn. No other file in the payments feature owns zod schemas yet — this is the seed (`CODE_RULES` says validations live next to their feature).

### `src/features/payments/api/checkout.ts` (feature service — the logic layer)
```ts
export async function createCheckoutSession(
  user: { id: string; email?: string; name?: string },
  input: { planId: "pro"; phoneNumber: string },
  provider?: PaymentProvider                    // injectable for tests; defaults to new PaymobProvider()
): Promise<CheckoutSessionResult>

export async function getCheckoutStatus(
  paymentId: string,
  userId: string
): Promise<CheckoutStatusResult | null>
```
- `createCheckoutSession`: follow MILESTONE flow 1–8. Steps at route level: session check in the route; here do plan lookup (`getPlanById("pro")` from `plans.ts`), price read from catalog (`priceMinorUnits` + `currency`), existence guard (`getSubscriptionForUser` status active+provider → `{ ok:false, code:"already_pro", status:409 }`), persistence via `createPaymentRecord`, call injected provider `createPayment`, persist refs, return DTO. Wrap provider failures → `{ ok:false, code:"provider_error", status:502 }` (generic — never leak Paymob internals).
- `getCheckoutStatus`: `getPaymentRecordForUser`; return sanitized DTO or null.

DTO shapes (return a discriminated union `{ ok: true }`/`{ ok: false }` so routes stay dumb):
```ts
export type CheckoutSessionResult =
  | { ok: true; paymentId: string; planId: "pro"; amountMinorUnits: number; currency: string;
      status: PaymentStatus; clientSecret: string; publicKey: string; paymentMethods: string[] }
  | { ok: false; code: "invalid_plan" | "already_pro" | "provider_error" | "phone_required"; status: number };
```

### `src/app/api/checkout/route.ts` (POST)
Parse + validate with `checkoutSchema` → 400 on fail. `getSession()` → 401. Call `createCheckoutSession(session.user, parsed)`. Map `{ok:false}` → its `status` + `{ error: code }` (a known code; the frontend i18ns it). 201 on success.

### `src/app/api/checkout/[paymentId]/route.ts` (GET, dynamic route param)
`getSession()` → 401. `getCheckoutStatus(paymentId, session.user.id)` → 404 if null. 200 with sanitized DTO.

`params` type: match the app's existing dynamic route typing (`{ params: Promise<{ paymentId: string }> }` or current convention in this repo).

## Out of scope
Webhook, paid-transition state changes, `withEntitlement`, Subscription/Billing writes, frontend. Refunds.

## Acceptance Criteria
- `tsc --noEmit`, `lint`, `build` green (build rule: stop dev server → delete `.next` → build → restart → `/api/health` ok).
- Runtime spot-checks with the dev server up:
  - `POST /api/checkout` no session → 401.
  - `POST /api/checkout {"planId":"free","phoneNumber":"+20123456789"}` → 400.
  - Happy path: session-gated + **stubbed provider** → 201 with `clientSecret`/`publicKey`/`paymentMethods`, PaymentRecord row persisted (verify via a grep over `src` + DB inspection if MongoDB is reachable); record `status:"pending"`.
  - GET the returned `paymentId` → 200; GET a bogus id → 404.
  - Response JSON never contains `PAYMOB_SECRET_KEY` / `PAYMOB_HMAC_SECRET` (grep the literal strings).
- The injected `provider` param exists and defaults to the real `PaymobProvider`.