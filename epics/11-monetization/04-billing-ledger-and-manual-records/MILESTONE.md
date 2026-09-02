# Milestone 04 — Billing Ledger & Manual Records

## Goal
Establish a durable billing/invoice ledger plus admin-facing records/APIs so the super-admin can manually set plans/subscriptions and record payments, with a clean seam for a future payment gateway to write into the same ledger.

## Shared context
- **Ledger discipline:** all money is integer **minor units** + `currency`; dates are ISO/UTC; every record has an immutable `kind` and `createdBy`. No floats.
- Two admin capability surfaces this milestone provides (UI lives in Epic 12):
  - **Manual subscription/plan set** — admin assigns a plan, period, status, cancel-at-period-end.
  - **Manual invoice/payment record** — admin records a payment (or writes off / grants credit) into the ledger.
- Future gateway (Stripe/etc.) will append gateway-originated ledger records (kind: `gateway_charge`, `gateway_refund`, …) and update the subscription; this epic fixes the schema + interaction seams (e.g. a `provider` field and a webhook-friendly append function), but ships no gateway.
- Owner (end-user) never writes the ledger — only the admin (Epic 12) and, later, the gateway.

## Tasks
1. **01-invoice-ledger-model** — `BillingInvoice`/ledger collection + repository with append (immutable) + query helpers; money in minor units.
2. **02-admin-subscription-and-payment-apis** — API routes (admin-scoped) to set plan/subscription and to record a manual payment; leave clear extension points for a gateway adapter.
