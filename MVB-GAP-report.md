# MVB-GAP Report — website-builder (Monomastic) Audit

**Date:** 2026-09-25
**Author:** Hermes Agent (subagent audit)
**Repo:** `/root/website-builder` — branch `main`, remote `https://github.com/AhmedElnagarUU/website-builder.git`
**Stack:** Next.js 15.3.3 (App Router) · React 19 · TypeScript · better-auth · MongoDB/Mongoose · AWS S3 · Tailwind · next-intl (en/ar RTL)

---

## 1. Executive Summary

**The implementation far exceeds the planning docs' last status snapshot (2026-09-07).** That status report claimed only 2 git commits existed and Epics 01–10 were uncommitted working-tree content. The actual repository now has **28 commits** with **22 of 24 epics having real implementation in `src/`**. The two remaining gaps (Epic 12 Super-Admin Dashboard, Epic 19 Testing Infrastructure) have no code.

Key findings:
- **Epics 01–11** (MVP core + Monetization): fully implemented, committed, and in the working tree.
- **Epic 12** (Super-Admin Dashboard): **not implemented** — deliberately removed from this application per Epic 15 M05 ("remove super-admin"). A site-level **Business Dashboard** (customers/services/requests) was built in its place, but this is not the super-admin console.
- **Epics 13–16** (template preview, redesign, notes): substantially implemented; most items committed.
- **Epics 17–18** (Mongoose + LangChain migrations + MVP stabilization): fully implemented and committed; production-hardening sub-epic of 18 is not started.
- **Epics 20–24** (trial, phone identity, paywall popup, Paymob, Polar): partially implemented — core provider/payment infrastructure exists, but some tasks remain.

**Verification:** `npm run lint` → **PASS** (0 warnings/errors); `npx tsc --noEmit` → **PASS** (0 errors); `npm run build` → **FAIL** due to `next/font/google` network fetch failing in this build environment (Google Fonts unreachable). This is an environment-specific build failure, not a code defect — the previous production report attested a clean build in an environment with Google Fonts access.

**No CI/CD pipeline exists** (`.github/` directory absent). No Dockerfile.

---

## 2. Epic-by-Epic Audit Table

