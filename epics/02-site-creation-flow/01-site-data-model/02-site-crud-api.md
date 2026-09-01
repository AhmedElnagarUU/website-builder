# Task 02 — Create & fetch site APIs

## Context

Starting the creation journey needs a draft record immediately ("Create website" click), and every wizard screen needs to load the current site's state to resume. This task exposes the two read/write primitives all later steps build on.

## Scope

Two endpoints, both session-required:

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/sites` | Create an empty draft for the signed-in user; returns its DTO. |
| GET | `/api/sites/:id` | Return one site DTO if owned by caller; `404` otherwise. |

## Technical details

Files:

```
src/app/api/sites/route.ts            // POST
src/app/api/sites/[siteId]/route.ts   // GET
src/features/sites/api/create-site.ts // logic used by POST
src/features/sites/api/get-site.ts    // logic used by GET
```

Behavior:
- **POST**: `requireSession` → `401` JSON `{ error: 'unauthorized' }` if none. Creates draft via repository defaults (see Task 01). Returns `201` + DTO.
- **GET**: session → ownership via `getSiteForOwner` → `200` DTO; missing/not-owned → `404 { error: 'not_found' }`.
- Responses are JSON; errors use short machine codes only (`unauthorized`, `not_found`) — never stack traces.
- Route files stay thin: parse params, call feature function, map result to status code.

## Dependencies

- `epics/02-site-creation-flow/01-site-data-model/01-site-schema-and-repository.md`
- `epics/01-foundation/03-authentication/01-better-auth-setup-and-api.md`

## Out of scope

- PATCH/PATCH-style updates (each step's own task adds them: business-info, template, languages).
- Listing sites (Epic 06) and deletion (Epic 06).

## Acceptance criteria

- [ ] Anonymous `POST /api/sites` → `401`. Signed-in → `201` with DTO where `status='draft'`, `currentStep='business_info'`, `generation.status='idle'`.
- [ ] Owner `GET /api/sites/:id` → `200` DTO with string ids.
- [ ] Another user's `GET /api/sites/:id` → `404` (verified with a second account).
- [ ] Unknown id → `404`.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; route files contain no business logic; no new dependencies.
