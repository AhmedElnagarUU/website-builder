# Task — Dashboard template gallery page

## Title
Add a dashboard page listing every template with metadata and a visual thumbnail

## Context
There is currently no way in the dashboard to see what template variants the app offers. Owners need to browse template variants (name, category, description, style, accent) so they understand their options.

## Scope
A new authenticated page on the dashboard listing all templates from the catalog, each shown with a real visual thumbnail (task 02), name/description in the current locale, category tag(s), and style. Should link into creation/selection where sensible.

## Technical details
- Files: `src/app/[locale]/dashboard/templates/page.tsx` (page) + a component `src/features/templates/components/TemplateGallery.tsx`; wire a nav/link from the dashboard and site-steps (e.g. the create-wizard template step can link here).
- Source: import the `TEMPLATES` catalog and `rankTemplatesByCategory`/`getTemplate` helpers from `src/features/templates/api/list-templates.ts`.
- Group or tag by category; sort sensibly (suggested first per the owner's category if in a creation context).
- New i18n keys under `templates.*` / `gallery.*` in `en.json` + `ar.json`.
- RTL-safe layout and monomastic styling.

## Dependencies
- Epic 08 (templates have richer metadata + real images). Auth/session + dashboard already exist.

## Out of scope
- The actual thumbnail rendering (task 02). Editor picker (M02). Chosing/creating logic beyond a link.

## Acceptance criteria
- Authenticated owner can open a template gallery and see all 10 templates with name/desc in their locale, category, and accent.
- Arabic shows native translations and RTL layout.
- Empty/unruly states handled; responsive on mobile.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.
