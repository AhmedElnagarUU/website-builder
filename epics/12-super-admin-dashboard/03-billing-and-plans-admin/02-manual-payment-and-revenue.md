# Task — Manual payments and revenue overview

## Title
Admin manual-payment recording and revenue totals

## Context
The operator must record payments received by other means (cash, bank transfer, manual charge) and see the business revenue, with a full history per user.

## Scope
Admin UI to record a manual payment (or discount/credit) on a user's billing, show the user's ledger history, and surface total revenue on the Overview.

## Technical details
- Files: `src/features/admin/components/ManualPaymentForm.tsx` + `RevenueCard.tsx`; consumes Epic 11 `POST /api/admin/users/[userId]/billing/records` (append manual payment/discount/credit) and ledger read helpers (`listBillingForUser`, `sumBillingForUser`) + a ledger-wide revenue query for the Overview.
- Form: kind (payment/discount/credit), amount in minor units + currency, optional description; validates (integer minor units, non-zero for charges).
- User billing history lists records newest-first with net sum.
- Overview (admin `/admin` page) shows total revenue, plus monthly revenue if cheap to compute.
- Every recorded record + any write-off appends an audit entry.
- Bilingual + RTL; vexa-styled; admin-guarded.

## Dependencies
- Epic 11 M04 (ledger + admin payment API). Epic 12 M01/M02 (shell, audit, user detail).

## Out of scope
- Real gateway/reconciliation. CSV export.

## Acceptance criteria
- Admin can record a manual payment/discount/credit; it appears in the user's ledger and sum.
- Revenue total on Overview reflects recorded records.
- Non-admin → 403; invalid amount/currency/kind → 422.
- Audit entries recorded; EN + AR correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps; build per build rule.
- ESLint clean; typecheck passes; record + revenue + audit smoke-tested.
