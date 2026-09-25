# Production Readiness Report — website-builder

**Date:** 2026-09-25
**Repo:** https://github.com/AhmedElnagarUU/website-builder (`origin` remote configured ✓)
**Stack:** Next.js 15.3.3 (App Router) · better-auth · MongoDB/Mongoose · AWS S3 · Tailwind · next-intl (en/ar)

---

## 1. Current State

### What exists (✓ built)
- **Create-wizard flow** with business-info form, language selection (en/ar), template picker, AI generation progress, and autosave.
- **Full editor UX**: inline field editing, brand color control, template switching, image slot editor, device toggle, language tabs.
- **Site rendering engine**: 15+ section types (header, hero, services, about, testimonials, menu, gallery, FAQ, hours, pricing, team, contact, CTA, footer), font pairs, design tokens.
- **Features**: analytics, customers, dashboard, images, publishing (live sites), regeneration (site/section/impact), requests, services, templates, monetization (Polar + Paymob), payments, trial/status.
- **Auth**: better-auth email/password + phone flows.
- **i18n**: en + ar with RTL via next-intl; locale-prefixed routes (`/en/...`, `/ar/...`); logical CSS properties; Arabic treated as first-class.
- **Payments**: dual providers (Paymob + Polar) with webhook handlers and HMAC validation for both.
- **S3**: presigned PUT uploads; `shared/s3.ts` upload lib present.
- **API surface**: ~50+ route handlers across sites, templates, auth, checkout, webhooks, etc.
- **Code hygiene**: ESLint + Prettier configured; TypeScript strict; KISS and feature-based structure enforced via `CODE_RULES.md` + `AGENTS.md`.

### Verification (this session)
| Check                | Result                                     |
|----------------------|--------------------------------------------|
| `npm run lint`       | ✓ No warnings/errors                       |
| `npx tsc --noEmit`   | ✓ No type errors                           |
| `npm run build`      | ⚠️ Compiles, but **prerender fails** (see §4)|

---

## 2. Missing for Production MVP

### 🔴 Critical blockers

1. **Build/prerender failure on static pages**
   - Pages (e.g. `/auth/sign-in`) call `getMongooseConnection()` at module/route-load time during SSG, causing `ECONNREFUSED` because MongoDB is not reachable at build time.
   - **Fix needed**: defer DB connection to request time (wrap in route-handler bodies, not module-level), OR exclude DB-dependent pages from static prerender (`dynamic = 'force-dynamic'` / `export const fetch = 'force-no-store'`), OR provide a build-time MongoDB stub. Without this, `next build` produces no usable output in CI.

2. **No `next.config.js` / `next.config.mjs` production hardening**
   - File is `next.config.ts` with only `reactStrictMode: true`. Missing: `output: 'standalone'` (needed for containerization), `images.remotePatterns` for S3/image domains, `compress`, `poweredByHeader: false`, CSP/security headers, and `trailingSlash`/asset prefix for live-site subfolder routing.

3. **Missing `next/image` remote patterns**
   - Published live sites render user/AI-generated images from S3. The config has no `images.remotePatterns` entry for `S3_PUBLIC_BASE_URL` or `*.s3.*.amazonaws.com`, so production will 403/blank those images.

4. **No production server component / runtime guards**
   - No `VERCEL`/node server config or `next start` health check baked in; the `api/health` endpoint exists but isn't wired as a readiness probe.

### 🟡 High-priority gaps

5. **No CI pipeline**
   - No `.github/workflows/`. Nothing runs lint + typecheck + build on push; nothing prevents the prerender failure above from landing on `main`.

6. **No `output: 'standalone'` / Dockerfile**
   - No containerization path. Production deploy story (VPS, Render, Fly, etc.) is undefined.

7. **Env var drift risk**
   - `next.config.ts` does not consume env vars (e.g. `NEXT_PUBLIC_SITES_DOMAIN`), so the live-site subfolder domain and S3 base URL must be set in `.env.local` only — fine, but there is **no runtime validation** that required vars are present. App will crash at runtime with opaque mongoose/env errors rather than a clear startup message.

8. **No `scripts/` deploy or seed hooks**
   - DB schema is code-first via Mongoose schemas; there is no migration/seed CLI, so index creation on Mongo Atlas must be handled manually.

### 🟢 Nice-to-have for post-MVP

9. **No Sentry / error observability** — server-side errors (e.g. during generation) are not reported externally.
10. **No rate limiting / CSRF hardening** on auth routes beyond better-auth defaults.
11. **No `robots.txt` / sitemap.xml** generated for live published sites (SEO).

---

## 3. Risk Areas (code-level)

| Area            | Notes                                                                 |
|-----------------|-----------------------------------------------------------------------|
| `shared/db/mongoose.ts` | Module-level `mongoose.connect` runs during SSG import — root cause of build failure. Must move to per-request singleton. |
| `next.config.ts`         | Minimal. Needs image domains + standalone.                       |
| Route handlers          | Confirmed thin (parse → delegate → respond) per `CODE_RULES.md` §2; good. |
| Payments                | Dual-provider branch is live but `POLAR_SERVER=sandbox` default and `PAYMOB_*` coexist with no runtime switch guard — verify intended migration EPIC 24 state. |

---

## 4. Recommended Fix Sequence (to unblock production build)

1. **`next.config.ts`** — add:
   ```ts
   images: { remotePatterns: [{ protocol: 'https', hostname: '**.s3.**.amazonaws.com' }, { protocol: 'https', hostname: new URL(process.env.S3_PUBLIC_BASE_URL).hostname }] }
   output: 'standalone',
   ```
2. **DB import hygiene** — ensure no page or layout opens a Mongoose connection at import time; use `getMongooseConnection()` only inside route handlers / `getServerSideProps` / `dynamic = 'force-dynamic'` components.
3. **Add `.github/workflows/ci.yml`** — `npm ci && npm run lint && npx tsc --noEmit && npm run build` on push to `main`.
4. **Optional env validator** — small `lib/env.ts` that asserts required keys or throws a clear message at startup.

---

## 5. Summary

- **Code is functionally complete** for the MVP feature set; lint + typecheck are green.
- **Production build is currently broken** due to DB-at-prerender; this is the only hard blocker.
- Next: fix prerender + harden `next.config`, add CI, then cut v1.0.0 tag.

