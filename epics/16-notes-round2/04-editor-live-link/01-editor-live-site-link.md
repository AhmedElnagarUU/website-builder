# Task — Live-Site Link With Eye Icon in Editor Header

## Title
Add a "view live site" link with an eye icon to the editor header, shown only when the site is published.

## Context
The badge `LiveStatusIndicator` tells the user the site is live but is not clickable; `PublishControl`'s transient "Open live site" link disappears on reload. The owner wants a permanent eye link in the editor navbar.

## Scope
1. **`src/app/[locale]/sites/[siteId]/editor/page.tsx`**: read `site.slug` and pass it to `EditorShell` as `slug={site.slug ?? null}` (add to the props object; keep every existing prop).
2. **`src/features/editor/components/EditorShell.tsx`**:
   - Extend the props type with `slug: string | null`.
   - Import `nextUrl` from `@/features/publishing/live-url`.
   - Render a link **immediately before `<LiveStatusIndicator … />`** in the header cluster when `status === "published" && publishedSnapshot !== null && slug`:
     ```tsx
     <a href={nextUrl(slug)} target="_blank" rel="noopener noreferrer"
        title={t("publish.open_live")} aria-label={t("publish.open_live")}
        className="… same pill styling as the header controls …">
       <EyeIcon /> {/* inline SVG, 16-18px, no icon package */}
       <span className="hidden lg:inline">{t("publish.open_live")}</span>
     </a>
     ```
   - The `<span>` label can hide below `lg` to save space; the icon + `title` always present. Use RTL-logical classes (`ms-*`/`me-*`) for the icon/text gap.
3. Keep `LiveStatusIndicator` and all other controls untouched.

## Dependencies
CODE_RULES.md; `live-url.ts` (`nextUrl`); `editor/page.tsx` + `EditorShell.tsx`.

## Out of scope
Changing the live URL scheme; adding any dependency; a "preview draft" link (that's the existing editor canvas); the app navbar.

## Acceptance criteria
1. Published site editor: eye link visible in the header, `href` = `…/live/{slug}` matching `nextUrl`, opens in a new tab; tooltip/aria = `publish.open_live`.
2. Draft/unpublished editor: no eye link (badge still shows not-live).
3. Icon renders in both locales/RTl without misalignment; no new npm package; `publish.open_live` reused (no new message keys).
4. `tsc --noEmit` + `npm run lint` pass.