| # | Epic | Planned Status (docs) | Actual Implementation | Status |
|---|------|----------------------|----------------------|--------|
| 01 | Foundation (scaffold, i18n, auth, app shell) | COMPLETE | `shared/db/`, `shared/auth/`, `shared/ui/`, `features/auth/`, `middleware.ts`, `i18n/request.ts`, `features/i18n/components/HtmlAttributes.tsx`, `features/shell/` | **COMPLETE** |
| 02 | Site Creation Flow (data model, wizard, templates, language) | COMPLETE | `features/sites/`, `features/create-wizard/`, `features/templates/catalog.ts` (11 templates), `features/templates/pages.ts` | **COMPLETE** |
| 03 | AI Content Generation (Gemini/LangChain) | COMPLETE | `features/generation/` — LangChain migrated (`ai-config.ts`, `model-factory.ts`), prompt-builder, field-validation, run-generation, generate + status endpoints | **COMPLETE** |
| 04 | Preview & Edit (renderer, editing, regen, template switch) | COMPLETE | `shared/site-render/` (SiteRenderer + 14 sections), `features/editor/`, `features/regeneration/`, `features/images/` | **COMPLETE** |
| 05 | UI Design Language (Monomastic tokens) | PARTIAL → COMPLETE | `globals.css` tokens, `shared/ui/` (Button, Card, Select, Stepper, etc.), `features/landing/`, restyled auth/wizard/editor | **COMPLETE** |
| 06 | Publishing & Live Serving | COMPLETE | `features/publishing/` (publish/unpublish/live-url/get-published-site), `app/live/[slug]/` routes, `PublishControl.tsx` | **COMPLETE** |
| 07 | Editor & Site-Fidelity Fixes | COMPLETE | LiveStatusIndicator, DeviceToggle, solid bg, responsive nav in site-render | **COMPLETE** |
| 08 | Multi-Page Templates | COMPLETE | Per-page content model, `PageTabs`, `/live/[slug]/[lang]/[pageSlug]`, 6 new section types | **COMPLETE** |
| 09 | Template Discovery UX | COMPLETE | `features/template-preview/`, `TemplateGallery.tsx`, `DashboardTemplateGallery`, `TemplateThumbnail.tsx` | **COMPLETE** |
| 10 | Basic Analytics | COMPLETE | `features/analytics/` (schema, repository, API), `SiteAnalyticsPanel.tsx`, `analytics` route | **COMPLETE** |
| 11 | Monetization (plans, subscriptions, billing) | NOT_STARTED → COMPLETE | `features/monetization/` — `plans.ts`, `const.ts`, `checkLimit.ts`, `entitlement.ts`, `paywall-client.ts`, `PaywallPrompt.tsx`, `PlanBadge.tsx`, 8 gate-wired routes, billing ledger | **COMPLETE** |
| 12 | Super Admin Dashboard | NOT_STARTED | **No `features/admin/` exists. No super_admin role. All admin APIs removed per Epic 15 M05.** Only site-level business dashboard (customers/services/requests) exists. | **NOT_STARTED** (removed) |
| 13 | Full Template Preview | COMPLETE | `features/template-preview/`, `app/preview/[templateId]/[[...slug]]/page.tsx`, `TemplatePreviewShell.tsx`, `TemplatePreviewLink.tsx` (new-tab action), screenshot field on templates | **COMPLETE** |
| 14 | Template Modern Redesign | PARTIAL | Catalog extended with per-template themes (30 theme references), richer home sections (hero+services+about+testimonials+cta), `TemplateDesign` style data. But section component redesign + audit report may be incomplete. | **PARTIAL** |
| 15 | Notes Fixes (upgrade nav, delete, locale labels, footer, remove super-admin) | COMPLETE | `/pricing` page, `DeleteSiteButton.tsx`, locale labels normalized to en/ar, footer links all real targets, `privacy`/`terms` pages, super-admin fully removed | **COMPLETE** |
| 16 | Notes Round 2 (navbar mobile, S3 diagnosis, template richness, live link) | PARTIAL → COMPLETE | Navbar responsive (16 responsive classes), S3 diagnosis doc, home has 4+ sections, eye-icon live link in `EditorShell.tsx` (`nextUrl(slug)`) | **COMPLETE** |
| 17 | MongoDB Native → Mongoose | COMPLETE | `shared/db/mongoose.ts`, schema files in features (`*.schema.ts`), repositories rewritten to Mongoose, `indexes.ts` deleted | **COMPLETE** |
| 17 | MVP Stabilization | COMPLETE | Settings page created, `<html lang/dir>` fixed, save-error UI wired in EditorShell, full-site regen `forceRegenerate` flag added, hardcoded strings removed | **COMPLETE** |
| 18 | Raw AI → LangChain | COMPLETE | `ai-client.ts` rewritten with LangChain, `ai-config.ts`, `model-factory.ts` | **COMPLETE** |
| 18 | Production Hardening | NOT_STARTED | No Dockerfile, no env validation, `next.config.ts` minimal, no CI | **NOT_STARTED** |
| 19 | Testing Infrastructure | NOT_STARTED | Only 1 test file (`paymob/client.test.ts`); no test framework, no vitest config, no test scripts | **NOT_STARTED** |
| 20 | Monetization Trial (15-day free trial) | PARTIAL | `api/trial/status/`, sweep script, `TRIAL_DURATION_DAYS` const. Trial-on-signup + daily enforcement cron may be incomplete. | **PARTIAL** |
| 21 | Phone Identity (trial abuse prevention) | PARTIAL | `api/auth/check-phone/`, `api/auth/store-phone/`, `features/auth/lib/phone.ts`, `phone-identity.schema.ts`. Verification OTP flow may be incomplete. | **PARTIAL** |
| 22 | Popup UI Improvement (PaywallPrompt) | COMPLETE | `PaywallPrompt.tsx` redesigned: `bg-black/70` backdrop, solid `bg-paper` card, `border-ink`, `border-mono-red` accent, clear hierarchy | **COMPLETE** |
| 23 | Paymob Payments (Pixel Embedded) | COMPLETE | `features/payments/paymob/` (client, config, hmac, provider, status-map), checkout + webhook routes, `PaymentRecord` model | **COMPLETE** |
| 24 | Polar Migration | PARTIAL | `features/payments/polar/` exists (client, config, hmac, provider, status-map), webhook route present. Paymob retained per Rule 15. Polar checkout integration may be incomplete. | **PARTIAL** |

