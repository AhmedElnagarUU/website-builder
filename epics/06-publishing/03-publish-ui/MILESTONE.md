# Milestone 03 — Publish UI in the Editor

## Goal

Surface publishing as a **genuine, separate action** in the editor, clearly distinct from inline editing/autosave. The owner sees a dedicated Publish control, a confirmation step, the resulting live URL, and a clear "you have unpublished changes" state that invites an explicit re-publish. Visual styling uses the Monomastic foundation (Epic 05) as an additive layer; behavior is additive only.

## Tasks (execution order)

1. `01-publish-control.md` — the dedicated Publish control + confirmation + live-URL success state.
2. `02-unpublished-changes-indicator.md` — the "unpublished changes" indicator + re-publish affordance.

## Shared context — product invariants (binding)

- **Publishing and editing are separate actions.** The Publish control is a deliberate, separate control — never conflated with autosave, and never auto-fired by it.
- **Never silently overwrite published content.** Re-publishing is always an explicit, confirmed action.
- **No structural/drag-and-drop editing surface** — the Publish UI only freezes/publishes; it adds no move/add/delete.
- The editor already tracks `hasUnpublishedChanges` on the site DTO (server sets it to `true` on any edit after a snapshot exists, and `false` on publish). The UI surfaces this state; it does not decide it.

## Shared context — how the UI talks to the backend

- Publish: `POST /api/sites/[siteId]/publish` (M01) → `200 { site, slug, liveUrl }`.
- Unpublish: `POST /api/sites/[siteId]/unpublish` (M04, Task 01) → used by the re-publish/state flow.
- The site DTO (`SiteDTO`) already carries `status`, `slug`, `publishedSnapshot` (nullable), and `hasUnpublishedChanges` — no new read endpoint needed; the editor's existing site fetch is sufficient.

## Shared context — strings

All new user-facing strings come from next-intl. Add each key to **BOTH** `src/messages/en.json` and `src/messages/ar.json`, prefixed under `publish.*` (Arabic translations are provided in each task — use them verbatim).

## Definition of Done (shared)

Acceptance criteria pass; `npm run lint && npm run typecheck && npm run build` green; behavior additive + separate from editing; Monomastic-styled; RTL-correct; no structural editing controls; no new deps.
