# Code Review Report

## Review Status

**ORANGE** — Important issues exist. A critical secret-hygiene issue (committed session token) and several correctness/limit-enforcement gaps should be addressed before the code is considered production-ready. The core authorization and data-integrity design is genuinely solid; most findings are release-hygiene and robustness issues rather than systemic flaws.

## Review Metadata

- Review ID: CR-001
- Review Number: 001
- Date: 2026-09-07
- Branch: main
- Commit: fce650f
- Commit message: "add proplem.md"
- Previous Review: None (first code review for this repository)
- Scope: Full codebase (application source; `src/`), configuration, scripts, repo hygiene
- Technology stack: Next.js 15.3.3 (App Router) · React 19 · TypeScript 5 · better-auth · MongoDB (native driver 7) · Amazon S3 presigned uploads · Tailwind CSS v4 · next-intl

## Executive Summary

Monomastic is an AI-powered bilingual (EN/AR) website builder. A user answers business questions, picks a template and languages, AI writes the site, the user lightly edits it inline, then publishes it to a system URL under `/live/{slug}/…`.

The architecture is well separated: thin App-Router API routes call into feature-layer modules, a repository layer isolates MongoDB, and a shared site-rendering engine renders templates. Ownership checks are consistently applied across all site-scoped endpoints (`getSiteForOwner`), Zod validation with `.strip()` guards all mutation bodies, and content is rendered through React text escaping (no `dangerouslySetInnerHTML`) — a strong foundation.

### Most important strengths

- Consistent server-side ownership scoping on every site-scoped API path (no IDOR pattern observed; nobody trusts a client-supplied `userId`).
- Server-side validation with template-aware field constraints before writes; regeneration explicitly preserves `edited` user fields (`mergePageContent`), honoring the core product invariant.
- Clean feature-module layering and a genuinely good observer-level code style; `.env` correctly gitignored; server-only secrets never reach the client bundle.

### Most important weaknesses

1. A **live better-auth session token is committed to git** (`signin.txt`) — this is a bearer credential that any repo reader can replay to sign in as that user.
2. `ensureIndexes()` is defined but **never invoked**, so the unique `sites.slug` index the publish flow relies on, plus the pageview/subscription indexes, never exist.
3. Several **plan limits are not actually enforced** (`maxPagesPerSite` ignores existing usage; the initial template-selection route has no entitlement wrapper).
4. AI generation runs as **fire-and-forget promises** after the HTTP response resolves — unreliable on serverless.
5. **No tests** exist, and there is **no rate limiting** on authentication or public analytics endpoints.

### Findings counts

| Severity | Count |
| -------- | ----- |
| CRITICAL | 1 |
| HIGH     | 3 |
| MEDIUM   | 4 |
| LOW      | 4 |
| INFO     | 2 |

### Most important recommendations

- **P0:** Remove `signin.txt` from git history and rotate/invalidate the session token; add it to `.gitignore`.
- **P0:** Wire `ensureIndexes()` into server bootstrap and re-verify slug uniqueness.
- **P1:** Enforce plan limits against real usage (pages, languages, total image bytes) and add entitlement to the initial template-selection route.
- **P1:** Replace fire-and-forget generation with a durable job (or at minimum document the constraint) and add rate limiting to auth + analytics.
- **P2:** Guard routes against invalid ObjectIds (return 404 instead of 500), add security headers, and begin a test suite around publishing/merge/entitlement.

---

## Project Understanding

- **What it does:** Non-technical business owners create an AI-written bilingual website via a 4-step wizard, edit it inline (text + images), and publish it to a system URL `{slug}.{sitesDomain}`.
- **Main users:** Small business owners (EN + AR), logged-out visitors of published sites.
- **Main workflows:** Sign up/sign in → Create site → Business info → Pick template → Pick languages → AI generation → Inline editing → Publish → View live site → Regenerate (full/section/template backfill).
- **Architecture:** Next.js App Router (client-rendered `SiteRenderer` for site content), API route handlers calling feature-module functions, MongoDB for persistence, S3 presigned PUT for images, better-auth (email/password) for auth, next-intl for i18n with `[locale]` segments and a separate non-prefixed `live/` public space.
- **Data flow:** Client mutations → API route → feature function → repository (`sites`, `pageviews`, `subscriptions`, `memberships`, `billing`) → MongoDB. AI content generation is triggered by POST then executed out-of-band; results progressively save to the site document.
- **Trust boundaries:** (1) unauthenticated public `live/` routes only read the published snapshot; (2) authenticated owner-scoped writes; (3) server-side AI provider calls (Gemini / OpenAI-compatible); (4) S3 ingestion via presigned URLs scoped to the owner's site key prefix.
- **External integrations:** AI providers (Google Gemini or OpenRouter-compatible), AWS S3.
- **Critical assets:** User content + published snapshots, session tokens, AI provider API keys, S3 credentials, and the ability to spend money on AI calls.
- **Attack surface:** Public auth endpoints, public `/live/*` (snapshot rendering + pageview writes), owner-scoped site APIs, S3 presign flow, AI-trigger routes (cost), invalid-ID paths, and the committed repo secrets.

---

## Technology Stack

Verified from `package.json`, lockfile, configs and source:

