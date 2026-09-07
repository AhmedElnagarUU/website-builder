# Task — Solid, opaque template background (no transparent look)

## Title
Make the template render with a solid opaque background in the editor and live site

## Context
Users report the template in the editor looks like its background is transparent. In `src/shared/site-render/SiteRenderer.tsx` the whole template is wrapped in `<div className="min-h-full bg-background ...">`. `min-h-full` only equals the parent height if the parent has a defined height; inside the editor the configurable/scrollable frame (`bg-paper/60`) shows through, so the template appears translucent and its true background is unclear. The published site, by contrast, wraps `SiteRenderer` in a `min-h-screen` div with a solid backdrop, so editor and publish look different — that mismatch is the bug.

## Scope
Fix the template background so the rendered site is always visually opaque and self-contained, and confirm the editor shell no longer leaks a translucent paper backdrop behind the template.

## Technical details
- File: `src/shared/site-render/SiteRenderer.tsx` (the root `<div>`), plus `src/app/live/[slug]/[lang]/page.tsx` and `src/features/editor/components/EditorShell.tsx` (their wrapper divs).
- Change the renderer root to render a solid opaque background and a real minimum height (`min-h-screen`-style behavior) rather than depending on a parent height. Keep clipping off so the page can still scroll for long content.
- In `EditorShell.tsx`, the outer preview frame currently uses `bg-paper/60`; make the template area fully opaque (`bg-background`) so nothing behind it shows through. Do NOT change the monomastic page/paper chrome of the app itself — only the template preview surface.
- Must behave identically in editMode and live (single `SiteRenderer`).

## Dependencies
- Epic 04 (Preview & Edit) renderer basics already exist.

## Out of scope
- Multi-page rendering (Epic 08). Do not restructure `template.sections`.
- Changing template typography/layout (Epic 08 design pass).

## Acceptance criteria
- In the editor, the template shows a solid background with no paper/translucency bleeding through, at all device widths.
- The published `/live/[slug]/[lang]` looks pixel-consistent with the editor for the same content.
- No regression in scrolling for long single-page templates (opaque bg present, page still scrolls).

## Definition of Done
- `CODE_RULES.md` read and followed; change is minimal and uses existing structure.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per the repo build rule (stop dev → delete `.next` → build → restart).
