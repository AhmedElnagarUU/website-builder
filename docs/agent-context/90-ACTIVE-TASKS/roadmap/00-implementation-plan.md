# HERMES — IMPLEMENTATION PLAN (Mission 02 Deliverable)

## 1. Planning Strategy

**Structure:** Execution Waves → Epics → Tasks

**Chosen:** Waves → Epics → Tasks (not Phases → Epics → Tasks, and not simple Epics → Tasks)

**Why:** The project has distinct *categories* of work (MVP stabilization, production hardening, future epics) that naturally fall into sequential waves. Within each wave, epics group related concerns. Tasks are the atomic units OpenCode executes. This is the simplest structure that gives enough control without unnecessary complexity.

The existing `epics/NUMBER-name/` convention (with `EPIC.md` + `MM-milestone/` + `KK-task.md`) is preserved and extended with **two new top-level epics** for the current gap work:

- `epics/17-mvp-stabilization/` — Fix MVP blockers
- `epics/18-production-hardening/` — Production readiness work

Existing epics 01–16 are already implemented (committed and green on lint/typecheck).

---

## 2. Executive Summary

### What's Already Done
- **Epics 01–10 (MVP core):** Fully implemented and committed. Lint + typecheck pass.
- **Epic 11 (Monetization):** Fully implemented and committed. Plans, guard engine, entitlements, paywall, billing ledger all exist.
- **Epic 12 (Super Admin):** Planning docs exist; code was **removed** in the Epic 15 cleanup (`git log` shows admin pages/APIs deleted in `78b35c4`). Zero admin code in `src/`.
- **Epic 13 (Template Preview):** Planning docs exist; partially implemented (preview routes exist in `src/app/[locale]/sites/[siteId]/preview/`).
- **Epic 14 (Template Modern Redesign):** Implemented — new design system, per-template themes, richer sections (services, about, testimonials, menu, hours, pricing, team, FAQ). All 11 templates have `rtlValidated: true` and `svcCount` 2–4.
- **Epic 15 (Notes Fixes):** Implemented — navbar mobile, pricing/privacy/terms pages, upgrade link, locale labels (LiveLocaleSwitcher already uses codes), super-admin removal.
- **Epic 16 (Notes Round 2):** Mostly resolved — navbar mobile done, S3 diagnosis doc (`docs/05-problems/02-s3-image-upload-broken.md`) thorough, template richness resolved via Epic 14, editor live link implemented. Footer hardcoded `href="#"` strings fixed (privacy/terms pages now exist at real routes).

### What Needs To Be Done
1. **MVP Blockers** (Phase 0 / Wave 1): Fix S3 config, full-site regeneration semantics, hardcoded strings, missing site settings page, `<html lang/dir>`, save-error UI
2. **Production Hardening** (Wave 2): Add tests, fix generation job lifecycle, DB connection race, declare zod dependency
3. **Future Epics** (Wave 3+): Epic 12 (Super Admin), Epic 13 (Template Preview completion)

---

## 3. MVP Target Definition

**MVP Complete** = A user can:
1. Sign up / sign in
2. Enter business info (name + category required)
3. Select a template (8–12 templates, category-matched)
4. Choose language (EN/AR/Both with RTL)
5. Generate website via AI (Gemini)
6. Preview & edit inline (text, images, brand color)
7. Switch templates (content preserved)
8. Regenerate sections (isolated)
9. Publish to `/live/[slug]` (EN + AR)
10. View published site in browser
11. Manage sites from dashboard

**Plus all MVP acceptance criteria pass** (from PRD Section 19).

---

## 4. Production Target Definition

**Production Ready** = The system can be safely deployed and operated:
- All critical security boundaries verified (owner-scoped access, no hardcoded secrets)
- No single points of failure (generation job timeouts, DB connection errors handled)
- Observable (logs, health checks, error tracking)
- Deployable (Docker, CI/CD, environment config documented)
- Reliable (tests covering core flows, rollback capability)
- Operable (monitoring, alerting, backup/restore procedures)

---

## 5. Epic Overview

