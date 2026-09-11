# Project Status Report

## Report Metadata

| Field | Value |
|---|---|
| Report Type | Project Status |
| Report Version | 1.0 |
| Report Sequence | 001 |
| Generated At | 2026-09-07 |
| Project | monomastic — AI-Powered One-Minute Website Builder (Next.js MVP) |
| Repository | C:\Users\ahmed\OneDrive\Desktop\website-version2 (branch `main`) |

---

# 1. Executive Summary

The MVP core (Epics 01–06) is **implemented and functional**: authenticated users answer business questions, pick a template and language(s), AI generates the site (Gemini), they edit it inline, and publish/unpublish it at a public `/live/[slug]` URL with English + Arabic as first-class locales. The post-MVP phase has also progressed substantially, but is mid-flight:

- **Epics 01–09: COMPLETE** (each with small caveats — see per-epic tables).
- **Epic 10 (Analytics): implemented but 100% uncommitted** — new/untracked files exist under `src/features/analytics/`, the `analytics` API route, `SiteAnalyticsPanel.tsx`, plus i18n and dashboard routes. Nothing has been committed.
- **Epic 11 (Monetization) and Epic 12 (Super Admin): NOT_STARTED** — planning documents exist under `epics/`, but zero implementation exists anywhere in `src/` (no `src/features/monetization/`, no `src/features/admin/`, no `super_admin` role, no plan/subscription/billing code).

**Critical project-hygiene finding:** `git log` shows only **2 commits** (`first commit`, `add proplem.md`). Essentially the entire implementation of Epics 01–10 lives in the **working tree as uncommitted or staged-pending changes**. A single destructive filesystem or reset event could destroy months of work. There are also **no tests anywhere** in the repository.

**Where development stopped:** at the boundary between Epic 10 (Analytics, finished-but-uncommitted) and Epic 11 (Monetization, not started). The most recent work artifact is the analytics feature (untracked files), and the most recently edited planning files belong to Epics 11/12 (task-file refinements in `git status`). No Monetization or Admin code has begun.

**Immediate next step:** (0) commit and verify all current work; (1) resolve the known Epic-08 image-accuracy decision; (2) begin **Epic 11 — Monetization, Milestone 01 (Plan & Subscription Model), Task 01 (Plan definition data)** per the existing roadmap.

**Blockers:** no hard engineering blocker prevents Epic 11 from starting, but the fully-uncommitted repository is the de-facto blocker to safe progress (risk of total loss). The Epic 08 M04/02 "business-accurate stock imagery" item is externally blocked (both keyword-photo sources are down) pending a human decision.

---

# 2. Project Progress Overview

| Area | Status | Summary |
|---|---|---|
| Epic 1 — Foundation | COMPLETE (2 need-review items) | Scaffold, Mongo health, i18n/routing, better-auth, app shell all exist; `<html lang/dir>` AC gap and landing-vs-signin behavior deviate. |
| Epic 2 — Site Creation Flow | COMPLETE | Site data model/repository, business-info form, 10-template catalog + listing, language choice, create APIs all implemented. |
| Epic 3 — AI Content Generation | COMPLETE (1 need-review item) | Gemini client, prompt builder, field validation/retry/fallback, generate + status endpoints, progress screen; job-lifecycle edge cases (stuck `running`) noted. |
| Epic 4 — Preview & Edit | COMPLETE (2 gaps) | Shared renderer, tap-to-edit autosave, brand color, S3 image slots, regeneration, template switch; full-site regen confirmation behavior contradicts a task AC. |
| Epic 5 — UI Design Language | PARTIAL | Tokens/components/auth/wizard/editor restyled to Monomastic; missing `WizardShell`, shared `Select`, Stepper on business-info, 2 preview-affordance deviations. |
| Epic 6 — Publishing | COMPLETE (1 need-review item) | Publish API + slug, live renderer (EN/AR), Publish control + drift indicator, unpublish API; e2e-verification task lacks a reproducible artifact. |
| Epic 7 — Editor Fidelity Fixes | COMPLETE | Solid bg, 3-mode preview, responsive mobile nav, live-status indicator all present. |
| Epic 8 — Multi-Page Templates | COMPLETE (1 partial) | Per-page model/snapshot/migration/generation/renderer/routing, editor page tabs; stock imagery is real but not business-accurate (documented). |
| Epic 9 — Template Discovery UX | COMPLETE | Dashboard gallery, editor picker redesign, upload popup + error surfacing; minor hardcoded English strings. |
| Epic 10 — Analytics | COMPLETE (uncommitted) | Pageview data model + atomic recording in live routes, owner analytics API + dashboard panel; all new files untracked, off-by-one window and unbounded read noted. |
| Epic 11 — Monetization | NOT_STARTED | No implementation; planning docs only. |
| Epic 12 — Super Admin Dashboard | NOT_STARTED | No implementation; planning docs only. |

---

# 3. Epic Status

## Epic 01 — Foundation: Scaffold, i18n, Auth & App Shell

