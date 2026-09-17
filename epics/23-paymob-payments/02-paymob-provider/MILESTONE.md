# Milestone 02 — Paymob Provider (Intention client + provider + HMAC)

## Goal

Implement the Paymob-specific edge behind the `PaymentProvider` abstraction from M01. Nothing outside `src/features/payments/paymob/` should ever import these modules.

## Dependencies
- M01 complete: `payments/provider.ts` interface + `payments` repository + plan price + env vars in `.env.example`.
- Paymob Intention API: `POST {base}/v1/intention/`, header `Authorization: Token {PAYMOB_SECRET_KEY}`, body requires `amount` (cents), `currency`, `payment_methods`, `items[]` (each `{name, amount, [description?]}`), `billing_data` (**phone_number REQUIRED**), optional `customer`, `special_reference` (echoed back as `merchant_order_id`), `notification_url`. Response 201: `{ id, intention_order_id, client_secret, ... }`.
- Verify request/response shape against the live official docs at create-intention time before writing code.

## Deliverables (all under `src/features/payments/paymob/`)

### `config.ts`
Server-only constants from env (resolve+throw for SECRET/PUBLIC/HMAC, defaults for BASE_URL=`https://accept.paymob.com` and PAYMENT_METHODS). Never imported by client code.

### `client.ts` — Intention API client (plain `fetch`, no SDK)
```ts
export interface PaymobIntentionRequest {
  amount: number;                 // minor units (EGP 499 → 49900)
  currency: string;               // "EGP"
  paymentMethods: string[];       // names: "card"|"google-pay"|"apple-pay"
  items: { name: string; amount: number; description?: string }[];
  billingData: { first_name?: string; last_name?: string; email?: string; phone_number: string };
  notificationUrl?: string;
  specialReference?: string;      // our PaymentRecord id
}
export async function createPaymobIntention(req: PaymobIntentionRequest): Promise<{
  intentionId: string;            // id
  orderId: string;                // intention_order_id
  clientSecret: string;           // client_secret
}>;
```
- `fetch(`${PAYMOB_BASE_URL}/v1/intention/`, { method:"POST", headers:{ "Authorization": `Token ${PAYMOB_SECRET_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify(...) })`.
- Non-2xx → throw a typed `PaymobProviderError` carrying a **safe** message (never include the secret key or raw upstream body verbatim in error text; include `status`, and a sanitized detail).
- On success map the response; `client_secret` and ids are returned to the caller.

### `hmac.ts` — callback verification (SHA-512, NOT the raw body)
Verify Paymob's transaction callback HMAC per the official 2026 "Webhooks & HMAC" doc:
- Callback POST body is `{ type: "TRANSACTION", obj: { amount_cents, created_at, currency, error_occured, has_parent_transaction, id, integration_id, is_3d_secure, is_auth, is_capture, is_refunded, is_standalone_payment, is_voided, order: { id }, owner, pending, source_data: { pan, sub_type, type }, success } }`.
- `hmac` arrives as a **query parameter** on the callback URL, not a header, and NOT over the raw body.
- Compute `HMAC-SHA512` over the **20 fields in Paymob's exact order** (see list above), each `String(...)`ed and concatenated with **no separator**, key = `PAYMOB_HMAC_SECRET`, result **lowercase hex**.
- Nested paths: `obj.order.id`, `obj.source_data.pan/sub_type/type`.
- Compare constant-time (`crypto.timingSafeEqual`, guard length).
```ts
export function verifyTransactionHmac(obj: Record<string, unknown>, receivedHmac: string, secret: string): boolean;
```
- Handle JS truthiness traps the same way Paymob's official samples do (booleans stringify as `"true"/"false"`). If any required field is missing → return `false` (fail closed).

### `status-map.ts` — transaction state → internal status
```ts
export function statusFromTransaction(obj: {...}): "paid"|"pending"|"failed";
```
Rules (mission §13 + official docs table): `success===true && pending===false` → `paid`; `pending===true` → `pending`; otherwise `failed`. Refunded/voided handling is out of scope for the first cut (note it in code comment only).

### `provider.ts` — implements `PaymentProvider` from M01
```ts
export class PaymobProvider implements PaymentProvider {
  async createPayment(input: CreatePaymentInput): Promise<PaymentSession>;
  async handleWebhook(input: unknown, hmac?: string): Promise<PaymentWebhookResult>;
}
```
- `createPayment`: map input → `PaymobIntentionRequest` (amount as-is in minor units, currency, methods from config fallback to `["card"]`, items `[{ name: input.description, amount }]`, billing phone required — if `customer.phoneNumber` is empty throw clear error), `specialReference = internalPaymentId`, `notificationUrl = `${appUrl}/api/webhooks/paymob`` where `appUrl` = `process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"`. Call `createPaymobIntention`, return `PaymentSession` with `provider:"paymob"`, ids, `clientSecret`, `publicKey` (from config), `paymentMethods`.
- `handleWebhook`: throw if missing `hmac`; `verifyTransactionHmac` on `(input as any).obj`; on fail throw `PaymobProviderError("invalid_hmac")` **before any state change**; map via `statusFromTransaction`; return `PaymentWebhookResult` (`providerTransactionId = obj.id`, `providerOrderId = String(obj.order?.id)`, plus amount/currency/method from obj if present).

### `index.ts`
Re-export `PaymobProvider`, `PaymobProviderError`, `verifyTransactionHmac` only.

## Out of scope (binding)
- No `api/` route, no webhook route, no DB writes here (routes are M03/M04; they call these functions).
- No refund/void processing.
- No Pixel/frontend.
- No new npm deps.

## Acceptance Criteria
- `tsc --noEmit`, `lint`, `build` all green (build rule applies).
- All Paymob imports confined to `src/features/payments/paymob/**` (grep-verified).
- `PAYMOB_SECRET_KEY`/`PAYMOB_HMAC_SECRET` appear nowhere in client components/`NEXT_PUBLIC_`/responses (grep `NEXT_PUBLIC_PAYMOB` → empty).
- HMAC helper is pure & injectable (secret passed as arg) — testable without credentials.
- No DB writes and no routes introduced.