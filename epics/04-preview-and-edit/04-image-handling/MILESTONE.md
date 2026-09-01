# Milestone 04 — Image Handling

## Goal

Let the owner replace the image in any template-defined slot (logo, hero, gallery) via the same tap-to-edit surface as text. Uploads go straight to S3 with presigned PUTs (browser never touches AWS credentials); the site stores an `s3Key` reference per slot. No image is ever hard-deleted from S3 (keeping old ones is fine for MVP); a slot with no upload keeps its template `defaultAsset` (PRD 14.4).

## Tasks (execution order)

1. `01-presign-upload-api.md` — owner-only endpoint returning a presigned PUT URL for a slot + storing the `s3Key` after confirmation.
2. `02-image-slot-ux.md` — uploader modal + crop/reposition + quality warnings wired into the editor's tap-to-edit flow.

## Shared context — IMAGE CONTRACT

Binding for this milestone and Epic 05 public rendering.

### Slot & image shape (already in the model)

- Template `ImageSlot`: `{ slotId, aspectRatio, minWidth, minHeight, defaultAsset }` (from Epic 02 M03).
- Site `images`: `Record<slotId, SiteImage>` where `SiteImage = { s3Key, width?, height?, position?: Position9 }`.
- Renderer (Milestone 01) already shows `defaultAsset` when `images[slotId]` is absent, and emits `onRequestEdit(slotId)` on tap in edit mode.

### S3 conventions (CODE_RULES §7)

- Key pattern: `sites/{siteId}/{slotId}/{uuid}.{ext}`.
- Objects served from bucket public base URL `S3_PUBLIC_BASE_URL`; any consumer (editor preview AND Epic 05 public site) builds the full URL as `S3_PUBLIC_BASE_URL + '/' + s3Key`. The `SiteRenderer` images must therefore resolve this — Milestone 01 stubbed image src with an inert `s3://<key>` placeholder; Task 02 of this milestone replaces it with the real S3 base URL resolution (expose the base via a public constant / prop, not a server-only env read inside the client renderer).
- Env: `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_BASE_URL`.
- Upload endpoint uses `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` (both pre-approved).

### Accepted / rejected uploads

- Accepted formats: `image/jpeg`, `image/png`, `image/webp`. Anything else → rejected with a plain-language message listing the allowed formats (PRD 14.1).
- Max file size per slot: 10 MB (single configured constant).
- Below-min-resolution images (width/height < slot `minWidth`/`minHeight`) are ACCEPTED but the client shows the low-res warning "This image may look blurry when enlarged" (PRD 14.3) — never rejected.

### Lifecycle

`POST /api/sites/:id/image-upload` (owner-only) → validates slot exists in the current template + MIME + returns `{ uploadUrl, s3Key }` (presigned PUT, ~10 min expiry). The browser PUTs the file bytes to `uploadUrl`, then PATCHes `/api/sites/:id/images` with the returned `s3Key` (and optional dimensions/position) to record the slot reference. Until the PATCH, the slot still renders its `defaultAsset` (no dangling broken state).

## Out of scope

- Client-side image cropping/resizing beyond positioning within the slot's fixed aspect ratio (PRD 14.3).
- Deleting objects from S3; gallery reordering; multiple images per slot.
- Image editing in the live/public site (Epic 05 reads the stored `s3Key`, nothing else).

## Definition of Done (shared)

Per task files; browser never sees credentials; unknown/AWS-signed security not logged; both locales verified for the UX strings; `npm run lint && npm run typecheck && npm run build` pass.