**Status:** COMPLETE (with 2 NEEDS_REVIEW milestones)

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Project Scaffold & Data Layer | COMPLETE | ~100% | App runs, scripts (`dev/build/start/lint/typecheck`) present, Mongo singleton + `/api/health`, feature folders. |
| M02 i18n Foundation | NEEDS_REVIEW | ~90% | next-intl works and `/ar/*` is RTL, but `<html lang/dir>` is not set on the `<html>` element (hardcoded `en/ltr` in root layout); milestone AC unmet. |
| M03 Authentication | COMPLETE | ~100% | better-auth + API route, sign-in/sign-up pages with translated strings, protected-route redirect. |
| M04 App Shell & Switcher | NEEDS_REVIEW | ~90% | Navbar + EN⇄AR switcher + footer work; anonymous root shows a landing page (not redirect to sign-in per AC), footer is rich marketing footer (not the specified single line). |

---

## Epic 02 — Site Creation Flow: Business Info → Templates → Language

**Status:** COMPLETE

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Site Data Model & Draft APIs | COMPLETE | ~100% | Canonical `Site` types/repository, create/get APIs, ownership checks, unique `slug` index. |
| M02 Business Info Step | COMPLETE | ~100% | Grouped autosave form, searchable categories, validation (name+category required), save API. |
| M03 Template Library & Selection | COMPLETE | ~95% | 10 seeded templates + preview SVGs, ranked listing API, selection screen; hardcoded English error string in `TemplatePicker.tsx`. |
| M04 Language Choice | COMPLETE | ~95% | EN/AR/Both choice with location default; hardcoded English error string in `LanguageChoice.tsx`. |

---

## Epic 03 — AI Content Generation

**Status:** COMPLETE (1 NEEDS_REVIEW endpoint)

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Generation Engine | NEEDS_REVIEW | ~90% | Client, prompt builder, validation/retry/fallback, generate + status endpoints. Gen job lacks a top-level catch → server state can get stuck at `running`; `queued` state is unobservable (double-write). Deviation: `TIMEOUT_MS=180s` vs spec 45s; Gemini provider added beyond OpenAI-compatible requirement. |
| M02 Generation Progress Screen | COMPLETE | ~100% | "Writing your website…" screen with polling, retry, resume-guards; auto-advances to editor. |

---

## Epic 04 — Preview, Light Edit & Regeneration

**Status:** COMPLETE (2 documented gaps)

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Site Render | COMPLETE | ~100% | Shared `shared/site-render` renderer used by editor AND live site. |
| M02 Text Editing | COMPLETE | ~98% | Content autosave API (PATCH content) + tap-to-edit UI with `edited` protection flags. `SaveProvider.errors` never rendered (dead UI slot). |
| M03 Brand Color | COMPLETE | ~100% | Brand-color API + control. |
| M04 Image Handling | COMPLETE | ~100% | Presigned S3 upload + image-slot UX + low-res warning + category defaults. |
| M05 Regeneration | NEEDS_REVIEW | ~85% | Section + full-site regeneration exist and preserve edited fields, but **full-site regeneration keeps `edited:true` fields unchanged even after the confirm dialog** — contradicts task AC `02-full-site-regeneration.md` ("with `{confirm:true}` all fields including previously edited ones are regenerated"). |
| M06 Template Switching | COMPLETE | ~100% | Switch-template with shared-field preservation + generation of missing fields + confirm notice. |

---

## Epic 05 — UI Epic: The "Monomastic" Design Language

**Status:** PARTIAL

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Design Tokens Foundation | COMPLETE | ~95% | Tokens implemented in `src/app/globals.css` (Tailwind v4 CSS-first) rather than `tailwind.config.ts` (empty `theme.extend`); naming diverges (`mono-red`, `shadow-mono` vs spec `red`/`shadow-monomastic`). |
| M02 Shared Component Set | PARTIAL | ~85% | Button/Card/TapeTag/SectionHead/StickyNote/Stepper/Input/Label/Textarea exist; **no shared `Select.tsx`** (business category uses a custom searchable list). |
| M03 Auth Pages | COMPLETE | ~100% | Sign-in/sign-up restyled in Monomastic. |
| M04 Create Wizard | PARTIAL | ~80% | Four steps restyled; **no `WizardShell.tsx`**, **BusinessInfoForm lacks the Stepper** the milestone requires. |
| M05 Editor Chrome | PARTIAL | ~80% | Top bar/toggles redesigned; two preview-affordance styling deviations (brand-color control not using dashed border; review flag not rendered as tape badge). |

---

## Epic 06 — Publishing & Live Serving

**Status:** COMPLETE (1 NEEDS_REVIEW task)

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Publish API | COMPLETE | ~100% | `publishSite` + unique slug + owner-authorized `POST /api/sites/[siteId]/publish`. Snapshot shape is per-page (`SiteContent`, Epic 08) — Epic-06 planning doc contract is stale. |
| M02 Live Renderer | COMPLETE | ~98% | `/live/[slug]`, `/live/[slug]/[lang]` (en + ar, RTL) read-only via shared renderer; bare slug redirects to first active locale (not hard-coded `/en`); `dir/lang` applied on a wrapper `<div>`, not `<html>`. |
| M03 Publish UI | COMPLETE | ~100% | `PublishControl` (explicit, confirmed) + "unpublished changes" drift indicator + re-publish. |
| M04 Unpublish & Verify | NEEDS_REVIEW | ~80% | Unpublish API implemented; in-session drift tracking; **end-to-end verification task has no reproducible artifact in-repo** (only `../01-overview/02-final-compaction.md` claims it passed). |

