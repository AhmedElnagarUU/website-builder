# Project Status Delta — Epic 11 Monetization (002)

## Report Metadata

| Field | Value |
|---|---|
| Report Type | Incremental delta (supersedes/extends `03-project-status-001.md` §Epic 11) |
| Report Sequence | 002 |
| Generated At | 2026-09-07 |
| Epic covered | 11 — Monetization: Plans, Subscriptions & Billing Structure |

Scope note: this report records ONLY what was done in this session (Epic 11 implementation). It is not a full-project re-audit. Statuses for all other epics remain as recorded in `03-project-status-001.md`.

---

# Epic 11 — Monetization: Plans, Subscriptions & Billing Structure

**Status:** COMPLETE — 9/9 tasks implemented. `tsc --noEmit` ✓, `npm run lint` ✓, `npm run build` ✓ (after clean rebuild), dev server restarted, `/api/health` → `{"status":"ok","db":true}` ✓.

## Milestones

| Milestone | Status | Tasks |
|---|---|---|
| M01 Plan & Subscription Model | COMPLETE | T01 plan data, T02 subscription + Free backfill |
| M02 Monetization Guard Layer | COMPLETE | T01 limit-check engine, T02 entitlement route helper |
| M03 Gate Application | COMPLETE | T01 create/publish/language, T02 AI/image, T03 paywall UX |
| M04 Billing Ledger & Manual Records | COMPLETE | T01 invoice ledger, T02 admin APIs |

## What was built

- **Feature:** `src/features/monetization/` — `types.ts`, `const.ts`, `plans.ts`, `repository.ts`, `lib/{usage,checkLimit,entitlement,admin-auth,paywall-client}.ts`, `components/{PaywallPrompt,PlanBadge}.tsx`, `paywall-context.tsx`, `api/{admin-set-subscription,admin-record-payment}.ts`.
- **Plan model (data, not if/else):** `PlanDefinition`/`PlanLimits`; bilingual `name` (EN/AR); `getPlanById`, `getDefaultPlan`.
  - **Free:** 1 site · 4 pages/site · 1 language · 1 published site · 10 MB image · 2 AI generations/day · no custom domain.
  - **Pro:** 10 sites · 50 pages/site · 2 languages · 10 published · 50 MB image · 50 AI/day · custom domain.
- **Subscription/account:** `subscriptions` + `memberships` collections; get/upsert/set-plan/set-status; account status `active|frozen|suspended`; idempotent `ensureAllUsersHaveFreePlan` backfill (read-before-write + unique `{userId}` index). Users resolve to active Free on first read.
- **Guard engine:** `getUsageForUser` (sites, pages/languages per site, published ids, AI-today via `generation.startedAt`, largest image bytes) + pure `checkLimit(userPlan, scope)` → Frozen/Suspended ⇒ 403; limit exceeded ⇒ 402 (`limit_reached`/`requires_upgrade`).
- **Entitlement helper:** `withEntitlement` — 401/403/402 envelope, auto-scopes `{siteId, amount}` for page/language/published limits.
- **Gates wired (8 routes):** `POST /api/sites`, publish (republish-aware), languages, switch-template, generate, regenerate, regenerate-section, image-upload.
- **Paywall UX (bilingual EN/AR):** `PaywallProvider` in root layout + server-resolved `planId`; `PlanBadge` in navbar; `usePaywall()` + `PaywallPrompt` wired into CreateSiteButton, PublishControl, LanguageChoice, RegenerateSiteControl, useGenerationPolling, ImageSlotEditor. All strings via `en.json`/`ar.json`.
- **Billing ledger:** `BillingRecord`/`BillingKind`/minor-unit `CurrencyTotal`; `appendBillingRecord`, `listBillingForUser`, `sumBillingForUser` (by currency), `listBillingByAdmin`, `adminSetSubscription`, `userExists`. Money = integer minor units + currency, never floats.
- **Admin APIs (consumed by Epic 12):** `requireAdmin` (memberships `role` — non-admin ⇒ 403; as-yet-unwired to Epic 12's roles module), `PATCH /api/admin/users/[userId]/subscription`, `POST /api/admin/users/[userId]/billing/records`. indexes: `{userId, createdAt:-1}`, `{createdBy, createdAt:-1}`, unique sparse `{providerEventId}` (webhook-idempotency seam).

## Key constraints honored

- No live payment gateway, no payment SDK. Seams only (`provider`, `providerSubscriptionId`).
- Free-plan defaults keep existing users working (guarded actions succeed on Free).
- Idempotent backfill and ledger appends; unique sparse provider-event index prevents duplicate webhook-driven records.
- No new npm dependencies. No structural editing surface introduced.

## Notes / deviations (flag for review)

1. `npx eslint .` unusable under ESLint v9 flat config → used `npm run lint` (matches repo's `package.json` script).
2. AI-daily counter derives from `site.generation.startedAt` because no generation-records collection exists.
3. `maxImageBytes` global client cap is 10 MB, so Pro's 50 MB is unreachable client-side (acceptable; Free-first priority).
4. Free `maxLanguages: 1` blocks bilingual for NEW Free sites (explicit plan value; existing bilingual sites safe via content-exists guard).
5. OK on migration safety: `ensureAllUsersHaveFreePlan` is idempotent.

## Unverified (runtime only)

- Live 401/403/402 responses, ledger/admin routes end-to-end, reactivate-after-status-change — need a seeded `super_admin` user and sign-in session.

## Not committed

- Working tree remains uncommitted (consistent with the pre-session hygiene finding in `03-project-status-001.md`).

## Next step

- Epic 12 — Super Admin Dashboard: consume `src/features/monetization` admin APIs + `requireAdmin`, then re-point the memberships `role` seam to `src/features/admin/lib/roles.ts` when Epic 12 M01 lands.