- Next.js `15.3.3` (App Router), React 19
- TypeScript `^5`, strict mode
- better-auth `^1.7.2` (email/password, MongoDB adapter)
- MongoDB native driver `^7.6.0`
- `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` (presigned PUTs)
- next-intl `^4.14.1`, Tailwind CSS `^4` (@tailwindcss/postcss)
- eslint `^9` + `eslint-config-next` + `typescript-eslint`

No test framework is installed (no `test` script in `package.json`).

## Architecture Overview

```
src/
  middleware.ts            next-intl locale routing; bypasses /live; 404s unknown locale-like segments
  app/
    api/auth/[...all]      better-auth catch-all handler
    api/health             MongoDB ping
    api/templates/*        catalog reads (session required)
    api/sites/*            site CRUD + wizard + content/images/publish/regenerate/analytics
    [locale]/…             user-facing app (landing, auth, dashboard, create wizard, editor)
    live/…                 public published sites (snapshot-driven, no locale prefix)
  features/                domain modules (auth, sites, templates, generation, regeneration,
                           publishing, images, analytics, monetization, editor, create-wizard,
                           dashboard, landing, shell)
  shared/                  db (client/db/indexes), auth (server/client), i18n, lib, site-render, ui
```

Key invariants observed in implementation:

- All state-changing work goes through HTTP API routes (no server actions).
- Every site-scoped route re-checks ownership server-side (`getSiteForOwner`).
- Publishing snapshots content immutably; unpublish never touches the snapshot.
- Regeneration merges AI output while preserving fields whose `edited === true`.

## Review Coverage

- **Directories reviewed:** `src/app` (all routes), `src/features` (14 modules), `src/shared` (auth, db, i18n, site-render, ui, lib), `src/middleware.ts`, `src/i18n`, `src/messages`.
- **Important files reviewed (89):** all API route handlers, repository/schema/type layers, generation pipeline (`run-generation`, `ai-client`, `field-validation`, `merge-content`, prompt-builder), regeneration (site/section/backfill), publishing (snapshot, slug retry, live pages, live rendering), images (presign, record, key ownership), monetization (plans, usage, limits, entitlement), analytics, editor autosave/upload, auth forms and session helpers, middleware, DB indexes, Next/Tailwind/ESLint/TS configs, `.env.example`, `.gitignore`.
- **Files excluded and why:** `node_modules/`, `.next/`, `package-lock.json` internals, generated/compiled artifacts, `.vscode/`, dev log files (checked for secrets only). The `epics/`, `docs/`, `design/`, `prompt/` directories are planning/design artifacts, not runtime code, and were not audited as code.
- **Tests executed:** none exist (no test framework configured — this is itself a finding).
- **Static analysis executed:** `tsc --noEmit`, `next lint`, `next build`.
- **Build status:** `next build` compiled successfully; the finalize step failed with `ENOENT .next/server/pages-manifest.json`. This is classified as an **ENVIRONMENT FAILURE** (stale/incomplete `.next` cache, almost certainly interference from a running dev server whose logs exist in the repo root) — the compilation itself succeeded with zero errors.
- **Areas requiring deeper investigation:** DB query plans at scale (pageview aggregation reads all rows per site), real-world behavior of the fire-and-forget background jobs on the chosen host, and the AI prompt-injection surface (user `businessInfo` flows verbatim into LLM prompts).

---

## Findings Summary

| ID           | Severity | Confidence | Category              | File                    | Line | Problem |
| ------------ | -------- | ---------- | --------------------- | ----------------------- | ---- | ------- |
| CR-001-F-001 | CRITICAL | CONFIRMED  | Secrets / Auth        | signin.txt              | 1    | Live session token committed to git |
| CR-001-F-002 | HIGH     | CONFIRMED  | DB / Correctness      | src/shared/db/indexes.ts | 3    | ensureIndexes never invoked |
| CR-001-F-003 | HIGH     | CONFIRMED  | Abuse / DoS           | src/app/live/…/page.tsx | 34   | Public unauthenticated pageview writes, no rate limit |
| CR-001-F-004 | HIGH     | CONFIRMED  | Authorization/Monetize| api/sites/[siteId]/template/route.ts | 4 | Template selection not entitlement-wrapped; page limit unenforced |
| CR-001-F-005 | MEDIUM   | CONFIRMED  | Validation / Errors   | src/features/sites/repository.ts | 13 | Invalid ObjectId throws → 500 |
| CR-001-F-006 | MEDIUM   | LIKELY     | Reliability           | src/features/generation/api/start-generation.ts | 49 | Fire-and-forget generation on serverless |
| CR-001-F-007 | MEDIUM   | POTENTIAL  | Abuse / Auth          | src/shared/auth/server.ts | 20 | No rate limiting on auth endpoints |
| CR-001-F-008 | MEDIUM   | CONFIRMED  | Security headers      | next.config.ts          | 6    | No CSP/HSTS/X-Content-Type-Options/etc. |
| CR-001-F-009 | LOW      | CONFIRMED  | Limits / Accounting   | src/features/monetization/lib/checkLimit.ts | 94  | maxImageBytes never cumulative; largestImageBytes hardcoded 0 |
| CR-001-F-010 | LOW      | CONFIRMED  | Secrets hygiene       | src/features/generation/lib/ai-client.ts | 106 | Gemini API key in URL query string |
| CR-001-F-011 | LOW      | CONFIRMED  | Logic / Concurrency   | src/features/generation/api/start-generation.ts | 33 | TOCTOU can double-trigger AI generation |
| CR-001-F-012 | LOW      | CONFIRMED  | Host header           | src/features/publishing/live-url.ts | 6    | Host header used to construct URLs |
| CR-001-F-013 | INFO     | CONFIRMED  | Testing gap           | — (whole repo)          | —    | No automated tests |
| CR-001-F-014 | INFO     | CONFIRMED  | Build / Typecheck     | tsconfig.json / .next   | —    | Non-reproducible tsc error; build artifact failure |

