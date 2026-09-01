# Milestone 02 — Public Live Renderer

## Goal

Serve the last **published snapshot** of a site as a read-only public website at `src/app/live/[slug]/`, rendered by the existing `shared/site-render` engine (exactly one renderer — never a divergent second implementation) and wrapped in a minimal public HTML shell. English and Arabic are each a first-class URL segment (`/live/[slug]/en`, `/live/[slug]/ar`), not a translation skin.

## Tasks (execution order)

1. `01-get-published-site.md` — the public read path: `getPublishedSiteBySlug` feature function + repository lookup by unique `slug`.
2. `02-live-page-shell.md` — `src/app/live/[slug]/[lang]/page.tsx` layout/pages wrapping `SiteRenderer` in a public HTML shell, plus metadata and the bare `/live/[slug]` locale redirect.
3. `03-live-language-switcher.md` — the first-class per-locale language switcher on the live page (EN ⇄ AR).

## Shared context — what the live page renders (binding)

The live page reads the **published snapshot only** — never the live-editable `content`:
- `publishedSnapshot.templateId` → `getTemplate(...)` (from `@/features/templates/api/list-templates`).
- `publishedSnapshot.content[locale]` → the renderer's `content: Record<string, ContentField>` for that locale (only the snapshot's locale subset is available).
- `publishedSnapshot.activeLanguages` → defines which `/lang` segments are valid.
- `publishedSnapshot.images`, `publishedSnapshot.brandColor` → renderer props.
- `publishedSnapshot.businessInfo` is NOT stored on the snapshot; factual fields (name, phone, email, location) come from the **site's** `businessInfo`. The read path returns both the snapshot and the site's `businessInfo`.

## Shared context — the renderer contract (from `04-preview-and-edit/01-site-render/MILESTONE.md`)

- Render via `SiteRenderer` with `editMode={false}` and no `onRequestEdit`/`renderInlineEditor` (the `SiteEditModeContext` is simply not enabled → no edit affordances, read-only).
- `s3PublicBaseUrl` = `S3_PUBLIC_BASE_URL` so image slots resolve image URLs publicly for unauthenticated visitors.
- Style tokens (`fontPair`, `radius`, `--brand`, RTL via inherited `dir`) are all owned by the renderer — the live page does not restyle the site, it only wraps it.

## Shared context — public read authorization (binding)

The live read path is **public** (no session). It must:
- Look up the site by unique `slug` (respecting the `slug` index).
- Only serve when `site.publishedSnapshot` exists **and** `site.status === "published"`. Otherwise the URL is "not live".
- Return `404`/"not live" for unknown slug, unpublished site, or a locale not in `activeLanguages`.

## Shared context — live URL shape (binding)

Public pages live outside locale-prefixed app routing:
- `/live/[slug]` → redirects to the preferred locale (`/live/[slug]/en`, or a configured default) so the bare URL is always human-friendly.
- `/live/[slug]/en` and `/live/[slug]/ar` → the actual public sites (first-class, distinct URLs, correct `dir`).
- The canonical/public origin is produced by the `live-url` helper from M01 (`NEXT_PUBLIC_SITES_DOMAIN` or request origin).

## Definition of Done (shared)

Acceptance criteria pass; `npm run lint && npm run typecheck && npm run build` green; live page is read-only via `SiteRenderer editMode={false}`; Arabic `/ar` is first-class (never a translation skin); no new deps; no structural editing surface.
