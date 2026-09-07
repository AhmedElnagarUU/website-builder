# Epic 12 — Super Admin Dashboard

## Purpose (one line)
Build an internal, admin-only console where the site's operator can see how many users the app has, manage them (search, view, freeze/suspend accounts), edit billing manually (set plans, record payments manually), and keep an audit trail — so the business can run without engineering involvement.

## Why this epic matters
The product needs operator control before it grows: the admin must see the user base, intervene on accounts (freeze bad actors, suspend), and adjust billing/payments manually (trials, cash, appeals) until a real payment gateway is wired. This is the operational half of monetization and gives the owner real governance over the app.

## Scope boundaries

**In:**
- An **admin role** on the user model (`role: "user" | "super_admin"`) with an admin-only guard used by all admin routes/pages.
- An **admin-only section** of the app (its own area/route) with a dashboard: **total users**, site counts, published counts, active subscriptions, frozen/suspended users, revenue (from ledger).
- **User management**: search/list users, view a user's profile, sites, subscription, billing history; **freeze** / **suspend** / **reactivate** an account (accountStatus).
- **Manual billing**: set a user's plan/subscription and **record a manual payment** (consume Epic 11 M04 admin APIs).
- A lightweight **audit log** of admin actions (who did what/when) for accountability.
- Bilingual EN + AR, RTL-safe, mono-styled.

**Out (future):**
- Real payment gateway + checkout (future epic; Epic 11 M04 leaves the seam).
- Advanced analytics/CSV export beyond a simple list.
- Admin notification/email tooling.

## Milestones (in order)
1. **01-admin-foundation** — admin role, guard, admin area shell/nav, layout.
2. **02-user-and-account-management** — list/search users, view user detail (sites, subscription, billing), freeze/suspend/reactivate, audit log of these actions.
3. **03-billing-and-plans-admin** — admin UI to set plan/subscription and record manual payments; surfaces ledger totals for revenue.

## Cross-epic dependencies
- Depends on **Epic 11** (monetization: plan/subscription model, accountStatus, ledger, admin APIs) — 12 consumes those.
- Depends on Epics 01–06 (users, sites, auth) and Epic 08 (pages) for the data it shows.
- Independent of Epics 09–10.