---

## Critical Findings

### CR-001-F-001 — Committed live session token (credential leakage)

Severity: CRITICAL
Confidence: CONFIRMED

File:
`signin.txt`

Lines:
1

Function:
n/a (repo root artifact)

Category:
Secrets / Credential exposure / Auth

#### Problem

`signin.txt` is **tracked in git** (verified with `git ls-files`). It contains a live better-auth session token along with the associated user record (name `Test User`, email `test@example.com`, created 2026-08-30). The token value is intentionally not reproduced in this report. A session token is a bearer credential: it is all a client needs to authenticate as that user via the better-auth session cookie/route.

#### Why It Matters

Anyone with access to the repository (team members, leaked clones, CI, etc.) can replay this token and sign in as the affected account. Worse, commit history retains it forever unless explicitly purged. This is exactly the class of leak that later turns into a "stolen session" incident.

#### How It Can Happen

A developer ran a quick script that printed the raw better-auth sign-in response (`{"redirect":false,"token":"…","user":{…}}`) into the repo root and committed it.

#### Recommended Fix

1. Delete the file and add `signin.txt` (and `*.txt` session dumps, `*signin*`) to `.gitignore`.
2. Purge history with `git filter-repo` (or BFG) — `.gitignore` alone does not remove the leaked token from history.
3. Invalidate the session server-side and, since the user record is `test@example.com`, treat the account as compromised.
4. Consider rotating `BETTER_AUTH_SECRET`, which is used to sign all session tokens.

#### Learning Note

When reviewing, always ask: *"Has anything that should never be committed actually been committed?"* `git ls-files` and a secret scan of tracked files are cheap and catch what `git status` hides. Bearer tokens in a repo are equivalent to the password being pasted into a public chat — the duration of exposure cannot be known.

---

## High Findings

### CR-001-F-002 — `ensureIndexes()` is defined but never executed

Severity: HIGH
Confidence: CONFIRMED

File:
`src/shared/db/indexes.ts`

Lines:
3-30 (definition; zero call sites in repo)

Function:
`ensureIndexes()`

Category:
Database / Correctness / Data integrity

#### Problem

The function creates the required indexes (unique `sites.slug`, unique pageview composite key, unique `subscriptions.userId`/`memberships.userId`, billing indexes) but nothing in the codebase calls it (confirmed via repo-wide search).

#### Why It Matters

Three concrete consequences:

1. **Slug uniqueness is not guaranteed.** `publish-site.ts` (lines 71-89) retries on duplicate-key error `11000` when assigning `{name}-{6hex}` slugs. That retry loop only works *because* a unique index exists — without it, two sites could end up with the same slug, and the "retry until unique" logic silently no-ops.
2. **Pageview counts can fragment.** The unique `{siteId, date, page, locale}` key is what makes the `$inc` upsert in `recordPageview` a single atomic counter per day; without it, concurrent upserts can create duplicate documents and split counts.
3. **Subscriptions/memberships uniqueness** relies on the unique `userId` index for correctness guarantees in `upsertSubscription`/`setAccountStatus`.

#### How It Can Happen

No bootstrap hook (e.g. `instrumentation.ts`) reached by startup calls `ensureIndexes`. The function exists, so all the code *assumes* the schema is applied.

#### Recommended Fix

Invoke `ensureIndexes(await getDb())` once at server startup (Next.js `instrumentation.ts` `register()` is the natural place), and make it a required step in the deployment runbook. Guard it to be idempotent.

#### Learning Note

An index is part of the schema contract, not a performance luxury. Whenever code branches on a MongoDB duplicate-key error or an upsert, check that the matching unique index is actually created at runtime — a missing index turns "guaranteed behavior" into "probabilistic behavior."

### CR-001-F-003 — Unauthenticated, unrate-limited pageview writes on public routes

Severity: HIGH
Confidence: CONFIRMED

File:
`src/app/live/[slug]/[lang]/page.tsx` (lines 34-42) and `src/app/live/[slug]/[lang]/[pageSlug]/page.tsx` (lines 49-57); write path in `src/features/analytics/repository.ts` (lines 23-27)

Function:
`LiveHomePage` / `LivePageSegment` calling `recordPageview()`

Category:
Abuse / DoS / Data integrity (analytics)

#### Problem

Every non-"bot" request to a public page performs a MongoDB `updateOne` upsert with no rate limiting, no authentication, and no origin/referrer validation. The bot filter (`/bot|crawler|spider|slurp|mediapartners|preview/i.test(ua)`) is trivially spoofable and the bypass condition is *anything* — an attacker simply omits those words.

#### Why It Matters

