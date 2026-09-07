# Milestone 01 — Preview Route (`/preview/<templateId>/…`)

## Goal
Any catalog template can be opened at a public URL and rendered as a complete, standalone website: the actual `SiteRenderer` with realistic bilingual demo content, real default images, the template's accent color, responsive container-query layout — and natural path-based navigation across all of the template's pages. The preview is fully isolated from the template-selection UI.

## Tasks (execution order)
1. `01-public-preview-routes.md` — middleware exemption + `/preview/[templateId]/[[...slug]]` route, SSG params, metadata.
2. `02-rendered-site-shell.md` — `TemplatePreviewShell` client component rendering the demo site (content, images, brand color, backdrop).
3. `03-navigation-and-locale.md` — multi-page path navigation + EN/AR toggle with RTL.

## Shared context (binding for this milestone)

- **Reuse, don't duplicate:** `SiteRenderer` (`src/shared/site-render/SiteRenderer.tsx`) renders the whole site given `{ template, locale, pageId, content, businessInfo, images, brandColor, editMode:false, pageBaseHref, onNavigatePage? }`. `buildTemplateDemo(template, locale)` (`src/features/templates/lib/demoContent.ts`) returns `{ content: SiteContent, businessInfo }` — the `content` already contains **both** locales for **all** pages; `businessInfo` is localized per call.
- `pageBaseHref` drives header/CTA anchors. Set it to `/preview/<templateId>` so nav links become real cross-page URLs (see task 3). With `editMode={false}` the renderer outputs real anchors (no edit affordances) and `SlotImage` renders `defaultAsset` when the images map has no entry for a slot — pass `images={{}}`.
- Public-route convention: `src/middleware.ts` must call `NextResponse.next()` for `firstSegment === "preview"` exactly like it does for `live`, otherwise next-intl (`localePrefix: "always"`) will redirect `/preview/...` to `/[locale]/preview/...`.
- Message namespaces live in `src/messages/en.json` / `ar.json`. The preview shell wraps itself in `NextIntlClientProvider` with statically imported messages (pattern from `src/features/publishing/components/LiveSitePage.tsx`).
- Locale type: `"en" | "ar"` (`src/features/sites/types.ts`). `dirFor(locale)` in `src/shared/i18n/config.ts`.