---

## Epic 07 — Editor & Site-Fidelity Fixes

**Status:** COMPLETE

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Editor Visual Fidelity | COMPLETE | 100% | Solid opaque template background; desktop/tablet/390px-mobile preview with internal scroll. |
| M02 Reusable Responsive Navbar | COMPLETE | 100% | Hamburger + collapsible panel, shared by editor preview and live site (container-query based). |
| M03 Live Status Indicator | COMPLETE | 100% | Green/red live-state dot in editor header. |

---

## Epic 08 — True Multi-Page Templates + Real Images + Enhanced Design

**Status:** COMPLETE (1 PARTIAL task)

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Page Data Model | COMPLETE | 100% | `TemplatePage[]` on templates; `SiteContent = Record<pageId, PageContent>`; snapshot per-page. |
| M02 Content Migration & Routing | COMPLETE | 100% | Idempotent flat→Home migration; per-page generation; `/live/[slug]/[lang]/[pageSlug]` route. |
| M03 Renderer & Navigation | COMPLETE | 100% | Render-active-page with shared header/footer + active nav; 6 new section types (menu/gallery/faq/hours/pricing/team). |
| M04 Template Catalog v2 | PARTIAL | ~85% | Per-template page sets + design polish done; **real stock images are NOT business-accurate** (picsum.photos random subjects, e.g. restaurant may show a mountain) — self-documented in `docs/05-problems/01-template-images-not-business-accurate.md`. |
| M05 Editor Per-Page | COMPLETE | ~95% | `PageTabs`, per-page save/publish; regeneration is whole-site rather than current-page-only (task wording deviation). |

---

## Epic 09 — Template Discovery & Selection UX

**Status:** COMPLETE

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Dashboard Template Gallery | COMPLETE | 100% | `/dashboard/templates` gallery with SVG previews + metadata, bilingual. |
| M02 Editor Template Picker Redesign | COMPLETE | ~95% | Monomastic picker with thumbnails + confirm + generation progress; hardcoded English error string in `ChangeTemplateControl.tsx`. |
| M03 Image-Upload Popup Redesign | COMPLETE | 100% | Staged file preview, upload phases, position picker, full error-surface mapping (incl. S3/bucket failures). |

---

## Epic 10 — Basic In-House Analytics

**Status:** COMPLETE — but **0% committed** (all new files untracked, dozens of tracked files modified and uncommitted)

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Pageview Recording | COMPLETE | ~95% | `PageviewDay` model + atomic upsert (`$inc`), unique composite index, server-side recording in both live routes with bot-filter; off-by-one 31-day vs 30-day window in the read layer. |
| M02 Analytics Dashboard | COMPLETE | ~95% | Owner-scoped read helper + API route; dashboard panel (totals, per-page, 30-day trend, empty state). Unbounded history read (filters in JS, ignores from/to). None of it is committed. |

---

## Epic 11 — Monetization: Plans, Subscriptions & Billing Structure

**Status:** NOT_STARTED

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Plan & Subscription Model | NOT_STARTED | 0% | Evidence not found. No `src/features/monetization/`, no `PlanDefinition`/`Subscription`/`accountStatus` anywhere in `src/`. |
| M02 Monetization Guard Layer | NOT_STARTED | 0% | No `checkLimit` engine, no entitlement route helper, no paywall error shape. |
| M03 Gate Application | NOT_STARTED | 0% | No gates wired into create/publish/languages/template/AI/image routes; no plan affordance UI; no `plan.*`/`paywall.*` i18n keys. |
| M04 Billing Ledger & Manual Records | NOT_STARTED | 0% | No invoice/ledger model, no admin billing APIs. |

---

## Epic 12 — Super Admin Dashboard

**Status:** NOT_STARTED

### Milestones

| Milestone | Status | Progress | Notes |
|---|---|---|---|
| M01 Admin Foundation | NOT_STARTED | 0% | No `role:"super_admin"` on the user model (`shared/auth/server.ts` has no role), no admin guard, no `/admin/**` routes (`src/app` has only `dashboard/`, `create/`, `auth/`, `sites/`, `live/`). |
| M02 User & Account Management | NOT_STARTED | 0% | No user listing/search/detail, no freeze/suspend/reactivate, no admin audit log. |
| M03 Billing & Plans Admin | NOT_STARTED | 0% | No subscription editor, manual-payment form, or revenue view (depends on Epic 11). |

---

# 4. Milestone Details

## Milestone 10.2 — Analytics Dashboard (current milestone)

**Status:** COMPLETE (uncommitted)

### Tasks

