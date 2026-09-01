# Task 01 — Public read path: `getPublishedSiteBySlug` + repository lookup

## Context

The live pages need a **public** (unauthenticated) way to fetch everything required to render the last published snapshot of a site by its unique `slug`. This is the read-side counterpart to M01's write, and it is the only consumer of the `slug` unique index on the read side.

## Scope

- A feature function `getPublishedSiteBySlug(slug: string): Promise<GetPublishedSiteResult>` in `src/features/publishing/get-published-site.ts`.
- A repository lookup by slug (new method in `src/features/sites/repository.ts`) respecting the unique index.

## Technical details

Repository method (boring and explicit):

```ts
export async function getSiteBySlug(slug: string): Promise<Site | null> {
  const db = await getDb();
  return db.collection<Site>(COLLECTION).findOne({ slug });
}
```

Feature function returns only what the renderer + shell need, and only for published sites:

```ts
type GetPublishedSiteResult =
  | {
      ok: true;
      snapshot: PublishedSnapshot;
      businessInfo: SiteBusinessInfo;   // factual name/phone/email/location for the renderer
      siteId: string;
    }
  | { ok: false; error: "not_found" | "not_live" };
```

Rules (binding, from MILESTONE.md):
- No `getSession()` on this path — it is fully public.
- Look up by `slug`. If no site → `not_found`.
- If `site.publishedSnapshot` is null **or** `site.status !== "published"` → `not_live` (the URL exists but is not live).
- If published, return `{ snapshot: site.publishedSnapshot, businessInfo: site.businessInfo, siteId: site._id.toString() }`.

`getPublishedSiteBySlug` performs the slug lookup + status/snapshot checks and shapes the result. It does not resolve templates or render — that is the page's job (Task 02).

## Dependencies

- `src/features/sites/repository.ts`, `src/features/sites/types.ts`.
- M01 (`slug` now populated on publish).

## Out of scope

- The page/route that renders from this result (Task 02).
- The language switcher (Task 03).
- Any editing path or auth on the read side.

## Acceptance criteria

- [ ] `getPublishedSiteBySlug` returns `not_found` for an unknown slug and `not_live` for an existing slug whose snapshot is null or whose `status !== "published"`.
- [ ] A published site returns the snapshot + `businessInfo` + `siteId` with no session required.
- [ ] The repository lookup uses the unique `slug` index and returns the full `Site`.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; read path is public and never exposes the editable `content` (only the snapshot); no new deps.
