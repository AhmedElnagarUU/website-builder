# Task — Rendered-site shell

## Title
`TemplatePreviewShell`: render the template as a real standalone demo website

## Context
The whole point of the preview is that it renders the *actual* template UI — layout, typography, sections, images, color — not an SVG or a miniature. The repo already has every piece: `SiteRenderer` renders the full site, and `buildTemplateDemo` supplies realistic bilingual demo content for all pages.

## Scope
- New client component `src/features/template-preview/components/TemplatePreviewShell.tsx`.
- Props: `{ template: TemplateDefinition; activePageId: string }`.
- Renders:
  - `NextIntlClientProvider` around everything with statically imported messages (`src/messages/{en,ar}.json`), `key={locale}` to remount on locale change, `locale` + `dir` on the page wrapper (`dirFor` from `src/shared/i18n/config`).
  - A slim chrome strip above the site (not part of the template): template name, a small "demo preview" badge, the EN/AR toggle, and a "Back to templates" link. All labels via `useTranslations` (new `preview.*` keys) — no hardcoded strings.
  - `<SiteRenderer template locale={locale} pageId={activePageId} content={demo.content} businessInfo={demo.businessInfo} images={{}} brandColor={template.colors.defaultAccent} editMode={false} pageBaseHref={\`/preview/${template.id}\`} />`.
- Demo data via `useMemo`: `buildTemplateDemo(template, locale)` (the returned `content` holds both EN+AR for all pages; recompute `businessInfo` when the locale changes).
- `images={{}}` is intentional: `SlotImage` then renders each slot's real `defaultAsset` (the catalog's real webp images) — no S3, no user images needed.

## Technical details
- Use the app's mono design tokens for the chrome strip (`mono-surface`, `border-ink`, `text-ink`, `font-mono`) so product chrome is visually distinct from the template being previewed.
- The rendered site must not be clipped: normal document flow, the strip on top then the full-site render (container-query responsive).
- `pageBaseHref="/preview/<id>"` makes header/CTA links real URLs (see task 03) rather than hash links.

## Dependencies
- Task 01 (routes). Epic 08 renderer. `demoContent.ts` already in the tree.

## Out of scope
- Page navigation stateful handling (task 03 — this shell renders whatever `activePageId` it is given).
- Rich preview controls like device toggles.

## Acceptance criteria
- The preview shows the real template: hero with real image, accent-colored CTA, services/about/testimonials per the template, footer, correct font pair.
- EN and AR renders both display correctly (RTL flips, Arabic demo copy).
- No edit affordances, no empty-field boxes, no broken images (all slots fall back to `defaultAsset`).

## Definition of Done
- `CODE_RULES.md` followed; no new deps; `npx tsc --noEmit` passes; ESLint clean; build verified per the build rule.