| ID | Epic | Category | Goal | Priority | Dependencies | Status |
|----|------|----------|------|----------|-------------|--------|
| E17-W1 | MVP Stabilization | Bug Fix | Fix all MVP blockers | P0 | None | PLANNED |
| E18-W2 | Production Hardening | Hardening | Production readiness | P0 | E17-W1 | PLANNED |
| E19-W3 | Testing Infrastructure | Testing | Add test coverage | P1 | E17-W1 | PLANNED |
| E12-W3 | Super Admin Dashboard | Feature | Admin management UI | P2 | E18-W2, E11 | PLANNED |
| E13-W3 | Template Preview Completion | Feature | Complete preview surface | P2 | E14 | PLANNED |

---

## 6. Execution Waves

### WAVE 0 — Pre-Flight (Completed)
- ✅ Project discovery and codebase analysis (Mission 01)
- ✅ `.env` file signed with all required variables
- ✅ Dependencies installed (removed Windows-only `@next/swc-win32-x64-msvc`)
- ✅ MongoDB started and running
- ✅ Dev server running, `/api/health` returns `ok`
- ✅ Lint + typecheck pass

### WAVE 1 — MVP Stabilization (MVP Blockers)

**Epic E17-W1: MVP Stabilization**

| ID | Task | Priority | Classification |
|----|------|----------|----------------|
| E17-T01 | Fix S3 configuration (region mismatch + missing S3_PUBLIC_BASE_URL) | P0 | BUG FIX + INFRA |
| E17-T02 | Fix full-site regeneration confirm semantics | P0 | BUG FIX |
| E17-T03 | Convert hardcoded English strings to next-intl keys | P0 | BUG FIX |
| E17-T04 | Create site settings page | P0 | FEATURE |
| E17-T05 | Fix `<html lang/dir>` to apply locale attributes | P0 | BUG FIX |
| E17-T06 | Wire save-error UI (`SaveProvider.errors` consumption) | P1 | BUG FIX |

### WAVE 2 — Production Hardening

**Epic E18-W2: Production Hardening**

| ID | Task | Priority | Classification |
|----|------|----------|----------------|
| E18-T01 | Add generation job lifecycle try/catch + status recovery | P0 | HARDENING |
| E18-T02 | Fix DB connection race condition | P0 | HARDENING |
| E18-T03 | Declare `zod` in package.json | P1 | INFRASTRUCTURE |
| E18-T04 | Fix analytics unbounded read (filter in MongoDB aggregation) | P2 | PERFORMANCE |
| E18-T05 | Add Dockerfile + deployment scripts | P2 | INFRASTRUCTURE |
| E18-T06 | Add structured logging (error boundaries, API errors) | P2 | OBSERVABILITY |

### WAVE 3 — Testing & Future Epics

**Epic E19-W3: Testing Infrastructure**

| ID | Task | Priority | Classification |
|----|------|----------|----------------|
| E19-T01 | Add smoke tests for core user flows | P1 | TESTING |
| E19-T02 | Add API integration tests (owner-scoped routes) | P1 | TESTING |
| E19-T03 | Add generation job lifecycle tests | P2 | TESTING |

**Epic E12-W3: Super Admin Dashboard**

| ID | Task | Priority | Classification |
|----|------|----------|----------------|
| E12-T01 | Define admin role model + guard | P2 | FEATURE |
| E12-T02 | Implement user listing/search | P2 | FEATURE |
| E12-T03 | Implement freeze/suspend/reactivate | P2 | FEATURE |
| E12-T04 | Implement manual subscription editor | P2 | FEATURE |
| E12-T05 | Implement manual payment + revenue view | P2 | FEATURE |

**Epic E13-W3: Template Preview Completion**

| ID | Task | Priority | Classification |
|----|------|----------|----------------|
| E13-T01 | Complete preview route implementation | P2 | FEATURE |

---

## 7. Dependency Graph

