# Milestone 01 — Editor Visual Fidelity

## Goal
Make the template render with a **solid, opaque background** that matches the published look, and make the mobile/tablet preview in the editor stay intact (no layout breakage) at small widths.

## Shared context (stated once, for all tasks here)
- **Root of the bugs:** `src/shared/site-render/SiteRenderer.tsx` wraps every section in a `<div className="min-h-full bg-background ...">`. In the editor this is placed inside an outer container that has `bg-paper/60`. The perceived "transparent background" comes from: (1) the renderer wrapper only fills content height and inherits a translucent/paper backdrop in the editor, and (2) at mobile width, fixed-width section layouts (hero grids, service grids, gallery) overflow their container because the fixed `w-[390px]` device shell has no inner scroll.
- The same `SiteRenderer` is used by BOTH the editor (`editMode`) and the live site. Any change must keep both in sync so the editor faithfully previews publish.
- i18n: any new UI chrome uses next-intl keys (en/ar).

## Tasks
1. **01-solid-template-background** — renderer root gets a guaranteed opaque background and correct min-height so the template never looks transparent in the editor and matches publish.
2. **02-mobile-preview-not-broken** — fix overflow/breakage of the template at the `w-[390px]` mobile device width and add a tablet width option.