1. **Resource exhaustion:** an attacker (or an accidental load spike) can drive unbounded DB write volume against a serverless-hosted app.
2. **Analytics integrity:** pageview numbers that drive user-facing dashboards (and potentially future monetization) can be arbitrarily inflated by one `curl` loop.

#### How It Can Happen

`for i in $(seq 100000); do curl -s https://site/live/cafe-ab12/en >/dev/null; done` — alternatively, hotlinking an `<img>` URL pointing at the live page from a high-traffic site.

#### Recommended Fix

- Add an XOR-able cheap rate limiter per IP/site (in-memory for Node hosts, Upstash/Redis or a similar bounded store for serverless; better-auth users get `/api/auth` rate limiting from the same primitive).
- Require a small proof of client intent (e.g. `navigator.sendBeacon` with a signed token, or server-rendered `<img>` beacon with a one-time signature per pageview) rather than trusting raw UA strings.
- At a minimum, cap upserts per IP per minute and ignore obviously-spoofed UAs server-side.

#### Learning Note

Any write endpoint reachable by anonymous users is an abuse surface. Before counting on "bot detection," note that *every* string-based bot check is bypassable — the question is what the residual cost is and whether a hostile client can make you pay it at scale.

### CR-001-F-004 — Plan limits bypassable: template selection has no entitlement wrapper and per-site usage is never counted

Severity: HIGH
Confidence: CONFIRMED

File:
`src/app/api/sites/[siteId]/template/route.ts` (route), `src/features/templates/api/update-site-template.ts` (no limit check), `src/features/monetization/lib/checkLimit.ts` (lines 67-78)

Function:
`PATCH /api/sites/{id}/template` → `updateSiteTemplate()`; `checkLimit()` for `maxPagesPerSite`/`maxLanguages`

Category:
Authorization / Monetization / Business rule enforcement

#### Problem

Two compounding issues:

1. The **initial template-selection** route (`PATCH /api/sites/{id}/template`) calls `updateSiteTemplate` **directly without `withEntitlement`**, unlike the `switch-template`, publish, and generate routes. A free user can select any template regardless of the `maxPagesPerSite = 4` cap.
2. Everywhere `maxPagesPerSite` and `maxLanguages` are checked, `apply(limitKey, limit, 0, amount)` hardcodes `used = 0`, never consulting `usage.pagesPerSite` / `usage.languagesPerSite` (which are computed in `usage.ts` but ignored). So existing page/language usage is never subtracted from the limit.

#### Why It Matters

The free plan's page/language caps — a meaningful part of the monetization boundary between Free and Pro — are effectively unenforced. A free user can accumulate pages beyond the cap. Since monetization/entitlement is the layer that converts product usage into revenue, a limit that passes zero real checks is a business-rule defect, not just a code-style point.

#### How It Can Happen

A free user creates a site, PATCHes the largest template onto it (no check), and the site simply has more pages than the plan allows. Or a free user switches among templates below the cap across repeated edits, accumulating content with no page-count enforcement.

#### Recommended Fix

- Wrap the template-selection route in `withEntitlement({ siteId, limitKey: "maxPagesPerSite", requestedScope: { siteId, amount: template.pages.length } })` (mirroring the switch-template route).
- Fix `checkLimit` so per-site limits compute real usage: for `maxPagesPerSite`, `used = usage.pagesPerSite[siteId] ?? 0`; for `maxLanguages`, `used = usage.languagesPerSite[siteId] ?? 0` (fallback to 1 when the new amount is unset).
- Add a regression note to the test you will eventually write for `checkLimit`.

#### Learning Note

"Who may perform this operation?" is not only about authentication — it includes **entitlement** (which plan tier owns the capacity the operation consumes). When reviewing gated features, trace the *whole* path from route → handler → service, and verify the gate exists on every entry point that can consume the resource, including the first one (creation/selection), not just the loud obvious ones (publish/regenerate).

---

## Medium Findings

### CR-001-F-005 — Invalid `siteId` in a URL path throws an unhandled 500

Severity: MEDIUM
Confidence: CONFIRMED

File:
`src/features/sites/repository.ts`

Lines:
13-15 (also `src/features/monetization/repository.ts` uses `new ObjectId` directly, e.g. line 33)

Function:
`toObjectId(id)` → feeds `getSiteById`/`getSiteForOwner` used by ~15 API routes

Category:
Validation / Error handling / Availability

#### Problem

`new ObjectId("abc")` throws (`input must be a 24 character hex string…` — verified). Any route that receives a non-ObjectId `siteId` path segment (e.g. `GET /api/sites/abc`, `PATCH /api/sites/xyz/content`) will throw out of the handler and produce a 500 HTML error page instead of a clean 401/404 JSON.

#### Why It Matters

- Poor API contract: callers cannot distinguish "not found" from "server failed."
- It is an easy scanner/WAF-bypass signal and a cheap way to fill logs with stack traces.
- Next.js renders the error page and logs the exception on every hit.

#### How It Can Happen

An attacker enumerates IDs (`/api/sites/1`, `/api/sites/abc`, `../../…`), or any client sends a stale/malformed ID.

#### Recommended Fix

Validate `ObjectId.isValid(id)` first and return a 404 JSON body (`{ error: "not_found" }`) for anything unparseable. A small shared helper `parseObjectId(id): ObjectId | null` in the repository layer would centralize it.

