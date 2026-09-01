# Task 01 — `publishSite` feature function: snapshot creation + unique slug assignment

## Context

Publishing is the single place the product writes `Site.publishedSnapshot` and moves a site to `status === "published"`. This task implements that function plus the unique `slug` assignment, which is currently never written anywhere in the codebase even though a unique index on it already exists (`src/shared/db/indexes.ts`). The API route that calls this function is a separate task.

## Scope

- A new feature module `src/features/publishing/publish-site.ts` exposing `publishSite(siteId: string): Promise<PublishSiteResult>` (one responsibility: freeze the current site into a published snapshot and persist it).
- A repository method for the snapshot write (either a new method in `src/features/sites/repository.ts` or a small scoped query, at your discretion — keep it boring and in the owning feature where it belongs).
- Unique slug generation + persistence using the existing `slug` unique index.

## Technical details

Auth + ownership first (mirror `update-content.ts`):

```ts
const session = await getSession();
if (!session) return { ok: false, error: "unauthorized" };
const site = await getSiteForOwner(siteId, session.user.id);
if (!site) return { ok: false, error: "not_found" };
```

Validation before snapshotting:
- `site.templateId` must be present, and it must resolve via `getTemplate(site.templateId)` (from `@/features/templates/api/list-templates`) — otherwise `not_found`.
- `site.activeLanguages` must be non-empty — publish with zero active locales is invalid (return a `validation_error`).

Snapshot construction (see MILESTONE.md contract — exact shape, no invented fields). Then persist atomically via `updateSite(siteId, patch)` where `patch` is:

```ts
{
  publishedSnapshot: snapshot,
  status: "published",
  slug,                    // see below
  hasUnpublishedChanges: false,
}
```

Slug generation (first and only writer of `Site.slug`):
- Base = slugify of `site.businessInfo.name` (lowercase, trim, non-alphanumerics → `-`, collapse repeats, trim `-`). If empty/short, fall back to a fixed token like `site`.
- Append a short unique suffix (e.g. 6-char base36 from `crypto.randomUUID()`).
- **Collision handling:** because `slug` has a unique index, attempt the `updateSite` and on a duplicate-key error retry with a fresh suffix (bounded retries, e.g. 3). Slug is assigned at publish, not at creation.

Result type (`PublishSiteResult`):
```ts
type PublishSiteResult =
  | { ok: true; site: SiteDTO; slug: string }
  | { ok: false; error: "unauthorized" | "not_found" | "validation_error" };
```

Return `toSiteDTO(updated)` from `@/features/sites/repository.ts`.

Translation of `toSiteDTO`: `publishedSnapshot.publishedAt` is a `Date` — the `PublishedSnapshot` type stores it as `Date` (server-side) and the DTO passes it through; no ISO-string conversion of the snapshot is needed (it already flows through `toSiteDTO` unchanged). Keep it consistent with how the rest of the DTO treats `Date` fields.

## Dependencies

- `epics/02-site-creation-flow/01-site-data-model/*` (Site model, repository, `toSiteDTO`).
- `epics/03-ai-content-generation/*` and `04-preview-and-edit/*` (content/template/brand/images already editable and populated).
- `src/shared/db/indexes.ts` (existing unique `slug` index).

## Out of scope

- The HTTP route (Task 02).
- Any unpublish logic (M04).
- Editing/autosave behavior, or any change to how other APIs set `hasUnpublishedChanges`.

## Acceptance criteria

- [ ] `publishSite` authorizes the owner (`getSession` + `getSiteForOwner`), returning `unauthorized`/`not_found` correctly.
- [ ] A valid site persists a `publishedSnapshot` exactly matching the contract, sets `status === "published"`, assigns a unique `slug`, and sets `hasUnpublishedChanges === false`.
- [ ] Missing/irresolvable `templateId` or empty `activeLanguages` returns `validation_error`/`not_found` without writing a snapshot.
- [ ] Slug is unique and collision-safe against the unique index (retry on dup key).
- [ ] `update-site.ts`, `update-content.ts`, etc. behavior is untouched; editing after publish still flips `hasUnpublishedChanges` back to `true`.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no new deps; no structural editing surface; data shape matches `PublishedSnapshot` verbatim.
