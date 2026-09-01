# Task 02 — MongoDB connection layer & health endpoint

## Context

The product stores everything (users via better-auth, websites, content) in MongoDB. All database access in the codebase goes through one shared connection module so there is exactly one client per process. This task creates that layer plus a health endpoint used to verify connectivity.

## Scope

- Mongo connection singleton in `src/shared/db/client.ts`.
- A tiny index-creation helper `src/shared/db/indexes.ts` with an `ensureIndexes(db)` function that is safe to call repeatedly (later features register their indexes there).
- Health route **`GET /api/health`** (`src/app/api/health/route.ts`). It pings the DB and reports status.

## Technical details

Files:

```
src/shared/db/client.ts      // getMongoClient(): Promise<MongoClient> (cached singleton on globalThis in dev)
src/shared/db/database.ts    // getDb(): Promise<Db> using MONGODB_DB_NAME
src/shared/db/indexes.ts     // ensureIndexes(db): Promise<void>
src/app/api/health/route.ts  // GET handler
```

Behavior:

- Read `MONGODB_URI` and `MONGODB_DB_NAME` from env; throw a clear error if missing.
- Reuse a single `MongoClient` (module-level cache; attach to `globalThis` in development to survive hot reloads).
- `ensureIndexes` must be idempotent (`createIndex` with same options is a no-op if unchanged). Epic 02 will add site indexes by extending this file.
- `GET /api/health` response:
  - DB reachable: `200 { "status": "ok", "db": true }`
  - DB unreachable: `503 { "status": "error", "db": false }` — never crash the route.
- No auth required on health route.

## Dependencies

- `epics/01-foundation/01-project-scaffold/01-initialize-nextjs-project.md` (project scaffold, env vars exist).

## Out of scope

- Any collection schema/repository (Epic 02 onward).
- better-auth's own MongoDB adapter wiring (Milestone 03 — it will consume `getDb()`).

## Acceptance criteria

- [ ] With valid `MONGODB_URI`: `curl http://localhost:3000/api/health` returns `200 {"status":"ok","db":true}`.
- [ ] With an invalid URI: returns `503 {"status":"error","db":false}` without crashing the server.
- [ ] Repeated calls reuse one client (single log/connection pool growth — verified by code review).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; only the already-approved `mongodb` package used.