#### Learning Note

Path and query parameters are user input. If your persistence layer has a strict type (like a 24-hex ObjectId), *validate the format before* handing the value to the DB constructor — data-type failures should map to 4xx, never leak as 5xx.

### CR-001-F-006 — AI generation is fire-and-forget inside the request handler

Severity: MEDIUM
Confidence: LIKELY

File:
`src/features/generation/api/start-generation.ts`

Lines:
48-51 (also `src/features/regeneration/api/regenerate-site.ts:40-43`, `regenerate-section.ts:43-46`, `switch-site-template.ts:67-70`)

Function:
`startGeneration()` / `regenerateSite()` / `regenerateSection()` / `switchSiteTemplate()`

Category:
Reliability / Architecture

#### Problem

Each endpoint flips the site to `generation.status = "running"` and then fires `void runGeneration(siteId).catch(...)` **without awaiting it**, returning 202. On a serverless platform the function is frozen/terminated once the response is sent, so the generation may never run — leaving the site stuck in `running` forever and silently wasting the user's daily AI quota.

#### Why It Matters

This is the product's core expensive workflow; losing it is a silent failure with no retry surfaced to the user beyond a "stuck" heuristic in the client (`useGenerationPolling` detects >90s and offers retry — papering over the root cause).

#### How It Can Happen

On any ephemeral-runtime host (Vercel functions, Cloudflare Workers, Lambda), a long AI generation started after the handler returns is canceled when the instance winds down. Works by luck on long-lived Node servers; undetermined elsewhere.

#### Recommended Fix

Move generation onto a durable queue/worker (Redis/SQS + worker, or a hosted job), and have the status endpoint read a real job state. Minimum viable interim: run the job on a dedicated long-running Node service and document that this host is a hard deployment requirement (no default-serverless).

#### Learning Note

`void promise` in a request handler is a classic "works in my environment" footgun. Ask: *"What guarantees the task keeps running after this function returns?"* A HTTP handler's lifecycle does not extend to background work — background work needs an explicitly asynchronous infrastructure (queue, cron, event bus).

### CR-001-F-007 — No rate limiting on authentication and other sensitive endpoints

Severity: MEDIUM
Confidence: POTENTIAL

File:
`src/shared/auth/server.ts` (lines 20-27, better-auth options with no `rateLimit`)
`src/app/api/auth/[...all]/route.ts` (catch-all handler)

Category:
Abuse / Authentication brute force / DoS

#### Problem

better-auth ships an in-memory `rateLimit` option; it is not configured. Sign-in, sign-up, and any future password-reset/OTP flows are therefore unlimited. Combined with email/password-only auth, this permits unlimited online guessing and account-creation spam.

#### Why It Matters

- Brute-force / credential-stuffing risk on sign-in.
- Sign-up abuse: unlimited account creation also multiplies free-plan resources the attacker can then consume (sites, AI generations). Since the free plan gives 2 AI generations/day per account, an attacker with accounts-for-days can mint AI spend against your provider API key at scale.

#### How It Can Happen

`curl` a loop of `POST /api/auth/sign-in` with dictionary passwords, or automate thousands of sign-ups.

#### Recommended Fix

Enable better-auth's `rateLimit` (`{ window: …, max: … }` for sign-in/sign-up specifically) and add IP-based limiting on `signup`/`sign-in`. Consider gating paid AI endpoints behind plan-enforced per-account counts (already partially present) plus an IP/secondary cap as defense in depth.

#### Learning Note

Rate limiting is an authorization-side control, not a nicety: for authentication flows it is the difference between "attacker can guess forever" and "attacker can guess N times." List every authenticated-flow endpoint and every expensive public endpoint, then ask whether limiting protects the credential or the wallet.

### CR-001-F-008 — No security headers configured

Severity: MEDIUM
Confidence: CONFIRMED

File:
`next.config.ts`

Lines:
6-8 (config exists but no `headers()`/`poweredByHeader`/CSP)

Category:
Security hardening (defense in depth)

#### Problem

`next.config.ts` does not emit CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, or `Referrer-Policy`. The app *does* serve other people's content (published user sites under `/live`) — albeit currently React-escaped.

#### Why It Matters

- Stored/future rendering bugs become exploitable XSS without a CSP as backstop.
- No `X-Frame-Options`/CSP `frame-ancestors` allows clickjacking of the editor/dashboard.
- No HSTS weakens transport security for a product that deals in user credentials.
- `Referrer-Policy` matters because `businessInfo` and site content flow into URLs and links.

#### How It Can Happen

A future section renders a link from user content that gets clicked while authenticated; or a malicious site iframes the editor to trick the owner into publishing/regenerating.

#### Recommended Fix

Add a `headers()` async config in `next.config.ts` with sensible defaults: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'` for `/live` too), `Referrer-Policy: strict-origin-when-cross-origin`, HSTS behind TLS, and a start→tighten CSP that allows the AI-image CDN domain. `poweredByHeader: false` too.

#### Learning Note

Security headers are cheap insurance that only has to be right once per path your app renders untrusted content. In reviews, check `next.config` for `headers()` the same way you check a Dockerfile for `USER` — absence is a reported gap, not a style preference.

---

