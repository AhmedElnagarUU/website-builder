# Task 02 — End-to-end publish lifecycle verification

## Context

M01–M04 M01 build the publish/live-serving machinery across many files. This final task verifies the whole flow actually works end-to-end, including the `/api/health` smoke check and the safe build procedure, so the epic can be declared done. It is a verification task — write minimal test/smoke checks or curl scripts, not new product features.

## Scope

- Build + health verification per `docs/01-overview/02-final-compaction.md`'s safe procedure.
- Lifecycle smoke test: publish → serve → edit → re-publish → unpublish, in both locales.
- Confirm data/model invariants in the DB.

## Technical details

Safe build + health (mandatory procedure from `docs/01-overview/02-final-compaction.md`):
1. Stop the dev server (kill the port-3000 process).
2. Delete `.next`.
3. Run `npm run lint && npm run typecheck && npm run build`.
4. Restart `start-dev.bat`.
5. Verify `/api/health` returns OK.

Lifecycle smoke test (curl + browser; both locales):
- Create/auth a site via the existing flows (or seed a site directly in the DB for a deterministic test), give it a template + active languages + content.
- `POST /api/sites/[siteId]/publish` → `200` with `slug` + `liveUrl`.
- GET `/live/{slug}/en` → `200`, renders the published content; `/live/{slug}/ar` → `200`, RTL (`dir="rtl"`), first-class Arabic (not an English translation); `/live/{slug}` → redirects to `/en`.
- Edit content → confirm `GET /live/{slug}/en` still serves the **old published snapshot** (live is behind), and the editor DTO reports `hasUnpublishedChanges === true`.
- Re-publish → live serves the new content, `hasUnpublishedChanges === false`.
- `POST /api/sites/[siteId]/unpublish` → `status === "unpublished"`; `GET /live/{slug}/en` returns `not_live`/404; DB `publishedSnapshot` still intact.
- Re-publish again → live returns.

DB invariant checks (via a short script or `mongosh`): after publish `publishedSnapshot` matches latest content; `slug` unique; `status` transitions correct; no structural editing collection/tool was introduced.

## Dependencies

- All of M01–M04 (Task 01), the existing `/api/health` endpoint, existing auth/site flows.

## Out of scope

- Building new features; only verification. Any required UI wiring (e.g. an Unpublish button) belongs to M03 and is out of this task.

## Acceptance criteria

- [ ] Safe build passes (`lint`, `typecheck`, `build`) and `/api/health` returns OK after restart.
- [ ] Full lifecycle (above) passes for `en` and `ar`; live serves only the last published snapshot; unpublished returns not-live ; re-publish restores it.
- [ ] `hasUnpublishedChanges` flips correctly (true after edits post-publish, false after publish/re-publish).
- [ ] DB invariants verified: unique slug, correct status transitions, snapshot preserved on unpublish, no structural editing surface added.
- [ ] No new npm dependencies were introduced anywhere in the epic.

## Definition of Done

Per `CODE_RULES.md`; all acceptance criteria pass; the epic's stated invariants (separate publish/edit, read-only live, first-class RTL, never silent overwrite) proven by the smoke test.
