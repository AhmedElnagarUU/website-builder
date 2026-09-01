# Milestone 04 — Unpublish + Verification

## Goal

Close the lifecycle: an explicit Unpublish action, correct handling of unpublished/not-live sites on the public route, and an end-to-end verification of the whole publish → serve → edit → re-publish → unpublish flow so the epic can be considered done. Includes `/api/health`-style smoke checks (as referenced by the general instructions) plus the DB's published-state invariants.

## Tasks (execution order)

1. `01-unpublish-api.md` — `POST /api/sites/[siteId]/unpublish` + owner-authorized repository update.
2. `02-end-to-end-verification.md` — verification/health task covering the full publish lifecycle.

## Shared context — published-state invariants (binding)

- `status` transitions: `draft → published` (publish, M01), `published → unpublished` (unpublish, this milestone), `unpublished → published` (re-publish, M01's publish action also sets `status="published"`).
- Unpublish sets `status = "unpublished"` and keeps the last `publishedSnapshot` intact (the owner can re-publish the same version, or publish a newer one, later). It does NOT delete content.
- The public read path (M02 Task 01) already returns `not_live` when `status !== "published"` — so an unpublished site's URL is not served (404 / "not live"), which this milestone verifies.

## Shared context — `/api/health` and build verification

Referenced by the general orchestration rules: `npm run lint && npm run typecheck && npm run build` must pass, and the safe build procedure from `COMPACTION1.md` must be respected (never `npm run build` while dev is running; stop dev → delete `.next` → build → restart → verify `/api/health`). The verification task uses the existing `/api/health` endpoint as a smoke check after any build.

## Definition of Done (shared)

Acceptance criteria pass; `npm run lint && npm run typecheck && npm run build` green; lifecycle invariants hold; Arabic/EN both verified; no new deps; no structural editing surface.
