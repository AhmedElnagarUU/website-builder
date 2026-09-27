# Hermes2.md — Agent handoff / continue-work brief (Epic 15 session)

**Repo:** `C:\Users\ahmed\OneDrive\Desktop\website-version2` ("monomastic" — AI website builder).
**Written:** 2026-09-12, end of the session that implemented **Epic 15 — Notes-Fixes** (see `hermes.md` for the earlier, still-pending *newmodern reskin* mission).
**State:** Epic 15 fully implemented and verified. **Nothing committed. Dev server running on :3000.**

---

## 1. Mission (this session's job — DONE)

Execute the 5 change items the owner listed in `docs/06-notes/03-need-to-change.md`:

| # | Note item | Status |
|---|---|---|
| 1 | Upgrade plan from navbar | ✅ done |
| 2 | Delete website with copy-paste/typed confirmation | ✅ done |
| 3 | Language labels → `ar`/`en` codes | ✅ done |
| 4 | Footer links work + privacy & terms pages | ✅ done |
| 5 | Remove super-admin dashboard (future separate app) | ✅ done |

All 5 were implemented by a `general` subagent following **`prompt/25-epic15-notes-fixes.md`** and independently verified (tsc=0, lint=0, clean build pass, runtime 200/404 checks, admin-grep zero).

## 2. Where we stopped

- The epic work is **complete and verified**. The last action was the runtime smoke test: `/en|ar/pricing`, `/en|ar/privacy`, `/en|ar/terms` → **200**; `/en/admin` and `/api/admin/users` → **404**; `/api/health` → `{"status":"ok","db":true}`.
- **Nothing was committed.** The whole Epic 15 change set sits in the working tree, ready for review/commit.

## 3. What changed (exact inventory)

**New files**
- `epics/15-notes-fixes/EPIC.md` + 5 milestone folders/MILESTONE.md + 7 task files (authoring artifacts).
- `prompt/25-epic15-notes-fixes.md` (execution brief).
- `src/app/[locale]/pricing/page.tsx` (+ `src/features/monetization/components/PricingCta.tsx`).
- `src/app/[locale]/privacy/page.tsx`, `src/app/[locale]/terms/page.tsx`.
- `src/features/sites/api/delete-site.ts` (owner guard + best-effort S3/`pageviews` cleanup).
- `src/features/dashboard/components/DeleteSiteButton.tsx` (typed-name confirm dialog).

**Edited**
- `src/features/shell/components/Navbar.tsx` — "Upgrade" (`nav.upgrade`) beside `PlanBadge` when signed-in and `planId !== "pro"`.
- `src/features/shell/components/Footer.tsx` + `src/app/[locale]/layout.tsx` — all 11 links now real targets (`${locale}/#how`, `/#features`, `/#languages`, `/pricing`, `/privacy`, `/terms`, home); zero `href="#"` left.
- `src/app/api/sites/[siteId]/route.ts` — added `DELETE` (401 / 404 / 200 via `deleteSiteForCurrentUser`).
- `src/features/dashboard/components/SiteCard.tsx` — relative wrapper + Delete trigger (`bottom-3 end-3`); lang chips now codes.
- `src/features/analytics/repository.ts` — added `deleteSitePageviews`.
- `src/features/shell/components/LanguageSwitcher.tsx` (`otherLabel = otherLocale`), `src/features/publishing/components/LiveLocaleSwitcher.tsx` (`en|ar`), `src/features/landing/components/Languages.tsx` (`EN`/`AR` pills).
- `src/messages/en.json` + `ar.json` — added `nav.upgrade`, `pricing.*`, `delete.*`, `dashboard.delete_site`, `legal.privacy.*`, `legal.terms.*` (Arabic verbatim from the task files); removed the whole `admin.*` namespace.

**Deleted (super-admin removal)**
- `src/app/[locale]/admin/**` (layout, page, users, users/[userId], billing).
- `src/app/api/admin/**` (7 route handlers).
- `src/features/admin/**` (whole folder).
- `src/features/monetization/lib/admin-auth.ts`, `api/admin-set-subscription.ts`, `api/admin-record-payment.ts`.
- From `monetization/types.ts`: `AdminRole` + `role` field on `Membership`. From `repository.ts`: `getAdminRole`, `adminSetSubscription`, `listBillingByAdmin`, `setAccountStatus`, orphaned `setSubscriptionStatus`/`setSubscriptionPlan`, dead `ensureAllUsersHaveFreePlan`. **Kept:** `AccountStatus` + `getAccountStatus` (paywall gating still wired via `lib/checkLimit.ts` / `lib/entitlement.ts`).