## Low Findings

### CR-001-F-009 — `maxImageBytes` only ever checks per-file size; cumulative storage never tracked

Severity: LOW
Confidence: CONFIRMED

File:
`src/features/monetization/lib/checkLimit.ts` (lines 94-95) and `src/features/monetization/lib/usage.ts` (line 43)

Function:
`checkLimit("maxImageBytes", …)`; `getUsageForUser()`

Category:
Business rule enforcement (storage quotas)

#### Problem

`apply(limitKey, limit, 0, amount)` is called with `used = 0` and `amount = fileSize`, so the limit only gates a *single file* against the plan ceiling; total bytes (`usage.largestImageBytes` is hardcoded `0`) never accumulate across uploads. A free user (10 MB cap) can upload hundreds of 10 MB images.

#### Recommended Fix

Actually store image byte totals per site (sum `buildImageKey` upload sizes on `recordImageSlot`, or query S3) and pass `used + amount` into the check.

#### Learning Note

A quota that resets to zero after every use is not a quota. Any time a limit represents a *cumulative* resource (bytes, pages, credits), the accounting must be cumulative too.

### CR-001-F-010 — Gemini API key placed in URL query string

Severity: LOW
Confidence: CONFIRMED

File:
`src/features/generation/lib/ai-client.ts`

Lines:
106-108

Function:
`generateFields()` (Gemini branch)

Category:
Secrets hygiene

#### Problem

`${base}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}` puts the key in the URL. URLs are far more likely to be captured by infrastructure logs, proxies, and error reporters than headers.

#### Recommended Fix

Send the key via the `x-goog-api-key` header (or `Authorization: Bearer <key>`) instead of the query string.

#### Learning Note

Credentials belong in headers, not URLs — URLs travel through more infrastructure (CDNs, access logs, browser histories, referrers) than headers do.

### CR-001-F-011 — TOCTOU allows double-trigger of AI generation

Severity: LOW
Confidence: CONFIRMED

File:
`src/features/generation/api/start-generation.ts`

Lines:
33-45 (read `generation.status`, then two sequential `updateSite` writes)

Function:
`startGeneration()`

Category:
Concurrency / Cost control

#### Problem

The `site.generation.status !== running/queued` guard is a read-then-write pattern. Two concurrent `POST /generate` requests that both read `idle` before either writes will both pass, both flip to `running`, and both launch `runGeneration` — doubling AI cost and content writes. The same pattern exists in the regenerate routes.

#### Recommended Fix

Make the transition atomic — e.g. `findOneAndUpdate({ _id, "generation.status": { $nin: ["queued","running"] } }, { $set: { "generation.status": "queued" } })` and treat a null result (or a second write) as "already running."

#### Learning Note

"Check the flag, then set the flag" is two operations; a second concurrent request can slip between them. For state transitions that must be exclusive, do the check-and-set in a single atomic database operation.

### CR-001-F-012 — Host header used to construct returned live URLs

Severity: LOW
Confidence: CONFIRMED

File:
`src/features/publishing/live-url.ts`

Lines:
6-10 (also 16-23); used at `src/app/api/sites/[siteId]/publish/route.ts:17-20`

Function:
`nextUrl()` / `livePageBaseUrl()`

Category:
Host-header manipulation (minor)

#### Problem

`process.env.NEXT_PUBLIC_SITES_DOMAIN || process.env.VERCEL_URL || host || "localhost:3000"` falls back to the untrusted `Host` header sent by the client. The constructed URL is returned in the publish response body. It is not used for a redirect or security decision, so impact is limited — but an attacker who can influence requests could make the API return a hostile URL to their own browser if the env vars are unset.

#### Recommended Fix

Prefer configured env (`NEXT_PUBLIC_SITES_DOMAIN`, `VERCEL_URL`) and treat `host` as a last resort; or strip any value that is not a known app host.

#### Learning Note

`Host` is attacker-controlled at every layer (HTTP/1.1, `X-Forwarded-Host`). Only use it when you genuinely must resolve the public origin, and never as an input to security decisions.

---

## Informational Findings

### CR-001-F-013 — No automated tests

Severity: INFO
Confidence: CONFIRMED (absence is a fact)

Category:
Testing gap

There is no test runner, and no `test` files exist. The business-critical logic — `checkLimit` (proven buggy here), `mergePageContent` edit-preservation, `publishSite` slug retry, `validateAndSanitize`, `getUsageForUser`, snapshot normalization — has zero regression safety. Given at least one real bug was found in `checkLimit`, the cost of no tests is already being paid. Prioritize tests around: entitlement/limits, content merge (invariant: never silently overwrite user edits), publish/slug uniqueness, and the public pageview flow.

### CR-001-F-014 — Toolchain results (observed)

Severity: INFO
Confidence: CONFIRMED

- `tsc --noEmit`: **PASS** (exit 0). Note: one earlier run reported `TS2345` at `src/features/editor/lib/uploadImage.ts:119` (`PaywallInfo | null` vs `PaywallInfo | undefined`); this was not reproducible after cleaning the incremental build state — flagged here for completeness.
- `next lint`: **PASS** with warnings — `src/features/editor/components/ImageSlotEditor.tsx:5` (`UploadFlowError` imported but unused) and `:7` (`usePaywall` imported but unused).
- `next build`: compilation succeeded; finalize failed `ENOENT .next/server/pages-manifest.json` — classified **ENVIRONMENT FAILURE** (stale `.next` from a concurrently-running dev server, evidenced by `dev-*.log` in the repo root). Re-run with a clean `.next` before annotating a build problem.

