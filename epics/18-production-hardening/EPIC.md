# Epic 18 — Production Hardening

## Purpose
Make the MVP production-ready: fix reliability issues, add observability, improve deployment, and eliminate single points of failure.

## Why This Epic Matters
An MVP that works in development is not production-ready. This epic addresses the gaps between "it works" and "it can be deployed and operated safely at scale." The project currently has:
- Generation jobs that can get stuck at `"running"` status (no top-level error handling)
- A database connection race condition (no locking on singleton initialization)
- No tests (zero regression protection)
- A `zod` dependency not declared in `package.json` (fragile transitive dependency)
- Analytics queries that load all data then filter in JavaScript (unbounded read)
- No containerization or deployment automation
- No structured logging or monitoring

## Scope Boundaries

### In Scope
- Fix generation job lifecycle (add try/catch + status recovery)
- Fix DB connection race condition (add initialization guard)
- Declare `zod` as an explicit dependency
- Fix analytics query (filter in MongoDB aggregation, not JS)
- Add Dockerfile for containerized deployment
- Add structured error logging at API boundaries

### Out of Scope
- Epic 12 (Super Admin) — separate epic
- Epic 19 (Testing) — separate epic
- Custom domain support (V1.1 per PRD)
- Real-time analytics
- Advanced caching strategies
- CI/CD pipeline setup (beyond Dockerfile)

## Dependencies
- Epic 17 (MVP Stabilization) must be complete

## Tasks (in execution order)

### T01 — Fix Generation Job Lifecycle
**Classification:** HARDENING
- **Evidence:** `src/features/generation/run-generation.ts` has no top-level try/catch; an early throw leaves `generation.status="running"` indefinitely
- Wrap the generation body in try/catch
- On any error: set `status: "failed"` with error message + `finishedAt` timestamp
- Add timeout handling (the AI client already has 180s timeout, but ensure it's caught)
- **Acceptance:** Any error during generation results in `status: "failed"` with error details, never stuck at `"running"`
- **Validation:** Mock/force an AI provider error, verify status transitions to failed

### T02 — Fix DB Connection Race Condition
**Classification:** HARDENING
- **Evidence:** `src/shared/db/client.ts` uses `globalThis` caching without a lock; concurrent requests can trigger multiple `client.connect()` calls
- Add an `initializing` flag or mutex pattern to `getMongoClient()`
- Ensure only one connection attempt happens at a time
- **Acceptance:** Concurrent requests during cold start don't trigger duplicate connections
- **Validation:** Review code for race pattern; add stress test if testing infra exists

### T03 — Declare `zod` in package.json
**Classification:** INFRASTRUCTURE
- **Evidence:** `zod` is used throughout the codebase but only available transitively via `better-auth`; not in `package.json` dependencies
- Add `"zod": "^3"` to dependencies (check actual version in use)
- **Acceptance:** `zod` is an explicit dependency; removing `better-auth` wouldn't break `zod` imports
- **Validation:** `npm ls zod` shows direct dependency

### T04 — Fix Analytics Query Design
**Classification:** PERFORMANCE
- **Evidence:** `src/features/analytics/api/get-site-analytics.ts` loads ALL pageview days then filters in JS; ignores `fromDate`/`toDate` parameters
- Modify `listSitePageviewDays` to accept and filter dates at the MongoDB level
- Fix 31-day vs 30-day window inconsistency
- **Acceptance:** Analytics queries filter at the database level; date parameters respected
- **Validation:** Code review + verify date filtering works with test data

### T05 — Add Dockerfile
**Classification:** INFRASTRUCTURE
- Create a multi-stage Dockerfile for the Next.js app
- Include: Node.js base, dependency installation, build, production serve
- Reference `next.config.ts`, `package.json`
- **Acceptance:** `docker build .` produces a working image; `docker run` serves the app
- **Validation:** Build and run the container, verify `/api/health`

### T06 — Add Structured Error Logging
**Classification:** OBSERVABILITY
- Add error logging at API route boundaries (catch + log unhandled errors)
- Log generation failures with context (siteId, error type)
- Log monetization/gate failures with context (userId, planId, limitKey)
- **Acceptance:** Errors are logged with sufficient context to diagnose; console.error statements are structured
- **Validation:** Review logging output during manual testing

## Acceptance Criteria (Epic Wide)
- Generation jobs never get stuck at `"running"`
- DB connection is thread-safe under concurrent load
- `zod` is a declared dependency
- Analytics queries are bounded and efficient
- Application builds in Docker
- Errors are logged with structured context

## Validation
1. `npm run lint` + `npx tsc --noEmit` pass
2. Generation error path sets status to "failed"
3. `npm ls zod` confirms direct dependency
4. Analytics date filters work correctly
5. Docker build + run succeeds, health endpoint responds
6. Error logs contain structured context

## Risks
- DB connection fix may introduce deadlock if not implemented carefully
- Docker setup may need platform-specific adjustments
- Analytics query changes may affect existing data shape

## Expected Outcome
The application is production-ready: reliable, observable, and deployable via container.
