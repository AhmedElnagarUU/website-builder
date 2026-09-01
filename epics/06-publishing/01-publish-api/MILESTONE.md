# Milestone 01 — Publish API & Snapshot Creation

## Goal

The explicit Publish action: turn a site's current state into a **published snapshot**, assign it a unique public `slug`, and expose an owner-authorized `POST /api/sites/[siteId]/publish` route. This is the ONLY place a `Site.publishedSnapshot` is written in the entire product, and the only place `status` moves to `published`. Publishing is an explicit action — never triggered by autosave/editing.

## Tasks (execution order)

1. `01-publish-snapshot-and-slug.md` — the `publishSite` feature/repository function: snapshot creation + unique slug assignment + status/flag updates.
2. `02-publish-api-route.md` — the `POST /api/sites/[siteId]/publish` route handler + owner authorization.

## Shared context — DATA CONTRACT (binding for M01 and the whole epic)

The `PublishedSnapshot` written on publish is the real type from `src/features/sites/types.ts` — do not invent a new shape:

```ts
interface PublishedSnapshot {
  templateId: string;
  activeLanguages: Locale[];                       // Locale = "en" | "ar"
  content: Record<Locale, Record<string, ContentField>>;
  images: Record<string, SiteImage>;               // SiteImage has s3Key
  brandColor: string;
  publishedAt: Date;
}
```

The snapshot captures the site **at publish time**:
- `templateId` = `site.templateId` (must be set — a site cannot publish before template + content exist).
- `activeLanguages` = `site.activeLanguages` (the currently active subset).
- `content` = the full per-locale content snapshot: for each `locale` in `activeLanguages`, `site.content[locale]` (`Record<string, ContentField>`).
- `images` = `site.images`.
- `brandColor` = `site.brandColor`.
- `publishedAt` = `new Date()` at publish.

On publish, the site doc also updates:
- `publishedSnapshot` ← the new snapshot.
- `status` ← `"published"`.
- `slug` ← assigned unique slug (first and only writer of `slug`; see Task 01).
- `hasUnpublishedChanges` ← `false` (the freshly published version equals the site).
- `updatedAt` ← now.

Editing as usual (content/image/brand/template/regeneration, per existing APIs) sets `hasUnpublishedChanges` back to `true` via the established `site.publishedSnapshot !== null ? true : site.hasUnpublishedChanges` pattern — unchanged here.

## Shared context — AUTHORIZATION (binding)

Follow the exact pattern of every other `[siteId]` feature route (`src/features/sites/api/update-content.ts`):
`getSession()` from `@/features/auth/lib/session`; if no session return `unauthorized`; `getSiteForOwner(siteId, session.user.id)`; if null return `not_found`. Route maps `unauthorized` → `401`, `not_found` → `404`, validation/success per Task 02.

## Definition of Done (shared)

Acceptance criteria pass; `npm run lint && npm run typecheck && npm run build` green; snapshot matches the contract exactly; no data outside the contract is written; no structural editing surface added; no new deps.
