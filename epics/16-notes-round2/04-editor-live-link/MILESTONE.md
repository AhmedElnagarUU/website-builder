# Milestone 04 — Editor Navbar Live-Site Link

## Goal
The editor navbar (header) shows a link with an **eye icon** that opens the published website in a new tab whenever the site is published — covering both note lines ("editor navbar have live link to see the published website" and "…with eye icons", which are the same story).

## Tasks (execution order)
1. **01-editor-live-site-link.md** — Thread `slug` into the editor and render the eye-icon live link.

## Shared context (binding for this milestone)
- The editor's `<header>` cluster is in `src/features/editor/components/EditorShell.tsx` (lines ~222-265); every element is a client component. Order today … `LiveStatusIndicator` → `PublishControl` → `DeviceToggle`.
- `EditorShell` props come from `src/app/[locale]/sites/[siteId]/editor/page.tsx` (server): it has `site` (via `getSiteForOwner`) incl. `slug`, `status`, `publishedSnapshot` — but **`slug` is currently NOT passed to the shell**. Add it.
- Live URL builder: `src/features/publishing/live-url.ts` → `nextUrl(slug, pageSlug?, host?)` returns `${origin}/live/${slug}` (origin from `NEXT_PUBLIC_SITES_DOMAIN`/`VERCEL_URL`/host fallback). It is a pure client-safe function — import and reuse it, do NOT reimplement.
- Show the link only when the site is actually published: `status === "published" && publishedSnapshot !== null && typeof slug === "string" && slug.length > 0`. Otherwise render nothing (the existing `LiveStatusIndicator` already communicates the not-live state).
- No new npm deps — the eye icon is an inline SVG (eyeball: `<path>` for the eye + iris circle), 16–20px, mono-stroke style matching the header.
- Reuse the existing message key `publish.open_live` (en "Open live site" / ar "فتح الموقع المنشور") as label + `title`/`aria-label`. No new key.

## Verification (end of milestone)
A published site's editor shows the eye link; it opens `…/live/{slug}` in a new tab; a draft/unpublished site shows no link. `tsc` + `lint` pass, both locales.