---

## What Is Done Well

- **Consistent owner-scoping.** Every site-scoped API path resolves the site through `getSiteForOwner(siteId, session.user.id)` before any read/write (`src/features/sites/api/*`, images, analytics, publishing, generation). No endpoint found that trusts a client-supplied identity. This is the single most valuable property in the codebase.
- **Server-side validation, everywhere.** All mutation bodies pass through Zod `safeParse` with `.strip()` (`src/features/sites/schemas.ts`, `recordImageSlotSchema`, `imageUploadSchema`, `languageChoiceSchema`), and content writes are checked against per-template field constraints including word/char limits.
- **The core invariant is real, not just stated.** `mergePageContent` (`src/features/generation/lib/merge-content.ts:84-97`) explicitly carries `edited` fields through regeneration, and every regeneration path routes through it. This is exactly the "never silently overwrite manual edits" rule.
- **Graceful AI failure handling.** `ai-client` distinguishes timeout/provider/bad-response (`.ts:151-155, 159-163`), `field-validation` retries once and falls back to bilingual placeholders rather than failing the whole site.
- **Image ownership and key hygiene.** Presigned URLs are scoped to `sites/{siteId}/{slotId}/{uuid}.{ext}` and re-validated with `isImageKeyForSite` at record time; MIME type is whitelisted.
- **Idempotent unpublish** (`unpublish-site.ts`) and immutable publish snapshots — unpublishing never destroys the snapshot, and publishing freezes content.
- **Clean layering.** Thin routes → feature functions → repository layer; the site renderer is template-driven and consumes typed content.
- **i18n/RTL done properly.** Arabic is a parallel first-class catalog (`src/messages/ar.json`), `dirFor()` drives RTL, and UI primitives use logical properties — not a translation skin.
- **Secret discipline in source:** `.env`/`.env.local` are gitignored and server-only envs (S3/AI keys) are never forwarded to the client bundle (only `NEXT_PUBLIC_*` values are).
- **Meaningful error taxonomy in AI retries** rather than blanket `catch {}`.

---

## Security Assessment

5 / 10

- **Strong:** authorization model, server-side validation, XSS-safe rendering (React-escaped; no `dangerouslySetInnerHTML`/`eval` anywhere), S3 key scoping, `.env` gitignored.
- **Weak:** committed session token (CR-001-F-001) — critical; no rate limiting (F-007); the public pageview write path (F-003); missing unique indexes that underpin correctness (F-002); no security headers (F-008); API key in query string (F-010).
- **Not yet assessed:** AI prompt injection through `businessInfo` into LLM prompts is a real but out-of-scope research area for this review.

## Architecture Assessment

8 / 10

Feature modules have crisp boundaries; dependency direction is one-way (routes → features → repository/shared); state changes are centralized in the API layer; the renderer is purely declarative over serialized content. Two architectural risk points: (1) fire-and-forget background work inside request handlers (F-006), and (2) `sites` collection documents doubling as both live model and generation work-item state (a durable job store would be cleaner at scale).

## Correctness Assessment

7 / 10

Mostly careful, with genuinely good edge-case handling in content merging and validation. Three real defects: unexecuted indexes (F-002), non-enforcing plan limits (F-004, F-009), and an unhandled invalid-ID path (F-005). Plus a TOCTOU double-generation window (F-011). No evidence of broken async, incorrect state transitions, or corrupted data under normal single-user flow.

## Performance Assessment

7 / 10

No N+1 or unbounded queries in the checked paths; dashboard analytics correctly batches publishes. Notable future risks: `getUsageForUser` scans all sites per entitlement call; analytics aggregation reads *all* pageview rows per site on each dashboard load (fine at MVP volume, will need date-bucketed indexes after the first real traffic); generation concurrency limits are ungoverned beyond the per-site flag.

## Testing Assessment

1 / 10

No tests at all. The `checkLimit` defect and the merge/publish invariants are precisely the kind of logic that is cheap to test and expensive to get wrong in production.

## Maintainability Assessment

8 / 10

Clear naming, small files, consistent conventions, sensible constants and types, honest comments. Minor debt: `update-content.ts` re-implements word counting and constraint checks duplicated in `field-validation.ts`; lint warnings for two unused imports.

## Previous Review Comparison

No previous code review exists (this is CR-001). No `CODE_REVIEW_*` files were present in `DOC/`. Consequently there are no fixed/still-open/regression items; a standardized baseline is being established by this report for future comparison.

---

## Recommended Action Plan

The highest-value fixes, in priority order.

**Priority: P0**

- **Problem:** CR-001-F-001 — live session token committed in `signin.txt`.
- **Action:** Delete file, purge git history, invalidate the session/secret, gitignore the pattern, add a secret-scan step to CI.
- **Expected Benefit:** Removes a bearer credential from every clone and from history permanence.