| Task | Status | Evidence | Notes |
|---|---|---|---|
| T01 Analytics read route/query | COMPLETE | `src/features/analytics/api/get-site-analytics.ts`, `src/app/api/sites/[siteId]/analytics/route.ts` | Owner-scoped (401/404); aggregation lives in the API file not `repository.ts` (cosmetic); unbounded read (F5). |
| T02 Analytics dashboard view | COMPLETE | `src/app/[locale]/dashboard/page.tsx:56-75`, `src/features/dashboard/components/SiteAnalyticsPanel.tsx` | 3 stat cards + per-page + trend, bilingual, RTL-safe; off-by-one window between `last30Days` and `trend` (F1). All files untracked/uncommitted. |

## Milestone 11.1 — Plan & Subscription Model (next milestone)

**Status:** NOT_STARTED

### Tasks

| Task | Status | Evidence | Notes |
|---|---|---|---|
| T01 Plan definition data | NOT_STARTED | Evidence not found | No `PlanDefinition`/plan constants in `src/`. |
| T02 Subscription record & migration | NOT_STARTED | Evidence not found | No `Subscription` model, no user plan wiring, no Free-plan backfill. |

---

# 5. Completed Work

Grouped by epic (evidence-backed; all lint/typecheck/build green per agent verification — `next build` success attested for routes/APIs):

- **Epic 01:** runnable Next.js 15 App Router app (`package.json`); Mongo singleton + `/api/health` (`src/shared/db/client.ts`, `src/app/api/health/route.ts`); next-intl EN/AR routing + RTL (`next.config.ts`, `src/i18n/request.ts`, `src/shared/i18n/config.ts`, `src/middleware.ts`); better-auth email/password + session helpers (`src/shared/auth/server.ts`, `src/features/auth/lib/session.ts`, `src/app/api/auth/[...all]/route.ts`); sign-in/sign-up pages; navbar + language switcher + footer.
- **Epic 02:** `Site` model + repository (`src/features/sites/types.ts`, `repository.ts`, `indexes.ts`); create/get site APIs; business-info form + autosave (`src/features/create-wizard/components/BusinessInfoForm.tsx`, `lib/useAutosaveForm.ts`); 10-template catalog + preview SVGs + ranked listing (`src/features/templates/catalog.ts`, `public/templates/*/preview.svg`, `src/app/api/templates/**`); template + language selection screens and APIs.
- **Epic 03:** AI client (Gemini + OpenAI-compatible), prompt builder, field validation/retry/fallback, placeholders (`src/features/generation/lib/*`); generate + generation-status endpoints; progress screen with polling.
- **Epic 04:** shared renderer (`src/shared/site-render/SiteRenderer.tsx` + 14+ section components); editor page (`src/app/[locale]/sites/[siteId]/editor/page.tsx`) with inline text edit/autosave, brand color, S3 image slots (presigned), section/site regeneration + impact check, template switch; editor chrome (`EditorShell`, `LanguageTabs`, `DeviceToggle`, `PageTabs`).
- **Epic 05:** Monomastic tokens, `shared/ui` primitives, restyled auth/wizard/editor surfaces, `src/messages/` fully bilingual (276 keys each).
- **Epic 06:** Publish + unpublish APIs, unique slug + retry, live renderer `/live/[slug]` + locale variants, `PublishControl` + unpublished-changes indicator, `LiveLocaleSwitcher`, `getSiteBySlug`.
- **Epic 07:** solid bg, 3-mode preview, responsive mobile nav, live-status indicator.
- **Epic 08:** per-page content/snapshots, flat-content migration, per-page generation, `/live/[slug]/[lang]/[pageSlug]`, 6 new section types, per-template page sets, editor page tabs.
- **Epic 09:** dashboard gallery + SVG previews, redesigned picker with confirm flow, image-upload popup with staged preview + full error mapping.
- **Epic 10:** analytics data model + atomic recording, owner analytics API, dashboard analytics panel. **(uncommitted)**

---

# 6. Partial / Incomplete Work

| Area | What exists | What is missing | What is required to complete |
|---|---|---|---|
| Epic 05 M04 Create Wizard | Four step pages restyled | `WizardShell.tsx` and the Stepper on `BusinessInfoForm` | Add the shared wizard shell + stepper, wire steps into it |
| Epic 05 M02 Shared Components | All listed primitives except | Shared `Select.tsx` (category uses custom list) | Add/align a shared Select primitive per milestone |
| Epic 05 M05 Editor Chrome | Top bar + toggles restyled | Brand-color dashed border; review-flag tape badge | Apply the two pending styling details |
| Epic 08 M04 T02 Real stock images | 37 real photos self-hosted at `public/templates/real/<category>/` | Subject not matched to business category | Replace with business-accurate photos (human-provided or after keyword source recovers) |
| Epic 04 M05 Full-site regeneration | Endpoints + confirm flow implemented | After `{confirm:true}`, edited fields are still preserved — the documented AC says they must be regenerated | Decide intended semantics vs AC; align `run-site-regeneration.ts`/`mergePageContent` |
| Epic 10 analytics precision | Feature implemented | 31-day vs 30-day window (off-by-one); unbounded history read | Tighten window/date-bound the query; commit the feature |
| Epic 11/12 | Planning docs only | All implementation | Begin Epic 11 M01 |

