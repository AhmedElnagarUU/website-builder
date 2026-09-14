# Master Roadmap — Monomastic MVP → Production

## Project Goal
Deliver a stable, production-ready AI-powered website builder that lets non-technical business owners create, edit, and publish professional bilingual (EN/AR) websites in approximately one minute.

---

## MVP Definition
A user can: sign in → enter business info → select a template → choose languages → AI generates the site → edit inline (text, images, brand color) → publish at `/live/[slug]` → manage sites from dashboard. All PRD Section 19 acceptance criteria pass.

## Production Ready Definition
The system can be safely deployed and operated: owner-scoped access on all routes, no stuck jobs, no DB race conditions, structured logging, Docker deployment, health checks, and automated test coverage for critical paths.

---

## Execution Waves

### WAVE 0 — Pre-Flight ✅
- ✅ Project discovery (Mission 01)
- ✅ `.env` signed (all secrets present)
- ✅ Dependencies installed (removed Win-only `@next/swc-win32-x64-msvc`)
- ✅ MongoDB running, `/api/health` returns `{"status":"ok","db":true}`
- ✅ Lint passes (0 errors/warnings), typecheck passes (0 errors)
- ✅ 11 commits, clean working tree

### WAVE 1 — MVP Stabilization (EPIC-17)
**Status:** PLANNED  
**Goal:** Fix all MVP blockers  
**Tasks:** 6 tasks (E17-T01 through E17-T06)

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| E17-T01 | Fix S3 configuration (region + public base URL) | P0 | PLANNED |
| E17-T02 | Fix full-site regeneration confirm semantics | P0 | PLANNED |
| E17-T03 | Convert hardcoded English strings to next-intl | P0 | PLANNED |
| E17-T04 | Create site settings page | P0 | PLANNED |
| E17-T05 | Fix `<html lang/dir>` application | P0 | PLANNED |
| E17-T06 | Wire save-error UI | P1 | PLANNED |

### WAVE 2 — Production Hardening (EPIC-18)
**Status:** PLANNED  
**Goal:** Make the system production-ready  
**Tasks:** 6 tasks (E18-T01 through E18-T06)  
**Dependency:** EPIC-17 must be COMPLETE

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| E18-T01 | Fix generation job lifecycle (try/catch + status recovery) | P0 | PLANNED |
| E18-T02 | Fix DB connection race condition | P0 | PLANNED |
| E18-T03 | Declare `zod` in package.json | P1 | PLANNED |
| E18-T04 | Fix analytics unbounded read | P2 | PLANNED |
| E18-T05 | Add Dockerfile | P2 | PLANNED |
| E18-T06 | Add structured error logging | P2 | PLANNED |

### WAVE 3 — Testing & Future Epics (EPIC-19, EPIC-12, EPIC-13)
**Status:** PLANNED  
**Goal:** Add test coverage, complete future epics  
**Dependency:** EPIC-18 must be COMPLETE

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| E19-T01 | Set up test framework (Vitest) | P1 | PLANNED |
| E19-T02 | Core flow smoke tests | P1 | PLANNED |
| E19-T03 | API authorization tests | P1 | PLANNED |
| E19-T04 | Generation job lifecycle tests | P2 | PLANNED |
| E19-T05 | Content merge tests | P2 | PLANNED |
| E19-T06 | Entitlement tests | P2 | PLANNED |
| E12-T01 | Define admin role model + guard | P2 | PLANNED |
| E12-T02 | User listing/search | P2 | PLANNED |
| E12-T03 | Freeze/suspend/reactivate | P2 | PLANNED |
| E12-T04 | Manual subscription editor | P2 | PLANNED |
| E12-T05 | Manual payment + revenue view | P2 | PLANNED |
| E13-T01 | Complete template preview route | P2 | PLANNED |

---

## Dependency Graph

```
EPIC-17 (MVP Stabilization) ✅ COMPLETE
         │
         ▼
EPIC-18 (Production Hardening)
         │
         ▼
EPIC-19 (Testing)     EPIC-12 (Super Admin)     EPIC-13 (Template Preview)
         │                      │
         │                      ▼ (depends on E11 monetization)
         │
         ▼
MISSION 03:
├── EPIC-20 (Trial & Subscription)    🟡 PLANNED
├── EPIC-21 (Phone Identity)          🟡 PLANNED
└── EPIC-22 (Popup UI)                🟡 PLANNED
         │
         ▼
Future: Payment Gateway (Stripe)
         │
         ▼
PRODUCTION READY
```

**Note:** EPIC-12 depends on EPIC-11 (Monetization, already implemented) for billing/ledger APIs.

---

## Epic Status

| Epic | Wave | Status | Completion |
|------|------|--------|------------|
| EPIC-01 through EPIC-10 | Historical | ✅ COMPLETE | All implemented, committed, lint+typecheck green |
| EPIC-11 (Monetization) | Historical | ✅ COMPLETE | Implemented and committed |
| EPIC-12 (Super Admin) | Wave 3 | 🟡 PLANNED | Planning docs only; code was removed in Epic 15 cleanup |
| EPIC-13 (Template Preview) | Wave 3 | 🟡 PLANNED | Partially implemented; needs completion |
| EPIC-14 (Template Redesign) | Historical | ✅ COMPLETE | Implemented (new design system, richer templates) |
| EPIC-15 (Notes Fixes) | Historical | ✅ COMPLETE | Implemented (navbar mobile, pricing, privacy, terms, super-admin removal) |
| EPIC-16 (Notes Round 2) | Historical | 🟡 PARTIAL | Navbar mobile done, S3 diagnosis done, template richness via Epic 14, editor live link done |
|| **EPIC-17** | **Wave 1** | ✅ COMPLETE | **6 tasks: S3 fix, regen semantics, i18n, settings page, html lang/dir, save-error UI** |
|| **EPIC-18** | **Wave 2** | 🟡 PLANNED | **6 tasks for production hardening** |
|| **EPIC-19** | **Wave 3** | 🟡 PLANNED | **6 tasks for testing infrastructure** |
|| **EPIC-20** | **Mission 03** | 🟡 PLANNED | **15-day free trial + subscription enforcement** |
|| **EPIC-21** | **Mission 03** | 🟡 PLANNED | **Phone number identity + trial abuse prevention** |
|| **EPIC-22** | **Mission 03** | 🟡 PLANNED | **Template/plan popup UI improvement** |

---

## Key Decisions & Defaults

1. **S3 Region:** Set `S3_REGION=us-east-1` (confirmed bucket location) — documented in `docs/05-problems/02-s3-image-upload-broken.md`
2. **S3_PUBLIC_BASE_URL:** Needs to be set in `.env` — currently absent
3. **Full-site regeneration:** Confirmed regeneration overwrites edited fields per PRD AC
4. **Admin:** Removed from this app (Epic 15 cleanup); will be a separate app per Epic 12 plan
5. **Templates:** 11 templates, all RTL-validated, home page has 7 sections (header/hero/services/about/testimonials/cta/footer)
6. **`zod`:** Used extensively but not in `package.json` — must be declared
7. **Test framework:** Vitest chosen (Jest-compatible, fast, TS-native)

---

## First Implementation Task

**E17-T01: Fix S3 Configuration**

Set `S3_PUBLIC_BASE_URL` in `.env` and update `.env.example` to reflect `S3_REGION=us-east-1`. This unblocks image upload — a core MVP feature — and is the highest-impact, lowest-risk starting point.
