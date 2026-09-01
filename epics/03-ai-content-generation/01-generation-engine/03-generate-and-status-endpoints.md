# Task 03 — Full-site generation & status endpoints

## Context

The wizard's Step 4 needs to kick off generation for every chosen language and poll until done. Inputs must survive any failure untouched (edge case: AI error/timeout → retry without re-entering anything). This task orchestrates client + prompts + validation into the site-level job defined in this milestone's `MILESTONE.md` (job lifecycle, single-flight, success side-effects).

## Scope

Two endpoints (owner-only):

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/sites/:id/generate` | Start async full-site generation; `202` immediately. |
| GET | `/api/sites/:id/generation-status` | Poll: `{ status, error?, localesDone, localesTotal }`. |

## Technical details

Files:

```
src/app/api/sites/[siteId]/generate/route.ts
src/app/api/sites/[siteId]/generation-status/route.ts
src/features/generation/api/start-generation.ts     // validation + state flips + void run()
src/features/generation/run-generation.ts           // the job itself (locales loop)
```

POST guards (in order):
1. Session/ownership (`401`/`404`).
2. `businessInfo.name` non-empty AND category set → else `409 { error:'missing_required_info' }`.
3. `templateId` set → else `409 { error:'no_template' }`.
4. `activeLanguages` non-empty → else `409 { error:'no_languages' }`.
5. `generation.status` is `queued|running` → `409 { error:'generation_running' }`.

Job (`run-generation`, detached via `void`):
- Set status `queued` then `running` with startedAt.
- For each locale in `activeLanguages`: build messages → generateFields → validateAndSanitize → mergeGeneratedContent → write into `content[locale]` after EACH locale completes (partial progress survives a later-locale crash).
- Success: ensure `brandColor` non-empty (template default), `currentStep='editing'`, status `complete`, finishedAt.
- Any thrown error: status `failed` + machine code (`timeout` | `provider_error` | `bad_response`); content written by earlier locales REMAINS (resume-safe), inputs untouched.

GET returns `{ status, error, localesDone, localesTotal }` computed from stored state (count locales whose `content[locale]` has ≥1 field).

## Dependencies

- Tasks 01 + 02 of this milestone.
- `epics/02-site-creation-flow/01-site-data-model/MILESTONE.md`

## Out of scope

- Progress screen UI (Milestone 02).
- Regeneration endpoints (Epic 04 reuses `run-generation` internals).
- Queue infrastructure/workers (explicitly rejected for MVP — see contract).

## Acceptance criteria

- [ ] Happy path: seeded site (name+category+template+both languages) → POST returns `202`; polling shows queued→running→complete; site now has non-empty prose for EVERY template field key in BOTH locales; `currentStep='editing'`.
- [ ] English-only site produces ZERO Arabic content fields (product criterion) — verify no `content.ar` key exists at all.
- [ ] POST while running → `409 { error:'generation_running' }`.
- [ ] Site missing templateId → `409 { error:'no_template' }`; nothing mutated.
- [ ] With an unreachable AI_API_BASE_URL: status becomes `failed` with machine-code error; businessInfo/template/languages identical before/after; retry POST succeeds once provider restored.
- [ ] Timing: single-language run completes <20s against a compliant provider (log duration).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; thin routes; all orchestration in feature module; no new dependencies.