---

# 7. Not Started Work

- **Epic 11 (Monetization)** — all 4 milestones: plan/subscription model, guard engine, gate application, billing ledger + admin APIs.
- **Epic 12 (Super Admin Dashboard)** — all 3 milestones: admin role/guard/shell, user & account management, billing admin.
- **Epic 06 M04 T02 (end-to-end verification artifact)** — no reproducible smoke-test exists in-repo.
- **Site settings page** — `src/app/[locale]/sites/[siteId]/settings/page.tsx` is a canonical path declared in `epics/01-foundation/01-project-scaffold/MILESTONE.md` but has never been created (language-config change / site settings are only reachable via create flow).

---

# 8. Current Development Position

## Where We Are

**Current Epic:** 10 — Basic In-House Analytics

**Current Milestone:** 10.2 — Analytics Dashboard

**Current Task:** 10.2.T02 — Analytics dashboard view

**Status:** IN_PROGRESS → effectively finished but awaiting commit / final QA.

### Why this is the stopping point

1. **Most recent implementation is analytics.** Untracked in `git status`: `src/features/analytics/` (types, repository, get-site-analytics), `src/app/api/sites/[siteId]/analytics/`, `src/features/dashboard/components/SiteAnalyticsPanel.tsx`. Modified-but-uncommitted: `dashboard/page.tsx`, both live routes, `indexes.ts`, `messages/en.json`/`ar.json` — all consistent with the Analytics epic being the last work done.
2. **Epics 11/12 are the next planned scope and are untouched.** Zero `src/` matches for `monetization`, `super_admin`, `PlanDefinition`, `accountStatus`, `withEntitlement`, `checkLimit`, `BillingRecord`. The only recent edits in those folders are to planning `*.md` files — i.e. the plan is being prepared but implementation has not started.
3. **No commit exists for Epics 07–10.** With only 2 commits in `git log`, the entire 01–10 implementation is uncommitted working-tree content. Development clearly continued far past the last commit.

**Stopping point in short:** the project has completed the Analytics epic's implementation and is positioned to open Epic 11 (Monetization), but has not committed anything since the earliest scaffold.

Confidence: **HIGH** (based on untracked/modified file evidence + commit history + zero-implementation greps for Epics 11/12).

---

# 9. Next Development Step

## Recommended Next Task

**Epic:** 11 — Monetization: Plans, Subscriptions & Billing Structure

**Milestone:** 11.1 — Plan & Subscription Model

**Task:** 11.1.T01 — Plan definition data

### Why This Is Next

- The execution order defined by `epics/` is numeric: 01 → 12. Epics 01–10 are implemented (10 needs committing/QA); Epic 11 is the first remaining epic with no code.
- Epic 12 explicitly *depends on* Epic 11 (`12-super-admin-dashboard/EPIC.md`), so 11 must land first — and 11.1 is the design/data-model root (plans define the limits every later gate enforces). Nothing in Epics 09/10 depends on 11, so nothing blocks starting it.

### Required Work

1. **Step 0 — Protect existing work (blocking risk):** commit the current working tree in coherent, logical commits (scaffold → creation flow → generation → editor → UI → publishing → fidelity → multi-page → template UX → analytics), ensuring no secrets are committed (check `.env` remains ignored). Then run the safe build (`npm run lint && npx tsc --noEmit`, then stop dev → clear `.next` → `npm run build` → restart) per `../01-overview/02-final-compaction.md`.
2. **Step 1 — Decision:** resolve the Epic 08 image-accuracy item (keep current photos vs human-provided business-accurate photos) — `docs/05-problems/01-template-images-not-business-accurate.md`.
3. **Step 2 — Begin Epic 11.1.T01:** define `PlanDefinition` (Free default; limits as data: site count, pages/site, languages, custom domain, image size, AI generations/day, published sites), `Subscription` record (status: trialing/active/past_due/canceled/ended; billing period; pricing), `accountStatus` on the user model, and the Free-plan migration/backfill — per `epics/11-monetization/01-plan-and-subscription-model/01-plan-definition-data.md`.

### Dependencies

- Epics 01–06 and 08 must remain green (they are the surfaces the gates will wrap).
- `user` model changes (role/accountStatus) require a coordinated update in `shared/auth/server.ts`/`session.ts`.
- No new npm dependencies are permitted without human approval (CODE_RULES §4).

### Blockers to the next step

- None *technical* blocks Epic 11. The uncommitted repository state is the primary hazard to resolve before starting new work (recommended Step 0).

---

# 10. Blockers

| Blocker | Severity | Impact | Required Action |
|---|---|---|---|
| Essentially the entire implementation (Epics 01–10) is uncommitted (`git log` = 2 commits; massive working-tree diff) | HIGH | Single reset/disk failure loses ~10 epics of work; no recovery trail | Commit in logical units now; verify `.env` is not tracked |
| Epic 08 business-accurate stock imagery pending | MEDIUM | Epic 08 M04/T02 can't be declared fully complete; restaurant may show unrelated imagery | Human decision: keep as-is or supply business-accurate photos (keyword sources `source.unsplash.com`/`loremflickr.com` are down) |

