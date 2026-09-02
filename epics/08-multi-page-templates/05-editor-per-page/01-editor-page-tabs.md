# Task — Editor page tabs and per-page working state

## Title
Add a page selector to the editor and switch working content to per-page

## Context
With multi-page templates, the editor must let the owner pick a page (Home, About, Services, Contact, …) and edit that page, instead of scrolling one merged page.

## Scope
Add a page tab/selector to the editor header, maintain per-page working content, and render only the active page (via the M03 renderer change). Nav link labels are edited once at site scope.

## Technical details
- Files: `src/features/editor/components/EditorShell.tsx`, plus optionally a small `src/features/editor/components/PageTabs.tsx`.
- Source page list from `template.pages`; add order + labels from `page.name[appLocale]`.
- Working content becomes `Record<pageId, Record<locale, Record<fieldKey, ContentField>>>`; switching page updates the renderer's `pageId`.
- Click-to-edit and image-slot editing operate on the active page's content.
- Keep the LanguageTabs behavior (per locale) orthogonal to page selection.
- Nav-label fields (nav_home/nav_about/…) remain site-scope; edit them on the Home/top-level chrome and persist once.

## Dependencies
- M03 task 01 (renderer accepts pageId). M01 types. Epic 07 (indicator + navbar).

## Out of scope
- Save network logic (M05 task 02). Generation (M02). Template picker (Epic 09).

## Acceptance criteria
- Selecting a page shows header (with active nav) + that page's sections + footer; switching pages changes the body only.
- Editing text/images on a page updates that page's working content; switching away and back retains it.
- EN + AR (RTL) correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.
