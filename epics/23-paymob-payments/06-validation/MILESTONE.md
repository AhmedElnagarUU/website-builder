# Milestone 06 — Validation & Report

## Goal

Independent (orchestrator-verified) validation of the whole Epic 23 and a standalone report that a reviewer can read without the codebase. This is the "Definition of Done" gate — nothing else marks the epic complete.

## Dependencies
- M01–M05 all merge into the working tree and build clean.

## Checklist (run in this order)

### 1. Code quality
- `npx tsc --noEmit` → 0 errors.
- `npm run lint` → 0 errors, no warnings for files created by this epic.
- `npm run build` under the build rule: stop any dev server on :3000 → `Remove-Item -Recurse -Force .next` → run plain `npm run build` (if `next/font` hangs on Google Fonts use `NODE_OPTIONS=--dns-result-order=ipv4first`, the known repo fix) → restart dev via `start-dev.bat` → `GET /api/health` must return `{"status":"ok"}`.

### 2. Security scan (mission §22)
- `grep -rni "PAYMOB_SECRET_KEY" src/` → only `features/payments/paymob/config.ts` (server-only). Never in `client.tsx`, `NEXT_PUBLIC_*`, API responses.
- `grep -rni "PAYMOB_HMAC_SECRET" src/` → same single place.
- `grep -rni "NEXT_PUBLIC_PAYMOB" src/` → empty.
- `grep -rniE "billing_data|special_reference" src/` → only `features/payments/paymob/**` (provider edge).
- Ensure no `console.log(` with raw callback payload / PAN anywhere in the new code (code review).
- `metadata.raw` contains no `source_data` (M02 strips it) — verify `src/features/payments/paymob/provider.ts`.

### 3. Boundary & scope audit
- `grep -rn "from \"mongodb\"" src/features/payments` → empty (mongoose only).
- Paymob-importing files outside `features/payments/paymob/**` + `components/paymob-pixel.tsx` → none (mission §17/§18).
- No icon in `src/app/api/` beyond the intended routes: `checkout/route.ts`, `checkout/[paymentId]/route.ts`, `webhooks/paymob/route.ts`.
- `monetization/` untouched except `types.ts` (PaymentProvider union + PlanDefinition price fields) and `plans.ts` (Pro price): `git diff` confirms.
- `.env.example` documents the five Paymob vars; `.env` has none.

### 4. Runtime smoke (dev server, no real Paymob creds)
- `POST /api/checkout` unauth → 401. `{ "planId": "free" }` → 400. Missing phone → 400.
- Happy-path with a **stubbed provider** (or: verify persistence path through the injected provider pipeline): record created `pending`; GET status route returns it; bogus id → 404.
- Webhook: crafted HMAC-fail → 401 + record stays pending; replayed real-shaped callback (or direct `processPaymobWebhook`) → duplicate_ignored + exactly one billing row + subscription active once.
- `/pricing` renders with the checkout section; Pixel CDN tags inject once (browser check via devtools if Run Wallet/creds unavailable — at minimum verify the component mounts safely with a fake session).

### 5. Report — `docs/05-problems/05-paymob-integration-report.md`
Sections (mirror mission §23 but concise for this repo):
- **Summary** — what was integrated, and the honest limitation: no live Paymob credentials → en dp; test mode/mocked logic only.
- **Changed Files** — every created/modified file grouped by milestone.
- **Architecture** — where the provider boundary is (server + FE), the three layers diagram, why no new deps.
- **Payment Flow** — checkout → intention → client_secret → Pixel → TRANSACTION callback → HMAC(20-field SHA-512) → idempotent transitions.
- **Security** — secret server-only, client_secret is the only browser-bound Paymob value, HMAC mandatory, no PAN stored/logged.
- **Testing** — exactly what was run and result (tsc/lint/build/security greps/runtime stubs). Mark NOT tested (no real creds/test card/webhook URL/3DS).
- **Remaining Work** — dashboard integration IDs/test creds, webhook URL per integration, v1/live keys, real Pixel render + 3DS + Apple Pay test, refund/void handling, recurrence (this is single-payment monthly; no auto-renewal — call it out explicitly as future scope).

## Acceptance Criteria
- All checklist steps pass; report written at `docs/05-problems/05-paymob-integration-report.md`; `git diff` review shows no unrelated file modified. Epic done.