## 4. Verification evidence (run again before continuing, cheap)

```
npx tsc --noEmit            # was exit 0
npm run lint                # was: No ESLint warnings or errors
```
Build rule (only when a full build is needed): stop port 3000 (`Get-NetTCPConnection -LocalPort 3000 …` `Stop-Process`), `Remove-Item -Recurse .next`, `npm run build` plainly (never piped through `Select-Object`), restart via `start-dev.bat`, verify `/api/health` → `{"status":"ok"}`. Dev server is crash-prone on heavy compiles; Python-free PowerShell, never use `$PID` (reserved).

## 5. Git / working-tree state (what to leave alone)

`git status --short` shows Epic 15 changes uncommitted (expected). **Out-of-scope leftovers also present — do NOT touch, do NOT commit without the user's say-so:**
- `?? newmodern/` (top-level mockups) — design source for the still-pending reskin mission in `hermes.md`.
- `?? epics/14-template-modern-redesign/07-newmodern-reskin/` and `?? epics/14-template-modern-redesign/01-design-audit/newmodern-design-source.md` — the reskin *planning*, still unimplemented.
- ` M epics/14-template-modern-redesign/01-design-audit/audit-report.md` — patched by the reskin planning session.
- ` M docs/06-notes/03-need-to-change.md` (owner's notes) and ` M src/features/create-wizard/lib/useAutosaveForm.ts` — pre-existing, unrelated.

## 6. What's next (candidate priorities — confirm with the user)

1. **Review + commit Epic 15** (per user's go-ahead only — agents never commit unprompted). Include `epics/15-notes-fixes/` + `prompt/25-epic15-notes-fixes.md` + the `src/**` + messages changes above.
2. **Execute the newmodern reskin** — the bigger pending mission from `hermes.md`: `epics/14-template-modern-redesign/07-newmodern-reskin/` tasks `01`→`06`, one `general` subagent per task, design source = `01-design-audit/newmodern-design-source.md`. Still **zero implementation code written** for it.
3. **Pexels business-accurate template images** — brief exists (`prompt/21-pexels-images-pipeline.md`), NOT yet executed. `.env` has `PEXELS_API_KEY`; replaces the 37 `public/templates/real/**/*.webp` via a committed Node script (Phase 1) + optional S3 auto-fill (Phase 2).
4. **Code-quality fixes** — `docs/06-notes/01-code-quality-notes.md`: (a) fatal error handling when the MongoDB connection fails is weak; (b) the DB connection has a race condition under concurrent requests. See `src/shared/db/database.ts` (the singleton).
5. **Future separate admin app** — owner will rebuild it; `epics/12-super-admin-dashboard/` + `prompt/15-epic12-super-admin.md` remain as the spec. `admin_audit`, `billing`, `memberships.role` data stays in Mongo untouched.

## 7. Context needed to continue (mandatory reading for the next agent)

Per `AGENTS.md`: `CODE_RULES.md` (in full) → parent `MILESTONE.md` of the task → the single task file. Nothing else. Key standing rules:
- No new npm dependencies without explicit human approval (CODE_RULES §4 — next/font/google fonts are fine, they are not deps).
- i18n + RTL by default: no hardcoded user-facing strings; all new keys go in **both** `src/messages/en.json`/`ar.json` (task files give Arabic verbatim); layout-critical CSS uses logical utilities only (`ms-*`/`me-*`/`ps-*`/`pe-*`/`text-start`/`text-end`), never `ml-*`/`text-left`…; arrows flip with `rtl:rotate-180`.
- API ownership rule: owner-scoped endpoints return `401` (no session) / `404` (not owner), never 403.
- Engine seam: `src/shared/site-render/SiteRenderer.tsx`, `context.ts`, `tokens.ts`, `atoms.tsx`, section map, `F`/`SlotImage`/`SampleTag` must never be rewritten — redesigns happen inside section files + additive `globals.css` + catalog/demo data.
- Environment: Windows / PowerShell 5.1; repo path contains spaces + OneDrive; dev on `:3000`; never use `$PID`.

## 8. Invariants (never violated)

- No structural/drag-and-drop editing surface; publish vs edit separate actions; manually edited content never silently overwritten.
- Arabic is a first-class RTL version, never a translation skin.
- No new npm deps without approval; no hardcoded user-facing strings; RTL-logical utilities only.
- Super-admin stays out of this app (the future app owns `admin_audit`/role data); account-status paywall gating must keep working.
- Nothing committed unless the user explicitly asks.