# Milestone 02 — Delete Website With Typed Confirmation

## Goal
A user on the dashboard can delete one of their websites, and the delete flow uses a confirmation dialog in which they must type the website's name before the Delete action becomes available — per the note: "when he click delete we do popup say are u sure delete this website and to confirm he copy and paste text to delete it in popup window."

## Tasks (execution order)
1. **01-delete-site-api.md** — `DELETE /api/sites/[siteId]` route handler + `deleteSiteForCurrentUser` feature fn (owner guard + best-effort S3/analytics cleanup).
2. **02-delete-site-dialog.md** — A delete affordance on `SiteCard` + a typed-name confirmation dialog wired to the API.

## Shared context (binding for this milestone)
- "Delete template" in the note means deleting a user's **website** (the note's own wording: "are u sure delete this website"). Product templates are code in `catalog.ts` and are not user-deletable.
- Backend building block: `deleteSite(id)` exists in `src/features/sites/repository.ts:124` but has no callers — wire it up, don't rewrite it.
- Human-owned guard pattern to mirror: `src/features/sites/api/get-site.ts` (`getSession()` → `getSiteForOwner(siteId, session.user.id)` → `ok/unauthorized/not_found`).
- Confirm-dialog visual pattern to mirror: `src/features/publishing/components/PublishControl.tsx` (`fixed inset-0 z-50 bg-black/40` overlay + `mono-surface` card, backdrop click closes). There is no shared Dialog component — build this one in the dashboard feature.
- Cleanup contract: a site's images are `{ s3Key }` under `sites/{siteId}/…` — filter with `isImageKeyForSite(siteId, key)` (`src/features/images/lib/s3.ts`) and delete via `@aws-sdk/client-s3` `DeleteObjectCommand` (already an approved dependency; `createS3Client()` exists). Analytics rows live in the `pageviews` collection keyed by `siteId` ObjectId (`src/features/analytics/repository.ts`).
- Messages: add to **both** `en.json` and `ar.json`. Arabic verbatim below.

## New message keys
```json
"delete": {
  "dialog_title": "Delete this website?",
  "dialog_body": "Deleting <strong>{siteName}</strong> is permanent and can't be undone. Type the site name below to confirm.",
  "dialog_placeholder": "Type the site name",
  "cancel": "Cancel",
  "confirm": "Delete permanently",
  "error": "Couldn't delete the site. Please try again."
}
```
AR (verbatim):
```json
"delete": {
  "dialog_title": "حذف هذا الموقع؟",
  "dialog_body": "حذف <strong>{siteName}</strong> نهائي ولا يمكن التراجع عنه. اكتب اسم الموقع أدناه للتأكيد.",
  "dialog_placeholder": "اكتب اسم الموقع",
  "cancel": "إلغاء",
  "confirm": "حذف نهائيًا",
  "error": "تعذّر حذف الموقع. يرجى المحاولة مرة أخرى."
}
```
Also `dashboard.delete_site` (en: `Delete` | ar: `حذف`) for the card's trigger button (and its `aria-label` = `dashboard.delete_site`).

## Verification (end of milestone)
`tsc --noEmit` + `npm run lint` pass; DELETE returns 401 (no session) / 404 (not owner/unknown) / 200; the dialog blocks deletion until the typed name matches exactly; the site card disappears after successful delete without a full reload of the page shell (server refresh).