- **Problem:** CR-001-F-002 — DB indexes never created.
- **Action:** Call `ensureIndexes(await getDb())` in server bootstrap (e.g. `instrumentation.ts`), deploy, verify with `db.collection('sites').getIndexes()`.
- **Expected Benefit:** Slug uniqueness, pageview upsert atomicity, and subscription/membership uniqueness become guarantees instead of assumptions.

**Priority: P1**

- **Problem:** CR-001-F-004 / F-009 — plan limits bypassable and not cumulative.
- **Action:** Wrap the template-selection route in `withEntitlement`; make `checkLimit` consume real per-site usage for pages/languages and cumulative image bytes.
- **Expected Benefit:** Free↔Pro monetization boundary actually holds; discovered bug in entitlement becomes a fixed, tested behavior.

- **Problem:** CR-001-F-006 — generation dies on serverless after response.
- **Action:** Move generation to a durable job/worker; if shipping on a long-running Node host is intended, document it as a hard constraint and add a watchdog that requeues stuck `running` sites.
- **Expected Benefit:** The core AI product works on any host; no silent cost/quota waste.

- **Problem:** CR-001-F-003 / F-007 — unauthenticated write paths and no auth rate limiting.
- **Action:** Add rate limiting to auth endpoints and to public pageview recording; tighten the bot check.
- **Expected Benefit:** Reduces brute-force/cost/DoS surface and restores analytics trust.

**Priority: P2**

- **Problem:** CR-001-F-005 — invalid IDs return 500s.
- **Action:** Validate ObjectId format centrally; return 404 JSON.
- **Expected Benefit:** Clean API contract; no exception log churn.

- **Problem:** CR-001-F-008 — no security headers; F-010 — key in query string.
- **Action:** Add `headers()`/CSP to `next.config.ts`; move Gemini key to a header.
- **Expected Benefit:** Defense-in-depth for user-generated content; less key exposure in logs.

**Priority: P3**

- **Problem:** F-011 TOCTOU double-generation, F-012 host header, F-013 no tests, lint warnings.
- **Action:** Atomic status flip; env-first origin resolution; seed a test suite around `checkLimit`/`mergePageContent`/`publishSite`; clean imports.
- **Expected Benefit:** Fewer surprises under concurrency; regression safety net starts to exist.

---

## Code Review Lessons

- **The strongest defensive design is consistent ownership checks at the service layer.** This codebase does it right across every endpoint; when you review the next project, that single pattern — "derive identity from session, scope every query by owner" — prevents an entire class of IDOR/BOLA bugs.
- **A missing runtime operation (index creation, job execution, rate-limit config) produces bugs that are *silent* until scale.** `ensureIndexes` was written but never called; the publish retry logic assumed it. Reviews should verify that everything a branch depends on actually runs, not just that it exists.
- **Monetization logic is business logic, and business logic needs automated tests.** `checkLimit`'s `used = 0` gap is the kind of bug a 6-line unit test catches in milliseconds and a customer finds in production.
- **Bearer tokens and session dumps belong in a secret manager, not a repo.** `git ls-files` + secret scanning should be a pre-commit/CI gate, and pre-publish reviews should include repo hygiene.
- **"Background" work in a request handler is not background work.** Every `void someAsync()` is a reliability decision that depends on your hosting model; make it explicit.
- **React's default text escaping is your XSS mitigation** — this codebase correctly avoided `dangerouslySetInnerHTML`; keep it that way as the editor/live renderer grows.

### Reviewer Questions To Practice

1. Where does this input come from, and is it validated *on the server* before a write?
2. Is this resource identifier (route param, query string) owned by the authenticated user?
3. Does every entry point that consumes a limited resource pass through the same entitlement gate — including the first one (creation, selection)?
4. Does this unique constraint actually exist at runtime, or is the code only assuming it?
5. What happens if two requests run simultaneously? Is the state flip (e.g. "start generation") atomic?
6. What happens if the AI-provider call fails, times out, or returns garbage? Is there a placeholder/retry path?
7. What happens if this value is `null`, `""`, or an invalid ObjectId? Does the API return 4xx, or explode into a 500?
8. Is this function writing to the database from an unauthenticated or unrate-limited context? Can a stranger hammer it?
9. What guarantees the work continues after this HTTP request finishes?
10. Is a cumulative quota actually cumulative, or does `used` reset logically to zero?
11. Are there committed secrets (session tokens, dumps) that `git ls-files` would surface right now?
12. Does this page render user content, and does every render path keep React escaping (no `dangerouslySetInnerHTML`)?
13. Would another developer understand this six months from now — is the naming/abstraction earning its complexity?

---

## Final Assessment

- Overall Code Health: **6 / 10**
- Security: **5 / 10**
- Architecture: **8 / 10**
- Correctness: **7 / 10**
- Maintainability: **8 / 10**
- Testing: **1 / 10**
- Performance: **7 / 10**
- Review Status: **ORANGE**

The project has a genuinely sound architecture, strong authorization discipline, careful validation, and a clean XSS posture — a better-than-average foundation for a rapid MVP. It is not production-ready yet for three concrete reasons: a committed session token, indexes that are defined but never created, and plan limits that the code claims to enforce but effectively doesn't — compounded by an absence of tests and the reliability risk of fire-and-forget AI generation on serverless hosts. Fixing the four P0/P1 items converts this from "good idea, careful hands, unsafe at scale" into something worth exposing to real users.