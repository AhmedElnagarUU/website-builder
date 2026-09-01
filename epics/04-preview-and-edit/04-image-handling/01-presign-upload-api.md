# Task 01 — Presigned upload + slot reference endpoints

## Context

PRD 14 requires image replacement through the same tap-to-edit interaction as text, with uploads to S3 never exposing credentials to the browser, no partial/broken upload state, and unsupported formats rejected with a friendly message. Two owner-only endpoints cover the flow: one to mint a presigned PUT URL, and one to record the resulting object key on the slot (after the browser finishes the PUT).

## Scope

Two owner-only endpoints:

| Method | Path | Body | Purpose |
|---|---|---|---|
| POST | `/api/sites/:id/image-upload` | `{ slotId, mimeType }` | Validate slot + MIME; return presigned PUT `uploadUrl` + `s3Key`. |
| PATCH | `/api/sites/:id/images` | `{ slotId, s3Key, width?, height?, position? }` | Record the uploaded object reference on the slot. |

## Technical details

Files:

```
src/app/api/sites/[siteId]/image-upload/route.ts   // thin POST
src/app/api/sites/[siteId]/images/route.ts         // thin PATCH
src/features/images/api/request-image-upload.ts     // presign logic
src/features/images/api/record-image-slot.ts        // slot reference logic
src/features/images/lib/s3.ts                        // S3 client + config + constants (MIME set, 10MB, key builder)
```

`request-image-upload`:
1. Session/ownership (`401`/`404`).
2. `template = getTemplate(site.templateId)`; none → `404`.
3. Find the slot: among `template.sections.flatMap(s => s.images ?? [])` match `slotId`. Not found → `422 { error:'unknown_slot' }`.
4. `mimeType` must be in `{ image/jpeg, image/png, image/webp }` → else `422 { error:'unsupported_format' }` (client shows the friendly message).
5. Generate UUID + ext from MIME; build `s3Key = sites/{siteId}/{slotId}/{uuid}.{ext}`.
6. Using `S3_REGION`/`S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY`/`S3_BUCKET`, call `getSignedUrl` with `PutObjectCommand` (`ContentType` = the accepted mime), expiry ~10 min.
7. Return `{ uploadUrl, s3Key }`.

`record-image-slot`:
1. Session/ownership (`401`/`404`).
2. Slot must exist on the current template (same lookup) → else `422 { error:'unknown_slot' }`.
3. `s3Key` must match the `sites/{siteId}/…` prefix (defense: never accept a key outside this site's folder) → else `422 { error:'invalid_key' }`.
4. `position` (optional) ∈ `Position9`; `width`/`height` optional positive ints.
5. Write into `site.images[slotId] = { s3Key, width?, height?, position? }`; apply `hasUnpublishedChanges` rule; return `200` DTO.

## Dependencies

- `epics/04-preview-and-edit/04-image-handling/MILESTONE.md` (contract).
- `epics/02-site-creation-flow/03-template-library/01-template-format-and-seed-library.md` (ImageSlot definition).
- `epics/02-site-creation-flow/01-site-data-model/MILESTONE.md` (repository, ownership, hasUnpublishedChanges).
- Uses pre-approved `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`.

## Out of scope

- The uploader UI (Task 02).
- Cropping/resizing, deleting from S3, low-res handling (Task 02 UX / product rule).
- Serving images (Epic 05 reads stored `s3Key`; base URL from `S3_PUBLIC_BASE_URL`).

## Acceptance criteria

- [ ] Anonymous POST/PATCH → `401`; non-owner → `404`.
- [ ] `{ slotId:'hero_image', mimeType:'image/png' }` → `200` returning an HTTPS `uploadUrl` containing a signed S3 PUT and an `s3Key` like `sites/{siteId}/hero_image/<uuid>.png`.
- [ ] `{ slotId:'hero_image', mimeType:'image/tiff' }` → `422 { error:'unsupported_format' }`.
- [ ] `{ slotId:'no_such_slot', mimeType:'image/png' }` → `422 { error:'unknown_slot' }`.
- [ ] PATCH with the returned `s3Key` → DTO `images.hero_image === { s3Key:… }`; a slot never recorded keeps rendering its `defaultAsset`.
- [ ] PATCH with `s3Key` outside the site folder (e.g. `other-site/file.png`) → `422 { error:'invalid_key' }`.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no AWS keys/credentials logged or returned to the browser; thin routes; no new dependencies beyond pre-approved AWS SDKs.