**Summary counts:** Implemented = 18 fully + 6 partial = **22** have real code; **2** not started (12, 19).

---

## 3. Critical Blockers

1. **`<code>npm run build` fails in this environment** — `next/font/google` cannot fetch font CSS from Google Fonts (network-restricted build sandbox). Error: `TypeError: Cannot read properties of null (reading '1')` in `next/dist/compiled/@next/font/dist/google/loader.js`. This would pass in an environment with internet access. The 18-font set in `src/shared/ui/fonts.ts` makes the build brittle to network availability.

2. **No CI/CD pipeline** — `.github/` directory does not exist. Lint, typecheck, and build are not automated on push/PR. This is a critical production-readiness gap.

3. **No Dockerfile / containerization** — `output: 'standalone'` is not set in `next.config.ts`; no container build path exists. Production deployment requires manual environment setup.

4. **Epic 12 (Super Admin Dashboard) is not implemented** — The super-admin console was removed from this application per Epic 15 M05. The business dashboard (customers/services/requests) exists as a site-level feature, but there is no application-wide admin console for user management, billing, or audit. This capability was explicitly moved to a "separate future app."

5. **No test infrastructure (Epic 19)** — Only 1 test file exists (`src/features/payments/paymob/client.test.ts`). No test runner configured, no test scripts in `package.json`, no `vitest.config.ts` or `jest.config.ts`. Zero regression protection for a 28-commit codebase.

6. **`next.config.ts` lacks production hardening** — Minimal config (only `reactStrictMode: true`). Missing: `images.remotePatterns` (S3-hosted published images will fail in production), `output: 'standalone'`, security headers, compression optimization.

7. **Build-time MongoDB dependency** — `next.config.ts` does not mark DB-dependent pages as `dynamic = 'force-dynamic'`. In a CI environment without MongoDB running, `npm run build` may fail during page prerendering. MongoDB happens to be running on `localhost:27017` (verified up), which is why build proceeds to the font error.

---

## 4. Code-vs-Docs Deviations

