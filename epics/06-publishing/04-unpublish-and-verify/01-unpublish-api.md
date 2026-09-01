# Task 01 — `POST /api/sites/[siteId]/unpublish` + owner-authorized update

## Context

Bringing the site off the public web is an explicit owner action. This task adds the Unpublish endpoint/function that moves a published site to `status === "unpublished"` while preserving its last `publishedSnapshot` (so it can be re-published later). Unpublishing must be owner-authorized, like every other `[siteId]` route.

## Scope

- A feature function `unpublishSite(siteId: string): Promise<UnpublishSiteResult>` in `src/features/publishing/unpublish-site.ts`.
- A route `src/app/api/sites/[siteId]/unpublish/route.ts` with a `POST` handler.
- Repository update via `updateSite` (`src/features/sites/repository.ts`).

## Technical details

Unpublish function mirrors the publish/update-content auth pattern:

```ts
const session = await getSession();
if (!session) return { ok: false, error: "unauthorized" };
const site = await getSiteForOwner(siteId, session.user.id);
if (!site) return { ok: false, error: "not_found" };
```

Behavior:
- Only a published (or already-published) site can be unpublished. If `site.status !== "published"`, this is idempotent-safe: still return `ok` (the net effect "not live" already holds) — or return `not_found`/no-op, whichever is simplest and least surprising; pick one and document it. (Recommended: treat unpublish as idempotent — setting an already-draft site to `unpublished` is harmless, but do NOT touch `publishedSnapshot`.)
- Persist via `updateSite(siteId, { status: "unpublished" })`.
- **Never delete or mutate `publishedSnapshot`** — it stays so the owner can re-publish the same version. `hasUnpublishedChanges` is left as-is (any edits after the last publish keep it `true`; re-publishing will reset it).

Result type:
```ts
type UnpublishSiteResult =
  | { ok: true; site: SiteDTO }
  | { ok: false; error: "unauthorized" | "not_found" };
```

Route maps: `ok` → `200 { site }`; `unauthorized` → `401`; `not_found` → `404`.

## Dependencies

- M01 (`updateSite`, `getSiteForOwner`, `toSiteDTO`), the `[siteId]` route patterns.

## Out of scope

- The Unpublish UI control (the M03 Publish control may add it, but wiring a button is not this task; this task is backend only).
- Deleting a site or its snapshot.
- Changing the public read path (it already returns `not_live` for non-published sites).

## Acceptance criteria

- [ ] `POST /api/sites/[siteId]/unpublish` sets `status === "unpublished"` and returns the updated DTO.
- [ ] Owner-only: `401` unauthenticated, `404` for non-owner/unknown site.
- [ ] `publishedSnapshot` is preserved (not nulled, not cleared) after unpublish.
- [ ] After unpublish, `getPublishedSiteBySlug` (M02) returns `not_live` for that site's slug.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; owner-authorized; snapshot preserved; no structural editing surface; no new deps.
