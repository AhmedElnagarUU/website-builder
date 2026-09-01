# Task 02 — "Unpublished changes" indicator + re-publish affordance

## Context

Once a site is published, any later edit (content, image, brand, template, regeneration) sets `hasUnpublishedChanges` to `true` on the server. The editor must make that state visible so the owner knows the live site is behind, and make re-publishing an explicit, confirmed action — never a silent overwrite.

## Scope

- Surface `hasUnpublishedChanges` in the editor (a clear indicator distinct from the saved/unsaved autosave state).
- Re-publish affordance: from the "unpublished changes" state, the owner can re-publish (explicit confirm that the live version will be replaced).

## Technical details

Indicator:
- Read `site.hasUnpublishedChanges` from the editor's existing site DTO (no new endpoint). Show a small notice/text near the Publish control only when `hasUnpublishedChanges === true` AND the site is already published (`publishedSnapshot != null`), e.g. "You have unpublished changes — the live site is behind." Style it as a muted tag (Vexo), clearly different from the autosave "Saved/unsaved" pill (that pill reports autosave write status; this reports publish drift).

Re-publish (extends Task 01's Publish control):
- The same Publish control, when `hasUnpublishedChanges === true`, uses a confirmation that explicitly states the live version will be replaced by the current edits (do not overwrite the previous confirm; use a stronger message).
- The re-publish call is the same `POST /api/sites/[siteId]/publish` (M01) — re-publishing writes a fresh snapshot (new `publishedAt`), updates the `slug` only if unchanged, sets `hasUnpublishedChanges=false`, `status="published"`.
- After success, the indicator clears and the live URL/`publishedAt` refreshes.

Strings (`publish.*` in BOTH messages files):
- `publish.unpublished_changes` = EN "You have unpublished changes. The live site is behind." / AR "لديك تغييرات غير منشورة. الموقع المنشور متأخر."
- `publish.republish_confirm` = EN "Republish? Your latest edits will replace the live site." / AR "إعادة النشر؟ ستستبدل أحدث تعديلاتك الموقع المنشور."
- `publish.republish_btn` = EN "Republish" / AR "إعادة النشر"
- `publish.updated_at` = EN "Last published" / AR "آخر نشر"

## Dependencies

- Task 01 (`PublishControl`), M01 (publish endpoint behavior incl. re-publish snapshot write).

## Out of scope

- Unpublish (M04).
- Auto-publish on autosave — explicitly out: the indicator only informs, never triggers publishing.
- Any structural editing control.

## Acceptance criteria

- [ ] The indicator appears only when `hasUnpublishedChanges && publishedSnapshot != null`; it is visually distinct from the autosave saved/unsaved pill.
- [ ] Re-publishing from the indicator uses an explicit confirm stating the live version will be replaced, then calls `POST /api/sites/[siteId]/publish`, clears the indicator, and refreshes `publishedAt`/live URL.
- [ ] The indicator never auto-publishes and never changes on its own due to a timer/autosave.
- [ ] RTL-correct in `/ar/*`; Vexo-styled; all strings from `en.json` + `ar.json` (values above).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; never silent, never auto-publishing; no structural editing surface; no new deps.
