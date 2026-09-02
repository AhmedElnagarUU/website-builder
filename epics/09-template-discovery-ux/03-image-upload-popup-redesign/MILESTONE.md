# Milestone 03 — Image-Upload Popup Redesign

## Goal
Make uploading/replacing a site image clear and reassuring: a preview of the selected file before upload, honest in-flight feedback, and graceful, specific error messages — including surfacing S3/bucket failures distinctly from other errors.

## Shared context
- `ImageSlotEditor` (`src/features/editor/components/ImageSlotEditor.tsx`) currently shows a bare "upload/replace" button with small error text and always maps upload failure to a generic `upload_error`. The S3 backend may fail for bucket-CORS/env reasons; the popup should say so without pretending the cause is a local file problem.
- The S3 backend defect is **not** fixed in this epic (deferred); only the popup UX/error surfaces improve. Errors map from the API shape (`config_error`, `unauthorized`, `not_found`, `unknown_slot`, `unsupported_format`, and failure of the browser PUT).
- Bilingual EN/AR, RTL-safe.

## Tasks
1. **01-file-preview-and-steps** — show a preview of the selected image + clear upload state (idle/uploading/done), with the position picker.
2. **02-surfaced-error-states** — distinct, actionable error messages (too large, unsupported, network, S3/bucket, authorization) with retry.