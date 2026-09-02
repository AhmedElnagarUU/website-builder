# Task — Distinct, actionable upload error states

## Title
Surface specific, actionable errors in the upload popup (including S3/bucket failures)

## Context
Today any upload failure collapses into a single `upload_error` message ("Too large", "Unsupported", "Upload failed" only via file validation). Owners facing an S3/bucket problem (CORS, credentials, region) get a useless generic failure. The popup must distinguish: file too large, unsupported format, network failure, S3/bucket configuration failure, and authorization — with retry.

## Scope
Rework error handling + messaging in `ImageSlotEditor` and the `uploadImage` helper so callers can distinguish failure causes and show specific messages and a retry.

## Technical details
- File(s): `src/features/editor/components/ImageSlotEditor.tsx`, `src/features/editor/lib/uploadImage.ts`.
- Map failures:
  - `unsupported` (validateImageFile) / `too_large` → file-side messages.
  - API errors from `POST /api/sites/[siteId]/image-upload`: `unauthorized`, `not_found`, `unknown_slot`, `unsupported_format`, `config_error` (S3/bucket misconfig) → each a clear message (config_error explicitly: "Image storage bucket isn't reachable / not configured correctly").
  - Browser PUT failure to the presigned URL → "The image storage server rejected the upload — check storage/bucket permissions (CORS)."
  - Final record step failure → network/misc message.
- Add a retry button that re-attempts the last failed step.
- New i18n keys in `en.json` + `ar.json` (RTL-safe). Keep the existing `editor.image.*` key family.

## Dependencies
- M03 task 01 (new popup layout).

## Out of scope
- Fixing the S3/backend cause (deferred). Uploader features beyond popup.

## Acceptance criteria
- Each distinct failure (file size/type, auth, unknown slot, S3 config, bucket PUT/CORS, network) shows its own message.
- A retry re-runs the flow without re-selecting the file.
- EN + AR correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.