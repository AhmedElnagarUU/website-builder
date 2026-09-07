# Task — Screenshot config field and card consumption

## Title
Add `TemplateDefinition.screenshot`, catalog defaults, and screenshot-aware `TemplateThumbnail`

## Context
Real screenshots are a later step. Now we need the *infrastructure*: a place in the template config where a screenshot path is declared, a predictable default so screenshots can be dropped into the repo later with zero component changes, and cards that render the screenshot when present and the SVG thumbnail when not.

## Scope
- **Schema:** add `screenshot?: string` to `TemplateDefinition` (`src/features/templates/types.ts`). Optional so nothing breaks if a template omits it.
- **Catalog:** in `def()` (`src/features/templates/catalog.ts`), default `screenshot: \`/templates/${id}/screenshot.png\`` — a predictable, per-template location. Configurable: a template builder could pass an override later.
- **`TemplateThumbnail`** (`src/features/templates/components/TemplateThumbnail.tsx`): add prop `screenshot?: string`. When provided, render `<img src={screenshot}>` first; `onError` falls back to the existing SVG preview; if that also errors, fall back to the plain name (existing behavior). Keep existing call-signature compatibility (`templateId, name, accent, className` unchanged).
- **Callers:** pass `screenshot={template.screenshot}` from `TemplateCard` (wizard), `TemplateGalleryCard` (dashboard gallery), and the editor picker card in `ChangeTemplateControl.tsx`.
- **Docs:** add a short comment marker (in the thumbnail component or catalog) stating the convention: `public/templates/<template-id>/screenshot.png`, generated from the `/<template-id>` preview page.

## Technical details
- Keep using `loading="lazy"` and `object-cover` for the screenshot just like the SVG; apply `accent` as background color while loading so the card doesn't flash white.
- The fallback set is a state chain: `"screenshot" → "svg" → "name"`. Do not render both images.
- No screenshots are added in this task (explicitly out of scope).

## Dependencies
- Epic 13 M01/M02 (preview + new-tab link exist). The three card components already wired with `TemplatePreviewLink`.

## Out of scope
- Creating final screenshots, automating screenshot generation, updating the editor confirmation thumbnail, altering the SVG preview assets.

## Acceptance criteria
- `TemplateDefinition` exposes `screenshot`; every catalog template yields a `screenshot` value at `/templates/<id>/screenshot.png`.
- `TemplateThumbnail` accepts and renders a configured screenshot; with no file present (current state) each card still renders the SVG thumbnail (verified in the running app: wizard, gallery, editor picker).
- Dropping a file at `public/templates/<id>/screenshot.png` makes the card show it with no code changes.

## Definition of Done
- `CODE_RULES.md` followed; no new deps; `npx tsc --noEmit` passes; ESLint clean; build verified per the build rule.