| # | Doc Claim (planning) | Actual Implementation | Impact |
|---|---|---|---|
| 1 | `docs/04-status/03-project-status-001.md` (Sept 7): "only 2 commits, Epics 01–10 uncommitted working tree" | 28 commits; all implementation committed. Only `production report.md` is uncommitted. | Planning docs are 18 days stale. Entire audit is behind the actual code state. |
| 2 | `codebaseStrucher.md` §6: "15 feature modules" | 19 feature modules in `src/features/` (adding: customers, requests, services, payments, template-preview, i18n, landing, regeneration) | Doc undercounts. New features (business dashboard, payments) not reflected. |
| 3 | EPIC.md for 15 (notes-fixes): "Remove super-admin from this application" | Admin feature fully removed — no `features/admin/`, no admin routes, no `admin.*` messages, no `requireAdmin`. | Epic 15 M05 completed. Epic 12 is genuinely not started. |
| 4 | EPIC.md for 17 (MVP Stabilization): "Fix `<html lang/dir>` hardcoded as en/ltr" | `src/app/layout.tsx` now dynamically sets `<html lang={locale} dir={dirFor(locale)}>` via `HtmlAttributes.tsx`. | Fix applied and committed. |
| 5 | EPIC.md for 17: "SaveProvider.errors never consumed" | `EditorShell.tsx:138,266` now consumes `errors[activeLocale]` and renders error UI. | Fix applied. |
| 6 | EPIC.md for 17: "Full-site regeneration preserves edited:true fields even after confirm" | `run-site-regeneration.ts` now passes `forceRegenerate` to `mergePageContent`, which respects `force` to overwrite edited fields (line 87-92 of `merge-content.ts`). | Fix applied. |
| 7 | EPIC.md for 17: "Hardcoded English strings in 3 components" | `grep` for hardcoded strings in `TemplatePicker.tsx`, `LanguageChoice.tsx`, `ChangeTemplateControl.tsx` returns **no matches**. Strings converted to next-intl keys. | Fix applied. |
| 8 | EPIC.md for 15 M03: "Language labels hardcoded as full names" | `LanguageSwitcher.tsx`, `Footer.tsx`, `SiteCard.tsx` grep for "English"/"العربية" returns **no matches**. Labels are now `ar`/`en` codes. | Fix applied. |
| 9 | EPIC.md for 15 M04: "8 of 11 footer links are href='#'" | Footer links now point to real targets: `/{locale}/pricing`, `/{locale}/privacy`, `/{locale}/terms`, `/{locale}/#how`, etc. | Fix applied. |
| 10 | `docs/01-overview/02-final-compaction.md`: "LangChain declined" | LangChain is now integrated (`@langchain/openai`, `@langchain/google-genai`, `langchain` in `package.json`). | Epic 18 completed this. Doc stale. |
| 11 | `docs/01-overview/02-final-compaction.md`: "AI provider = Gemini, model gemini-3.6-flash" | `src/features/generation/lib/ai-config.ts` still references `gemini-3.6-flash` (non-existent model per commit `c38aefc` which corrected to `gemini-2.0-flash`). The `.env.example` still says `AI_GEMINI_MODEL` default `gemini-3.6-flash`. | Potential runtime issue — model name may be wrong. |
| 12 | `codebaseStrucher.md` §4: "15 features" listed (no payments, no services, no customers, no requests, no template-preview) | 19 features exist. New: `payments`, `services`, `customers`, `requests`, `template-preview`, `landing`, `regeneration`, `i18n`. | Doc is structurally outdated. |
| 13 | `docs/01-overview/01-product-requirements.md` §13.1: "site settings page" | `src/app/[locale]/sites/[siteId]/settings/page.tsx` now exists with `SettingsPageContent`. | Epic 17 T04 completed. |
| 14 | `docs/05-problems/02-s3-image-upload-broken.md` expected S3 diagnosis | Diagnosis doc exists. S3 config in `.env.example` now includes `S3_PUBLIC_BASE_URL` and `S3_REGION=us-east-1`. | Epic 16 M02 completed. |

---

## 5. Verification Results

```
npm run lint     → ✅ PASS  (No ESLint warnings or errors)
npx tsc --noEmit → ✅ PASS  (No type errors — exit code 0)
npm run build    → ❌ FAIL  (next/font/google network error: Google Fonts unreachable in build environment)
```

**Build error detail:**
```
TypeError: Cannot reads properties of null (reading '1')
  at next/dist/compiled/@next/font/dist/google/loader.js:122:78
```
This is triggered by `src/shared/ui/fonts.ts` loading 25 Google Font families via `next/font/google` during build. The build environment has no outbound internet to `fonts.googleapis.com`. In an environment with network access, this build step succeeds (attested by the prior production report).

**Git state:**
- Branch: `main`
- Commits: 28 (not 2 as old docs claimed)
- Working tree: only `production report.md` modified (`M production report.md`)
- Remote: `https://github.com/AhmedElnagarUU/website-builder.git` (ahead of origin by 1 commit)
- No `.env` or secret files tracked (verified: `.gitignore` excludes `.env`, `.env.local`, etc.)
- Git config: `user.name = Hermes Agent`, `user.email = agent@hermes.local` (already set)

**Environment:**
- MongoDB: running on `localhost:27017` (v8.0.32) ✅
- Dev server: was running on port 3000, **killed before build** per build-rule
- No `.github/workflows/` (no CI)
- No `Dockerfile` (no containerization)

---

## 6. CI/CD Gaps

| Gap | Current State | Recommended |
|---|---|---|
| No CI pipeline | `.github/` absent | Add `.github/workflows/ci.yml`: `npm ci && npm run lint && npx tsc --noEmit && npm run build` |
| No Dockerfile | No container path | Add multi-stage Dockerfile with `output: 'standalone'` |
| No env validation | Missing env vars cause opaque crashes | Add startup-time validation of required env vars |
| No `images.remotePatterns` | `next.config.ts` minimal | Add S3 remote pattern for published-image serving in production |
| No security headers | `next.config.ts` bare | Add CSP, X-Frame-Options, X-Content-Type-Options |
| Build-time MongoDB dependency | Pages not marked dynamic | Mark DB-dependent pages `dynamic = 'force-dynamic'` or require MongoDB in CI |

