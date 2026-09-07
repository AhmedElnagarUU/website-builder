# Task 01 — Publish control in the editor (separate from editing/autosave)

## Context

The editor is where content lives, but the site leaves the editor through an explicit Publish action. This task adds a dedicated, clearly separate Publish control (in the editor's top bar, alongside but visually distinct from the existing editing/saved-state controls), a confirmation step, and a success state showing the live URL. It must never fire from autosave or any editing action.

## Scope

- A `PublishControl` component (client) under `src/features/publishing/components/PublishControl.tsx`.
- Wire it into the editor top bar `src/features/editor/components/EditorShell.tsx`.
- Confirmation dialog, in-flight state, success state with the live URL.

## Technical details

Component behavior:
- Only render the Publish control for sites that have a `templateId` and at least one active language (a site that cannot be published shouldn't offer Publish; the button is disabled with a short hint otherwise).
- **Disable/uncoupled:** the Publish button never auto-fires. It is a manual click → confirmation → `POST /api/sites/[siteId]/publish`.
- Confirmation: a brief confirm step ("Publish your site? Your current version goes live at this URL.") — this is also the re-publish guard (see Task 02): if a snapshot already exists, the confirm explicitly states the live version will be replaced.
- On success: show the live URL (`result.liveUrl`) as an anchor, plus a "Successfully published" message.
- On failure: surface the error from the `422/401/404` response without crashing the editor.
- Reuse the `live-url`/slug from the response; do not reconstruct URLs client-side from env alone.

Placement/styling:
- Add it to the `EditorShell` action area using Epic 05 Monomastic primitives (`Button`, paper/tag styling) — additive styling only; do not disturb the existing language tabs/saved-state/color controls.
- The control must read as **a different, deliberate action** from inline text editing and from autosave's saved/unsaved indicator (visual separation: primary/accent button vs. the muted saved-state pill).

Strings (`publish.*` in BOTH messages files):
- `publish.action` = EN "Publish" / AR "نشر"
- `publish.confirm` = EN "Publish your site now? The current version goes live." / AR "هل تريد نشر موقعك الآن؟ سيتم نشر النسخة الحالية."
- `publish.confirm_btn` = EN "Publish" / AR "نشر"
- `publish.success` = EN "Published" / AR "تم النشر"
- `publish.cancel` = EN "Cancel" / AR "إلغاء"
- `publish.unpublishable_hint` = EN "Finish your content and languages before publishing." / AR "أكمل المحتوى واللغات قبل النشر."
- `publish.open_live` = EN "Open live site" / AR "فتح الموقع المنشور"

## Dependencies

- M01 (`POST /api/sites/[siteId]/publish`), the editor shell (`src/features/editor/components/EditorShell.tsx`), Epic 05 Monomastic primitives.
- M04 Task 01 (unpublish) is not needed for this task.

## Out of scope

- Unpublish UI (M04).
- Unpublished-changes indicator / auto re-publish prompt (Task 02).
- Any icon/structural editing control.

## Acceptance criteria

- [ ] A dedicated Publish control renders in the editor for publishable sites and is disabled (with hint) otherwise.
- [ ] Clicking Publish shows confirmation; confirming calls `POST /api/sites/[siteId]/publish`; success shows the live URL from the response.
- [ ] Publish never fires from autosave or any editing action (verified: no coupling with content PATCH / saved state).
- [ ] Error responses are surfaced without breaking the editor.
- [ ] Monomastic-styled and RTL-correct in `/ar/*`; usable at 375px.
- [ ] All strings come from `en.json` + `ar.json` (values above).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; additive styling only; publishing fully separate from editing; no structural editing surface; no new deps.