```
                    ┌─────────────────────────────────┐
                    │  E17-W1: MVP Stabilization      │
                    │  (S3 fix, regen, i18n, settings)│
                    └──────────────┬──────────────────┘
                                   │
                    ┌─────────────▼──────────────┐
                    │  E18-W2: Production         │
                    │  Hardening                 │
                    └─────────────┬──────────────┘
                                   │
                    ┌─────────────▼──────────────┐
                    │  E19-W3: Testing           │
                    │  Infrastructure            │
                    └─────────────┬──────────────┘
                                   │
                    ┌─────────────┼──────────────┐
                    │             │              │
         ┌──────────▼───┐  ┌──────▼──────────┐  ┌─▼──────────────┐
         │ E12 Super    │  │ E13 Template    │  │ Future work    │
         │  Admin       │  │  Preview        │  │ (post-MVP)     │
         └──────────────┘  └─────────────────┘  └────────────────┘
```

---

## 8. Parallel Work

### Safe Parallelism in Wave 1 (E17-W1)
- E17-T01 (S3 config) and E17-T03 (hardcoded strings) are independent — can be done in parallel.
- E17-T04 (settings page) and E17-T05 (`<html lang/dir>`) are independent — can be done in parallel.
- E17-T02 (regeneration) and E17-T06 (save-error UI) are independent — can be done in parallel.

### Safe Parallelism in Wave 2 (E18-W2)
- E18-T02 (DB race fix) and E18-T04 (analytics query) are independent.
- E18-T03 (zod declaration) and E18-T05 (Dockerfile) are independent.
- E18-T01 (generation job fix) and E18-T06 (logging) are independent.

### Unsafe Parallelism (AVOID)
- Do NOT modify `merge-content.ts` and the regeneration flow simultaneously with AI client changes.
- Do NOT modify `shared/db/client.ts` while working on repository files that use it.

---

## 9. Detailed Epic Templates

Below are the detailed epic templates to be created as actual files.

---

## 10. Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| S3 config fix doesn't resolve upload | MVP BLOCKER | Medium | Verify with actual upload test before closing task |
| Regeneration fix breaks existing content | HIGH | Low | Preserve `edited` field protection for section regen; only change full-site confirm path |
| Settings page introduces routing conflicts | MEDIUM | Low | Follow existing route patterns; verify with typecheck + build |
| `<html lang/dir>` fix requires layout restructuring | MEDIUM | Medium | Minimal change — move attributes from inner div to html tag with per-locale logic |
| DB race fix causes connection leaks | HIGH | Low | Use proper mutex pattern; test with concurrent load |
| Generation job fix changes error contracts | MEDIUM | Medium | Preserve existing 202/409/422 response codes; only add top-level catch |

---

## 11. First Implementation Task

**Recommended First Task: E17-T01 — Fix S3 configuration**

**Why first:** Image upload is a core editor feature (PRD requirement). Without it working, users cannot complete the "Preview & Edit" step. The `.env` has already been signed with `S3_REGION=us-east-1`, but `S3_PUBLIC_BASE_URL` is still missing, and the `error.md` at the repo root documents this as an active issue. This task is:
- ✅ Clearly defined (set one env var, verify upload pipeline)
- ✅ High value (unblocks a core user flow)
- ✅ Properly scoped (config only, no code logic changes needed)
- ✅ Based on repository evidence (the S3 diagnosis doc is thorough)
- ✅ Executable by OpenCode (edit `.env`, test upload)
- ✅ Easy to review (verify env var + test result)

**Do NOT execute this task yet** — this is the planning phase only.

---

## 12. Planning Status

**PLAN_READY**

All information needed to begin implementation is available:
- `.env` is signed and gitignored
- MongoDB is running and accessible via `/api/health`
- Dev server is running on port 3000
- All source code is committed (11 commits, clean working tree)
- Lint and typecheck pass
- Build fails only due to MongoDB prerendering (expected — not a code issue)

---

## 13. Artifact Creation

The following planning artifacts will be created:
1. `epics/17-mvp-stabilization/EPIC.md`
2. `epics/18-production-hardening/EPIC.md`
3. `epics/19-testing-infrastructure/EPIC.md`
4. `docs/07-roadmap/00-master-roadmap.md`
