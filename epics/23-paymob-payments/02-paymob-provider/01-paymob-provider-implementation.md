# Task 01 — Paymob config, client, HMAC, and provider implementation

## Context
Implement Paymob-specific code behind the M01 `PaymentProvider` abstraction. All of it lives in `src/features/payments/paymob/` and is invisible to the rest of the app. The Intention API is a plain HTTPS `fetch` — no Paymob SDK, no new npm dependency.

Read before starting (mandatory order): `CODE_RULES.md` in full → this task → parent `epics/23-paymob-payments/02-paymob-provider/MILESTONE.md` → M01 contract in `1-payment-domain/MILESTONE.md` → `src/features/payments/provider.ts` (exists after M01).

Before writing the client, fetch the **official** create-intention page (https://developers.paymob.com/paymob-docs/intention-apis/create-intention) and the webhooks/HMAC page (https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac) and align field names/order exactly. Do not implement from memory.

## Deliverables

### `src/features/payments/paymob/config.ts`
- `PAYMOB_SECRET_KEY`, `PAYMOB_PUBLIC_KEY`, `PAYMOB_HMAC_SECRET` — `process.env` resolved at module load, `throw new Error("PAYMOB_SECRET_KEY is not defined")` etc. if missing.
- `PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com"` (strip trailing slash).
- `PAYMOB_PAYMENT_METHODS = (process.env.PAYMOB_PAYMENT_METHODS || "card").split(",").map(s=>s.trim()).filter(Boolean)`.
- Comment: server-only, never import from client code.

### `src/features/payments/paymob/client.ts`
- Types: `PaymobIntentionRequest`, `PaymobIntentionResponse` (per MILESTONE), `PaymobProviderError` class (`name="PaymobProviderError"`, fields `providerCode?: string`, `status?: number`, safe `message`).
- `createPaymobIntention(req)` as specced. **Phone required**: if `req.billingData.phone_number` missing/empty → throw `PaymobProviderError("billing phone_number is required")`.
- Map non-2xx responses: read body text once; build a sanitized message that never embeds the full raw body or any credential; include the upstream status. 
- Return `{ intentionId: res.id, orderId: String(res.intention_order_id), clientSecret: res.client_secret }`. Throw if `client_secret` absent.

### `src/features/payments/paymob/hmac.ts`
- `verifyTransactionHmac(obj, receivedHmac, secret): boolean` — fail closed on missing fields/length mismatch; SHA-512, lowercase hex; `crypto.timingSafeEqual`; exact 20-field order from Paymob docs (list in MILESTONE).
- Export the field-order array as a constant for testability.

### `src/features/payments/paymob/status-map.ts`
- `statusFromTransaction(obj): "paid" | "pending" | "failed"` per MILESTONE rules. `paid` requires `success === true` AND `pending === false` (booleans, not truthy strings — paymob sends real booleans; handle both defensively).

### `src/features/payments/paymob/provider.ts`
- `PaymobProvider implements PaymentProvider` per MILESTONE contract.
- `createPayment`: derive `items` + `billingData` from `CreatePaymentInput.customer` (split name into first/last on first space, defaults `"NA"` for missing name parts — but **email may be empty, phone must not be**). `notificationUrl` from `process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"` + `/api/webhooks/paymob`.
- `handleWebhook(input, hmac?)`: expects `{ type, obj }`; `hmac` required from caller (query param); verify → throw on fail; map status; return `PaymentWebhookResult`.
- `metadata`: pass through the full `obj` under `metadata.raw` — but **never** include `source_data.pan` (PAN is sensitive; mission §13/§15 forbids logging sensitive card data). Strip `source_data` before storing; keep non-sensitive top-level fields.

### `src/features/payments/paymob/index.ts`
Re-export `PaymobProvider`, `PaymobProviderError`, `verifyTransactionHmac`, `statusFromTransaction`.

### `.env` note
No change to `.env` files — dev server reads what already exists; new vars are documented in `.env.example` (M01). Do not invent `.env.local`.

## Out of scope
Database writes, API routes, webhook route, frontend, refunds. No new deps.

## Acceptance Criteria
- `tsc --noEmit`, `lint`, `build` green (build rule).
- `grep -rn "from \"./paymob\|from \"@/features/payments/paymob" src --include=*.ts` shows imports only inside `paymob/**` + (future) routes that M03/M04 will add — because M03/M04 don't exist yet, today **zero** out-of-folder imports.
- `verifyTransactionHmac` is a pure function taking `secret` as a parameter (no `config.ts` import inside `hmac.ts`).
- No `PAYMOB_` secret in `NEXT_PUBLIC_*` names; grep `NEXT_PUBLIC_PAYMOB` → empty.
- No PAN/source_data stored in `metadata`.