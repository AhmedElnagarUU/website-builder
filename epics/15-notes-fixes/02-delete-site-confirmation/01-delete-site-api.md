# Task — Delete Site API

## Title
Add `DELETE /api/sites/[siteId]` with an owner-scoped feature function and best-effort cleanup of S3 images and analytics rows.

## Context
`deleteSite(id)` in `src/features/sites/repository.ts:124` is dead code today. This task wires it into the existing GET-only `/[siteId]` route and adds the cleanup a real delete needs.

## Scope
- **Route handler** `src/app/api/sites/[siteId]/route.ts`: add an exported `DELETE` function next to `GET`, thin (no business logic): call the feature fn, map `{ ok: true }` → 200, `unauthorized` → 401, `not_found` → 404.
- **Feature fn** `src/features/sites/api/delete-site.ts` (new, mirrors `get-site.ts`): `deleteSiteForCurrentUser(siteId)` that:
  1. `getSession()` from `@/features/auth/lib/session`; no session → `{ ok: false, error: "unauthorized" }`.
  2. Load the site via `getSiteForOwner(siteId, session.user.id)`; missing → `{ ok: false, error: "not_found" }`.
  3. **Best-effort S3 cleanup**: collect `Object.values(site.images).map(i => i.s3Key)` that pass `isImageKeyForSite(siteId, key)`; delete each with `DeleteObjectCommand` + `createS3Client()` from `@/features/images/lib/s3.ts` (`Bucket: S3_BUCKET`), catching+logging errors per object (never fail the request because of S3).
  4. **Best-effort analytics cleanup**: `deleteMany({ siteId: new ObjectId(siteId) })` on the `pageviews` collection (import `ObjectId` from `mongodb`, `getDb` from `@/shared/db/database`).
  5. Delete the site doc with the existing `deleteSite(siteId)`; if it reports `false` (deleted elsewhere), treat as `not_found`.
  6. Return `{ ok: true }`.
- Keep the shape `type DeleteSiteResult = { ok: true } | { ok: false; error: "unauthorized" | "not_found" }`.

## Dependencies
CODE_RULES.md; existing `get-site.ts`, `repository.ts`, `images/lib/s3.ts`, `analytics/repository.ts`.

## Out of scope
Any UI (task 02). Deletion of the user account or subscriptions. Real-time S3 key listing (only delete keys already stored in `site.images`).

## Acceptance criteria
1. `curl` (or PowerShell `Invoke-RestMethod`): without a cookie → 401; with another owner's site id → 404; with the owner's id → 200 `{ "ok": true }` and the doc is gone from MongoDB (`sites` collection).
2. Site images uploaded under `sites/{siteId}/…` are removed from S3 (spot-check one); `pageviews` rows for the site are removed.
3. `tsc --noEmit` + `npm run lint` pass.