> No significant new-code blockers were identified for starting Epic 11.

---

# 11. Risks

| Risk | Likelihood | Impact | Notes |
|---|---|---|---|
| Full AI generation end-to-end untested in this audit / production-deployed | Medium | High | COMPACTION1 notes Gemini free-tier latency ~95s single locale, quota throttle possible; `TIMEOUT_MS=180s`. |
| Generation job can become stuck at `running` (no top-level catch in `run-generation.ts`) | Medium | Medium | Server state poisoned until manual fix; UI recovers via 90s-stuck timeout. |
| No automated tests anywhere in the repo | High (future regressions) | High | No `*.test.*`, no `tests/`. Any refactor (e.g. Epic 11 gates) risks silent breakage. |
| `.next` shared between dev and build process | Medium | Medium | Operational footgun documented in COMPACTION1; must follow safe-build procedure exactly. |
| `zod` used widely but not declared in `package.json` (transitive via better-auth) | Medium | Medium | A dependency update could remove it and break builds; violates CODE_RULES §4 bookkeeping. |
| `NEXT_PUBLIC_SITES_DOMAIN` semantics (main-app `/live` URL vs subdomain product) unresolved decision | Low | Low | Flagged in Epic 06; current behavior falls back to request origin. |
| Analytics feature uncommitted (plus off-by-one window / unbounded read) | Near-certain until committed | Medium | Work may be lost; numbers may be inconsistent across the 30-day stat vs trend. |

---

# 12. Documentation vs Implementation Differences

1. **`<html lang/dir>` not set (i18n AC).** `epics/01-foundation/02-i18n-foundation/01-next-intl-en-ar-rtl.md` and the scaffold milestone require the rendered `<html>` to carry `lang`/`dir`; `src/app/layout.tsx:10` hardcodes `<html lang="en" dir="ltr">` and `[locale]/layout.tsx` applies locale attrs to an inner `<div>`. `../01-overview/01-product-requirements.md §13.6` (RTL across the site experience) is therefore only partially met at the document level.
2. **Root route behavior.** Epic 01 M04 specifies anonymous `/en` → redirect `/auth/sign-in`; implementation serves a marketing Landing page (`src/features/landing/components/Landing.tsx`, wired in `src/app/[locale]/page.tsx`). Likely intended (product landed on marketing), but the task AC was never updated.
3. **Epic 06 publish snapshot contract is stale.** `epics/06-publishing/01-publish-api/MILESTONE.md` declares `content: Record<Locale, Record<string, ContentField>>`; `publish-site.ts` writes per-page `SiteContent` (Epic 08 model). Code and types are internally consistent; the Epic-06 doc is not the operative shape.
4. **Full-site regeneration behavior contradicts its AC.** `02-full-site-regeneration.md` AC line 74: on `{confirm:true}` all fields (incl. previously edited) are regenerated. `run-site-regeneration.ts` → `mergePageContent` (merge-content.ts:89–96) preserves `edited:true` fields, so explicit consent never rewrites manual edits.
5. **`../02-design/01-landing-design-spec.md` describes the legacy "loom" dark AI/tech landing** (source of truth `design-scratch/landing-variants/1-orange-red.html`); the implemented product landing + design language is the **variant-14 Monomastic notebook** design (`design/landingPage/variant-14/index.html`, `src/features/landing/components/*`, Epic 05). The spec file has not been updated/superseded. (Duplication too: `../02-design/01-landing-design-spec.md` vs `doc/DESIGN.md`.)
6. **Canonical settings page missing.** Scaffold MILESTONE declares `sites/[siteId]/settings/page.tsx` as one of "the only page paths the product will ever use"; it does not exist. PRD §13.1 ("language…can be changed later from site settings") is unreachable anywhere in the UI.
7. **CODE_RULES §6 "no hardcoded user-facing strings" violations in implementation:** hardcoded English strings in `src/features/create-wizard/components/TemplatePicker.tsx:43`, `LanguageChoice.tsx:49`, `src/features/editor/components/ChangeTemplateControl.tsx` (×3). Planning docs mandate all strings via next-intl.
8. **Epic 05 token location.** Milestone tasks put tokens in `tailwind.config.ts` theme; implementation is in `src/app/globals.css` (Tailwind v4 CSS-first — a legitimate v4 convention, but the doc/names diverge: `mono-red` vs `red`, `shadow-mono` vs `shadow-monomastic`).
9. **`../01-overview/02-final-compaction.md` "MVP complete + verified e2e" claim** is not independently reproducible: the verification artifact (smoke test/lifecycle script) is not in the repo; only the doc's claim itself.

---

# 13. Technical Debt

