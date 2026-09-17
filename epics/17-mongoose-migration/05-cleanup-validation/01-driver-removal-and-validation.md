# Task 01 — Remove Remaining Native Imports + Full Validation + Report

## Objective
Migrate the health route to the Mongoose connection, replace the `MongoError instanceof` check in `publish-site.ts` with a dependency-free code guard, verify zero native `mongodb` imports remain in feature code, run the complete validation pipeline, and write the migration report.

## Dependencies
M01–M04 complete.

## Scope

### 1. Health route — `src/app/api/health/route.ts`
- Remove `import { getMongoClient } from "@/shared/db/client"`.
- Import mongoose: `import mongoose from "mongoose"`.
- Replace the ping: `const conn = await mongoose.connection.asPromise(); await conn.db.admin().command({ ping: 1 });` (or equivalent that runs before the catch).
- Response shapes unchanged: `{ status: "ok", db: true }` / `{ status: "error", db: false }` with 503.

### 2. Publish-site duplicate-key guard — `src/features/publishing/publish-site.ts`
- Remove `import { MongoError } from "mongodb"`.
- Add local code-only guard:
```ts
function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: number }).code === 11000;
}
```
- Replace `if (err instanceof MongoError && err.code === 11000)` with `if (isDuplicateKeyError(err))`.
- No other changes to that file (keep `throw lastError` path).

### 3. Native-import audit
- Run `grep -r 'from "mongodb"' src/`. Allowed remaining: `src/shared/db/client.ts`, `src/shared/db/database.ts`, `src/shared/auth/server.ts`. Anything else must be migrated (check also for `import mongoose` correctness rather than stray native import).

### 4. Full validation (run strictly in order; stop on failure)
```
npx tsc --noEmit
npm run lint
```
Then build (build rule): stop any dev server on :3000/:3001 → remove `C:\Users\ahmed\OneDrive\Desktop\website-version2\.next` → run `npm run build` plainly (no piping through Select-Object) → restart via `start-dev.bat` → `GET http://localhost:3001/api/health` must return `{ "status": "ok", "db": true }`.

### 5. Runtime regression spot-checks (dev server on :3001)
- `GET /en` → 200 and `GET /ar` → 200.
- `GET /api/health` → ok.
- Sign-in page `GET /en/auth/sign-in` → 200 (proves better-auth adapter still boots since `getDb()` is exercised on first request).
- Publish path (if a site exists / can be created): confirm publish still returns 200/404 as before (slug uniqueness logic intact). If creating/publishing a site in this environment is not feasible, state explicitly in the report which checks were skipped and why.

### 6. Migration report — `docs/05-problems/03-mongoose-migration-report.md`
Write a concise evidence-based report (mission §24) containing:
## Summary
## MongoDB → Mongoose
- collections migrated (sites, pageviews, subscriptions, memberships, billing, phoneIdentities; read-only `user`)
- models/schemas created (list files)
- repositories changed (list files)
- validation introduced (enums, required fields, defaults)
- legacy data findings (nested `content`/`images` kept as Mixed; `maybeMigrateContent` preserved)
- remaining native usage (better-auth boundary: `client.ts`/`database.ts`/`auth/server.ts`) + reason
## Files Changed
## Validation (actual results — do not claim a check that was not run)
## Risks / Follow-up
## Final Status (one of COMPLETED / COMPLETED_WITH_FOLLOW_UP / BLOCKED)

## Acceptance criteria
- Only the three allowed files import `mongodb` in `src/` (grep proof).
- `publish-site.ts` no longer imports `MongoError`.
- Health route uses the Mongoose connection ping and returns `{ "status": "ok", "db": true }`.
- `tsc --noEmit`, `npm run lint`, `npm run build` all pass.
- Report written with honest validation results.