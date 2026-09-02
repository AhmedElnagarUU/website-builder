# Task — Upload popup: file preview and clear steps

## Title
Show a live preview of the selected file and a clear upload state in the image popup

## Context
The current popup shows a button and, once uploading, a generic label. Owners want to see the file they selected, know it's uploading, and see it succeed — plus keep the existing position picker and low-res warning.

## Scope
Upgrade `ImageSlotEditor`'s modal: after choosing a file, show a local preview (thumbnail) of it with its name/size; show idle → uploading → done phases; on success show the uploaded thumbnail (from S3 URL) and the position control; keep the replace/upload flow.

## Technical details
- File: `src/features/editor/components/ImageSlotEditor.tsx`.
- Use `URL.createObjectURL(file)` for the local preview (revoke on cleanup), or the existing uploaded image via `s3Key`.
- Keep `validateImageFile` + `uploadImage` from `src/features/editor/lib/uploadImage.ts` (no backend change).
- Add phase copy and aria states; new i18n keys for phases in `en.json`/`ar.json`.
- RTL-safe layout; matches vexa tokens.

## Dependencies
- Epic 07 (solid preview surface). Existing `uploadImage` client helper.

## Out of scope
- Backend S3 fix (deferred). Error message differentiation (task 02).

## Acceptance criteria
- Picking a file shows a local preview + name/size; uploading shows a spinner/progress phase; success shows the uploaded thumbnail.
- Replacing an existing image works the same as today (position picker + low-res warning preserved).
- EN + AR correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.