- **No tests** (unit, integration, or e2e) anywhere in the repository.
- **Repository hygiene:** only 2 commits; ~all of Epics 01–10 uncommitted; mixed modified/untracked state; `dev-server.log`, `dev-err.log`, `dev-out.log`, `signin.txt`, `tsconfig.tsbuildinfo` present in the working tree (unignored clutter).
- **Generation job lifecycle:** no top-level try/catch in `run-generation.ts` (`start-generation.ts:49-51` only catches/logs), so an early throw leaves `generation.status="running"`; `queued` → `running` double-write makes `queued` unobservable to clients.
- **Hardcoded English user-facing strings** in 3 components (see §12.7) — an explicit CODE_RULES §6 violation a user of the Arabic UI will hit on error paths.
- **`zod` used but undeclared** in `package.json` (transitive from better-auth) — fragile dependency bookkeeping.
- **Analytics query design:** `getSiteAnalytics` loads all history then filters in JS (ignores from/to); 31-day vs 30-day window inconsistency between stat card and trend.
- **Dead code/endpoints:** `GET /api/sites/[siteId]/analytics` exists but no client fetches it (dashboard is server-rendered); `src/messages` still unused? No — messages are used; unused asset `public/templates/real/restaurant/menu.webp` (no menu image slot).
- **Unused UI error path:** `SaveProvider.errors` is never rendered (`editor.edit.save_error` key unused).
- **Reported DB concerns** (`../06-notes/01-code-quality-notes.md`): fatal connection errors not handled gracefully; potential race when multiple requests hit an uninitialized Django.../Mongo singleton. Current implementation uses `globalThis` caching, but fail-on-missing-DB behavior on the app pages is not verified.
- **Stale docs:** `../02-design/01-landing-design-spec.md` (legacy loom spec), Epic 06 milestone contract (pre-Epic-08 shape), `../06-notes/04-model-openrouter-scratch.md` (OpenRouter scratch notes), `../06-notes/02-need-to-learn.md`/`NEEDTOCHANGE.md` (scraps instead of architecture docs).

---

# 14. Quality & Engineering Assessment

### Architecture
Feature-based organization per CODE_RULES §2 is honored: thin `src/app/api/**` handlers delegate to `src/features/<feature>/`; a single shared renderer (`shared/site-render`) serves both editor and live; a single shared Mongo client + repository-per-feature pattern. The multi-page (Epic 08) refactor was applied cleanly on top of the original model with a migration shim. Genuine concerns: no job queue (in-process detached promises are fragile under serverless/scale), and the analytics read path ignores its date bounds.

### Code Organization
Follows the canonical layout closely. `shared/ui` has grown beyond the baseline five primitives but that is a documented superset. Some cross-namespace i18n key use (e.g. `ChangeTemplateControl` using `wizard.templates.title`) is harmless but inconsistent.

### Error Handling
Owner-route error mapping (401/404/409/422 → codes) is consistent and good. The weak spot is the generation/regeneration job boundary (uncaught top-level errors, one-way `running` state), plus surface-only error surfacing for save failures.

### Testing
**None.** Not a single test file exists. Owners ship features on manual acceptance alone.

### Security
Good baseline: owner-scoped reads/writes everywhere (`getSiteForOwner`), publish/unpublish owned-only, public live route serves only `publishedSnapshot` of `status==="published"` sites, better-auth sessions, env-based secrets not logged (`ai-client.ts` scrubs keys). No role/RBAC yet (mandated only by Epic 12). `.env` untracked (verify it is gitignored — `.gitignore` present).

### Performance
Acceptable for an MVP single instance: polling status endpoint, atomic `$inc` pageview recording, presigned S3 uploads. Concerns: unbounded analytics aggregation; full generation runs serially per page/locale (expected 95s+ single-locale with Gemini).

### Maintainability
Good structure and consistent naming; documentation is the weak link (stale/duplicated specs, no ADRs, no tests as executable spec). The uncommitted working tree makes everything fragile today.

---

# 15. Recommended Development Order

1. **Commit the entire current implementation** (Epics 01–10) in logical commits; double-check `.env` is not tracked.
2. **Resolve the Epic 08 stock-image decision** (keep vs human-supplied business-accurate photos).
3. **Fix the small, cheap gaps before new epic work:** generation stuck-`running` guard; hardcoded English strings; `<html lang/dir>` for `/ar` and live pages; analytics window/read fix.
4. **Begin Epic 11, M01** (Plan & Subscription Model): task 01 plan data → task 02 subscription + Free backfill.
5. **Epic 11, M02** (guard layer: `checkLimit` engine + entitlement helpers + paywall error shape).
6. **Epic 11, M03** (gate create/publish/languages/template/AI/image; Free defaults; plan affordance UI).
7. **Epic 11, M04** (billing ledger + admin APIs).
8. **Epic 12** (admin role/guard/shell → user & account management → billing admin). Epics 12 consumes 11.M04.
9. Add at least a smoke/integration test layer for the core journeys (business-info → generate → edit → publish) to de-risk the remaining epics.

---

# 16. Audit Conclusion

