# Epic 11 — Monetization: Plans, Subscriptions & Billing Structure

## Purpose (one line)
Introduce the monetization foundation: a **plan/subscription model**, a software-defined **plan-limit engine** wired into every feature gate a physical payment gateway will later enforce, and an admin-manageable billing ledger — so a future payment gateway can plug in without reworking the product's spine.

## Why this epic matters
The product currently lets anyone create unlimited sites with no concept of a plan or payment. To monetize, we must first define what users can do (Free vs Pro), granularly enforce it, and keep a billing record the super-admin can adjust manually. Choosing the correct structure now means the later gateway (Stripe/payment provider) is a thin adapter, not a rearchitecture. This epic is deliberately **infrastructure-first**: it ships the model and gates with plans but **no live payment collection** yet.

## Scope boundaries

**In:**
- A **Plan model** (e.g. Free / Pro) with a **PlanDefinition** that software-defines every limit as data (site count, pages/site, languages, custom domain, image size, AI generations/day, published sites).
- A **Subscription** record per user: plan, status (trialing / active / past_due / canceled / ended), billing period, pricing; designed to be driven by a future payment gateway.
- A **Billing/Invoice ledger** for manual (admin-entered) and future gateway-created records.
- **Monetization guard CLI/SDK** (`src/features/monetization/lib/*`): pure, deterministic `checkLimit(userPlan, scope)` helpers used by every gate.
- **Entitlement middleware/helpers** in routes that gate: creating a site, adding pages/languages, publishing, switching template, AI generation, image upload size — returning a consistent paywall error shape.
- Account **status** (`active` / `suspended` / `frozen`) that the admin can set (used by Epic 12).
- Keep existing default behavior on the Free plan so nothing breaks for existing users.
- All UI copy bilingual EN + AR, RTL-safe (a small "Current plan" affordance + upgrade prompt).

**Out (future):**
- **No real payment gateway**, no card checkout, no webhooks — a later epic adds the gateway adapter that writes to the Subscription/Billing records.
- No dunning/emails.
- No public pricing/checkout page in this epic (a minimal "current plan" notice is fine).
- Admin UI → Epic 12 (this epic only exposes the data + guard helpers the admin uses).

## Milestones (in order)
1. **01-plan-and-subscription-model** — plans, subscription, billing records, account status; migrate users to Free.
2. **02-monetization-guard-layer** — `checkLimit` engine + entitlement helpers; consistent paywall error shape + API/route guard wiring.
3. **03-gate-application** — apply limits to every monetized surface (create site, pages, languages, publish, switch template, AI generation, image upload); Free defaults; upgrade/notification affordance.
4. **04-billing-ledger-and-manual-records** — invoice ledger + APIs for admin manual records (consumed by Epic 12) and (optional) an admin-set plan/subscription.

## Cross-epic dependencies
- Depends on Epics 01–06 (auth/users, sites, generation, publishing) and Epic 08 (pages — needed for page-count limits).
- Epic 12 (Super Admin) consumes this epic's guards, account status, and ledger — so 11 must land before 12.
- Epics 09–10 are independent and can proceed in parallel.
