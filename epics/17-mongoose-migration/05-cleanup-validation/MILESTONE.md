# Milestone 05 — Native Driver Cleanup + Full Validation

## Goal
Finish eliminating native `mongodb` usage from application feature code, migrate the health route to Mongoose, isolate the duplicate-key handling in `publish-site.ts`, and run the full verification pipeline (tsc + lint + build + runtime regression checks). Produce the migration report.

## Tasks (execution order)
1. **01-driver-removal-and-validation.md** — cleanup + validation + report.

## Shared context (binding for this milestone)
- `src/shared/auth/server.ts` imports `getDb` and uses `mongodbAdapter(db)` — DO NOT change.
- `src/shared/db/client.ts` and `src/shared/db/database.ts` remain (justified better-auth boundary). `database.ts` no longer calls `ensureIndexes` (from M01).
- `src/features/publishing/publish-site.ts` imports `MongoError` from `mongodb` and checks `err instanceof MongoError && err.code === 11000` for slug uniqueness retry.
- `src/app/api/health/route.ts` pings via `getMongoClient()`.
- After M01–M04, the only files left importing `mongodb` should be: `shared/db/client.ts`, `shared/db/database.ts`, `shared/auth/server.ts`, `app/api/health/route.ts`, `features/publishing/publish-site.ts`.

## Verification (end of milestone)
- `grep -r 'from "mongodb"' src/` matches ONLY `shared/db/client.ts`, `shared/db/database.ts`, `shared/auth/server.ts`.
- `tsc --noEmit` passes; `npm run lint` passes.
- `npm run build` passes (per the build rule).
- `/api/health` → `{ "status": "ok", "db": true }`.
- Report written. Final status one of: `COMPLETED` / `COMPLETED_WITH_FOLLOW_UP` / `BLOCKED`.