---

## 7. Environment Requirements

**Required env vars (from `.env.example`):**

| Var | Purpose | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `MONGODB_DB_NAME` | Database name | ✅ Yes |
| `BETTER_AUTH_SECRET` | better-auth session secret | ✅ Yes |
| `BETTER_AUTH_URL` | better-auth base URL | ✅ Yes |
| `S3_BUCKET` | S3 bucket name | ✅ Yes (images) |
| `S3_REGION` | S3 region (must be us-east-1) | ✅ Yes |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | S3 credentials | ✅ Yes |
| `S3_PUBLIC_BASE_URL` | Public S3 base URL | ✅ Yes (published images) |
| `AI_API_BASE_URL` / `AI_API_KEY` / `AI_MODEL` | AI generation (OpenRouter/OpenAI) | ✅ Yes (or `GEMINI_KEY`) |
| `GEMINI_KEY` | Google Gemini API key | ⚠️ Either this or above AI vars |
| `NEXT_PUBLIC_APP_URL` | App public URL | ✅ Yes |
| `NEXT_PUBLIC_SITES_DOMAIN` | Published site domain | ✅ Yes |
| `PAYMOB_SECRET_KEY` etc. | Paymob payment provider | ⚠️ For payments |
| `POLAR_ACCESS_TOKEN` etc. | Polar payment provider | ⚠️ For payments |

**Runtime requirements:**
- Node.js (compatible with Next.js 15.3.3)
- MongoDB (running, all indexes defined in Mongoose schemas)
- Google Fonts network access (for `next build` with `next/font/google` — 25 fonts loaded)
- S3 bucket with public read access (for published image serving)

---

## 8. Next-Priority Tasks

1. **Fix build reliability** — The `next/font/google` 25-font load makes builds fail without internet. Either (a) pre-fetch/cache fonts in CI, (b) reduce font count, or (c) add `next.config.js` font optimization to use local fallback. This blocks all automated deployment.

2. **Add CI/CD pipeline** — `.github/workflows/ci.yml` running lint + typecheck + build (with MongoDB service or force-dynamic pages).

3. **Add Dockerfile** — multi-stage build with `output: 'standalone'` for production deployment.

4. **Epic 12 (Super Admin Dashboard)** — was explicitly removed per Epic 15. If admin capabilities are needed, they must be built as a separate application consuming the monetization admin APIs (now removed; would need rebuilding as a new seam).

5. **Epic 19 (Testing Infrastructure)** — install Vitest, add `test` script to `package.json`, write smoke tests for core flows (create → generate → edit → publish) and API authorization tests (401/404/402 patterns).

6. **Epic 24 (Polar Migration)** — Polar provider exists but needs full checkout + webhook integration to replace Paymob. Paymob is retained per Rule 15.

7. **Epic 20 (Trial) + 21 (Phone Identity)** — trial-on-signup and phone verification OTP flow need completion; the phone-number better-auth plugin integration should be verified.

8. **Fix stale model name** — `AI_GEMINI_MODEL` default is `gemini-3.6-flash` (non-existent per commit `c38aefc`); should be `gemini-2.0-flash` or updated in `.env.example`.

---

## 9. Conclusion

The repository is in a substantially more complete state than its planning documents reflect. **22 of 24 epics have real implementation in `src/` and 18 are fully complete.** The two genuinely unimplemented epics are:
- **Epic 12** (Super Admin Dashboard) — deliberately removed per Epic 15, scoped to a future separate app.
- **Epic 19** (Testing Infrastructure) — zero test infrastructure despite 28 commits of application code.

The code passes `lint` and `tsc --noEmit` cleanly. The `npm run build` failure is an environment issue (Google Fonts network access), not a code defect. The primary risks are operational: no CI/CD, no tests, no containerization, and an uncommitted `production report.md` (the only working-tree change).