- **What has been completed?** MVP core (Epics 01–06), Editor Fidelity (Epic 07), Multi-page templates (Epic 08), Template UX (Epic 09) — functionally implemented; lint/typecheck/build pass. Analytics (Epic 10) is implemented but **uncommitted**.
- **What remains?** Epic 11 (Monetization) and Epic 12 (Super Admin) — entirely unimplemented; plus the known gaps in §6 (§5 partials: wizard shell/Stepper, Select, editor-chrome details, business-accurate imagery, full-regen confirm semantics, analytics precision) and the missing site-settings page.
- **Where did development stop?** At the completion of the Analytics epic's implementation, before committing, and before starting Epic 11. Confidence: HIGH.
- **What is currently in progress?** Effectively nothing new is being authored; the visible activity is planning-file refinement for Epics 11/12 and the uncommitted analytics work.
- **What is the next task?** Commit+verify current state, then start Epic 11 M01 task 01 (Plan definition data).
- **Are there blockers?** No technical blocker to Epic 11; however the fully-uncommitted repository is a serious safety blocker, and the stock-imagery item awaits a human decision.
- **Is the project aligned with its original plan?** Yes on roadmap order and architecture; deviations are documented (landing-on-root, per-page data model merged into Epic 06 scope, Tailwind v4 CSS tokens, full-regen field semantics). The biggest misalignment is **process**, not product: the plan says each task ends with commit-verified, tested work (DoD), yet the repository has 2 commits and zero tests — the "verified" claims in `../01-overview/02-final-compaction.md` are summaries the repo cannot substantiate.

---

# 17. Evidence Index

- Planning/roadmap: `epics/01-foundation/EPIC.md` … `epics/12-super-admin-dashboard/EPIC.md`, all `epics/<epic>/**/MILESTONE.md` and task `*.md` files
- Product/spec: `../01-overview/01-product-requirements.md`, `CODE_RULES.md`, `AGENTS.md`, `../01-overview/02-final-compaction.md`, `../02-design/01-landing-design-spec.md`, `../06-notes/04-model-openrouter-scratch.md`, `../06-notes/01-code-quality-notes.md`, `docs/05-problems/01-template-images-not-business-accurate.md`
- Scaffold/config: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.env.example`, `.eslintrc.json`, `src/middleware.ts`
- Auth/db/shared: `src/shared/auth/{server,client}.ts`, `src/features/auth/lib/session.ts`, `src/shared/db/{client,database,indexes}.ts`, `src/shared/i18n/config.ts`, `src/i18n/request.ts`, `src/app/api/health/route.ts`
- Sites & creation: `src/features/sites/{types,schemas,repository}.ts`, `src/features/sites/api/**`, `src/features/sites/lib/*`, `src/features/create-wizard/**`, `src/features/templates/**`, `src/app/api/sites/**`, `src/app/api/templates/**`
- Generation: `src/features/generation/**`, `src/features/regeneration/**`, `src/app/api/sites/[siteId]/{generate,generation-status,regenerate,regenerate-section,regenerate-impact}/route.ts`
- Editor/renderer/UI: `src/shared/site-render/**`, `src/features/editor/**`, `src/features/publishing/components/{PublishControl,LiveLocaleSwitcher,LiveSitePage}.tsx`, `src/shared/ui/**`, `src/app/[locale]/sites/[siteId]/editor/page.tsx`
- Publishing/live: `src/features/publishing/*.ts`, `src/app/layout.tsx`, `src/app/live/**`, `src/app/api/sites/[siteId]/{publish,unpublish}/route.ts`
- Enriched/epics 07-10: `src/features/dashboard/**`, `src/features/analytics/**`, `src/app/api/sites/[siteId]/analytics/route.ts`, `src/shared/db/indexes.ts` (pageviews), `public/templates/real/**`, `src/app/[locale]/dashboard/{page,templates/page}.tsx`
- Messages: `src/messages/en.json`, `src/messages/ar.json` (276 keys each)
- Tests: **none found** (`**/*.test.*`, `**/tests/**` → no matches)
- Git: `git log --oneline` (2 commits), `git status` (working-tree diff covering Epics 01–10 + untracked analytics)

---

# 18. Progress Percentage

> The following estimates are based on milestone/task completion as audited and should be treated as approximate, not precise engineering metrics.

| Epic | Approx. progress |
|---|---|
| 01 Foundation | ~95% |
| 02 Site Creation | ~98% |
| 03 AI Generation | ~90% |
| 04 Preview & Edit | ~92% |
| 05 UI Design Language | ~80% |
| 06 Publishing | ~92% |
| 07 Editor Fidelity | 100% |
| 08 Multi-Page Templates | ~92% |
| 09 Template Discovery UX | ~95% |
| 10 Analytics | ~95% implemented / **0% committed** |
| 11 Monetization | 0% |
| 12 Super Admin | 0% |

**Overall planned-epic progress: ~80–85% implemented by milestones; 0% of it (beyond a 2-commit scaffold) safely committed.**

**Confidence levels:** Epic/milestone statuses HIGH (direct file evidence; multiple parallel audits). "COMPLETE = works" ratings MEDIUM for features that rely on live external providers (Mongo/S3/Gemini), since this audit ran static checks (lint/typecheck/build) and did not re-run the full e2e publish lifecycle. The claimed M04 e2e verification in `../01-overview/02-final-compaction.md` could not be reproduced from in-repo artifacts (LOW confidence it is currently verifiable).