# Task — Admin subscription and manual-payment APIs

## Title
Add admin-scoped APIs to set a plan/subscription and record a manual payment

## Context
The super-admin (Epic 12) must be able to manually set a user's plan and record a payment — for trials, appeals, or cash/offline payments — while keeping the ledger authoritative and leaving a clean seam for the future gateway.

## Scope
Admin-only API routes (guarded by an admin role check — see Epic 12) to (a) set/update a user's subscription (plan, period, status, cancel-at-period-end) and (b) append a manual payment/discount/credit to the ledger.

## Technical details
- Files: `src/features/monetization/api/admin-set-subscription.ts`, `admin-record-payment.ts`, + routes `PATCH /api/admin/users/[userId]/subscription` and `POST /api/admin/users/[userId]/billing/records` (admin routes land with the admin guard infrastructure in Epic 12 M01; wire to it).
- Inputs validated with zod; money as integer minor units + currency.
- Setting subscription updates the user's `Subscription` record (and `accountStatus` if frozen/suspended is being toggled — coordinate with Epic 12 semantics).
- Recording a payment appends a `BillingRecord` (kind `manual_payment`/`discount`/`credit`, `createdBy = adminUserId`).
- Gateway seam: these admin operations set `provider: "manual"` and do not touch provider webhook fields.
- Admin authorization: only users with `role === "super_admin"` (see Epic 12 M01 role model) may call; otherwise 403.

## Dependencies
- M04 task 01 (ledger). Epic 12 (admin role + route guard) — implement the admin guard here, coordinated with Epic 12; Epic 12 provides the UI.

## Out of scope
- Admin UI (Epic 12). Gateway/webhooks. Public upgrade/checkout.

## Acceptance criteria
- Only an admin can set a subscription or record a payment (non-admin → 403, unauthenticated → 401).
- Subscription update persists and reflects in `getSubscriptionForUser`.
- Payment record appends to the ledger with correct minor units + `createdBy`.
- Invalid input (bad currency/amount/kind) → 422.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps; build per build rule.
- ESLint clean; typecheck passes; admin ops smoke-tested.
