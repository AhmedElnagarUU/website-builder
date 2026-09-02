# Milestone 03 — Billing & Plans Admin

## Goal
Give the admin full manual control over a user's billing: set/change their plan and subscription, and record manual payments/discounts/credits, with revenue totals and an audit trail — no engineer needed.

## Shared context
- Consumes the **Epic 11 M04 admin APIs** (set subscription; record manual payment/credit) and the ledger reading helpers. This milestone is the UI layer over them.
- The same admin-guard, bilingual/AR, vexa conventions apply.
- Revenue = `sumBillingForUser` across all users (or a ledger-wide revenue query) — show a total on the Overview.
- **Audit:** billing actions (set plan, record payment, write-off/credit) log an admin_audit entry (reuse M02 audit helper).

## Tasks
1. **01-manual-subscription-editor** — admin UI to view/change a user's plan/subscription and set free/pro, period, status, cancel-at-period-end (via the Epic 11 API).
2. **02-manual-payment-and-revenue** — admin UI to record manual payments/discounts/credits and show revenue totals + ledger history on user detail and Overview.
