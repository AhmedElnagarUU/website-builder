# Milestone 02 — Diagnose S3 Image Upload Failure

## Goal
Produce a clear, evidence-backed explanation of why the S3 image upload does not work, in a problem doc at `docs/05-problems/`, answering the owner's question: **is the problem in our code or in AWS?** Do **not** fix anything.

## Tasks (execution order)
1. **01-diagnose-s3-upload.md** — investigate + write `docs/05-problems/02-s3-image-upload-broken.md`.

## Shared context (binding for this milestone)
- Full pipeline (from the epic research): `editor/lib/uploadImage.ts` POSTs a ticket → `src/app/api/sites/[siteId]/image-upload/route.ts` (entitlement gating) → `features/images/api/request-image-upload.ts` signs a 10-min presigned PUT → browser PUTs the file directly → `PATCH /api/sites/[siteId]/images` records the slot via `record-image-slot.ts`.
- Two failure surfaces already narrowed:
  1. **Server signing** — `request-image-upload.ts:61-63` `catch { return { ok:false, error:"config_error" } }`; any AWS SDK error here (missing/wrong `S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY`/`S3_BUCKET`, wrong `S3_REGION`, nonexistent bucket) lands here.
  2. **Browser PUT** — `uploadImage.ts:133` `!put.ok` → `"bucket_rejected"`; S3 rejects the presigned PUT, typically bucket policy / CORS that does not allow `PUT` with the app origin + the `Content-Type`.
- Facts: `.env` defines the 4 `S3_*` keys (values exist); `S3_PUBLIC_BASE_URL` is NOT set (this only breaks the client-side `<img>` preview src, not the upload itself). Client PUT sends `body: file` + `Content-Type` only (no ACL header). Free plan >10 MB files are blocked by the paywall *before* S3 is touched (402/`limit_reached`) — that is working as designed, not the bug.
- Only read-only AWS calls are permitted (e.g. `HeadBucket` to confirm bucket/access); **do not PUT/write any object to S3.**
- The owner wants the doc placed at exactly `C:\Users\ahmed\OneDrive\Desktop\website-version2\docs\05-problems\` (next free number after `01-template-images-not-business-accurate.md` → `02-…`).

## Verification (end of milestone)
The doc exists under `docs/05-problems/`, is self-contained, and ends with a sentence the owner can act on: "Root cause is your code / AWS / both." No code, env, or S3 object was modified (git status shows src/ untouched by this milestone).