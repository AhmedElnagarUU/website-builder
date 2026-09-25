# Production Readiness Report — website-builder

**Date:** 2026-09-25
**Repo:** https://github.com/AhmedElnagarUU/website-builder
**Branch:** `main` (working tree divergent)
**Stack:** Next.js 15.3.3 (App Router) · better-auth · MongoDB/Mongoose · AWS S3 · Tailwind · next-intl (en/ar)

---

## 1. Summary

- The codebase has a **substantially complete MVP** (Epics 01–10 implemented in the working tree), plus a **fully implemented Monetization layer** (Epic 11, 9/9 tasks) — but **none of it is committed** (`git log` shows only 2 scaffold commits from before implementation began).
- With MongoDB running (verified live at `http://localhost:3000`), `npm run lint` ✓ · `npx tsc --noEmit` ✓ · `npm run build` ✓ all pass.
- **Three hard blockers to a production deploy:** (1) the entire implementation is uncommitted (data-loss risk); (2) no CI pipeline; (3) `next.config.ts` lacks production hardening (`output: 'standalone'`, `images.remotePatterns`, security headers).

---

## 2. What's Built (✅ verified)

### Code quality (this session)
| Check | Result |
|---|---|
| `npm run lint` | ✓ No ESLint warnings/errors |
| `npx tsc --noEmit` | ✓ No type errors |
| `npm run build` | ✓ Compiles, all pages prerendered |
| `GET /api/health` (dev server) | ✓ `{"status":"ok","db":true}` |
| `GET /en` | ✓ HTTP 200, correct i18n hreflang + RTL headers |

### Features implemented (per `codebaseStrucher.md` + `docs/04-status`)
- **Epics 01–06 (MVP core):** auth, site creation wizard, AI generation (Gemini/OpenAI-compatible), editor (inline editing, images, brand color, template switch), publishing (`/live/[slug]`), analytics.
- **Epics 07–09:** editor fidelity fixes, multi-page templates, template discovery UX.
- **Epic 10 (Analytics):** pageview recording + dashboard panel — **implemented but uncommitted**.
- **Epic 11 (Monetization):** plans, subscriptions, guard layer, paywall UX (bilingual), billing ledger, admin APIs — **9/9 tasks complete, uncommitted**.
- **Features present in `src/features/`:** auth, sites, create-wizard, templates, generation, regeneration, editor, publishing, images, dashboard, monetization, analytics, requests, services, landing, template-preview.

---

## 3. Missing for Production MVP

### 🔴 Critical blockers

1. **Nothing is committed to git**
   - `git log` shows 2 commits only (`first commit`, `add proplem.md`). The entire Epics 01–11 implementation lives in the working tree as uncommitted/staged-modified/untracked files.
   - Includes the `production report.md` I wrote this session — also uncommitted.
   - **Fix:** commit in logical units; ensure `.env` stays ignored (`.gitignore` present, but verify).

2. **No CI pipeline**
   - No `.github/workflows/`. Lint + typecheck + build are not automated on push.
   - **Fix:** add `.github/workflows/ci.yml` running `npm ci && npm run lint && npx tsc --noEmit && npm run build`.

3. **`next.config.ts` lacks production hardening**
   - Minimal config (`reactStrictMode: true` only). Missing:
     - `output: 'standalone'` (for containerization)
     - `images.remotePatterns` (for S3-hosted published images — will 403/blank in production)
     - `compress`, `poweredByHeader: false`
     - Security headers (CSP, X-Frame-Options, etc.)

### 🟡 High-priority gaps

4. **Build requires a running MongoDB**
   - `npm run build` succeeds when MongoDB is running (verified), but the build-time prerender pulls in the Mongoose module. In a CI environment without MongoDB, the build will fail with `ECONNREFUSED`.
   - Options: (a) run MongoDB in CI (slow, heavy), (b) mark DB-dependent pages `dynamic = 'force-dynamic'`, (c) build-time stub.

5. **No env-var validation at startup**
   - Missing required vars (`MONGODB_URI`, `BETTER_AUTH_SECRET`, S3/AI keys) cause opaque crashes, not clear errors.

6. **No Dockerfile / container path**
   - No `output: 'standalone'` means no clean containerization story.

### 🟢 Known minor gaps (from audit docs)

- Hardcoded English strings in 3 components (violates CODE_RULES §6 i18n invariant).
- `<html lang/dir>` hardcoded as `en/ltr` in root layout (not set per-locale for RTL).
- Full-site regeneration preserves "edited" fields even after the confirm dialog (spec deviation).
- Analytics 31-day vs 30-day window inconsistency; unbounded history read.
- `zod` used but not declared in `package.json` (transitive via better-auth).
- No automated tests anywhere in the repository.

---

## 4. Environment Notes

- **Dev server** was live at `http://localhost:3000` with MongoDB running locally on `localhost:27017`.
- **OpenCode 1.18.32** installed and available at `/root/.opencode/bin/opencode` (added to PATH via `.bashrc`, not yet exported in this shell).

---

## 5. Recommended Next Steps

1. **Commit current state** (Epics 01–11) in logical commits; verify `.env` gitignored.
2. **Hardening:** update `next.config.ts` (image domains, standalone, security headers).
3. **CI:** add `.github/workflows/ci.yml`.
4. **Build reliability:** decide on the MongoDB-at-build approach (force-dynamic pages vs CI MongoDB service).
5. **Push** the committed state + this report to GitHub (requires auth token setup).
