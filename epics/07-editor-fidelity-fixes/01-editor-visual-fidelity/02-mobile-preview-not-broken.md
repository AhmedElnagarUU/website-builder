# Task — Mobile / tablet preview in the editor is not broken

## Title
Fix the template breaking in mobile (and add tablet) preview width in the editor

## Context
The editor has a device-width toggle (`DeviceToggle`, modes: desktop/mobile → `src/features/editor/components/DeviceToggle.tsx`) that wraps the preview in a fixed-width shell (`w-[390px]` for mobile in `EditorShell.tsx`). At that narrow width the template's fixed layouts (hero, service grids, galleries) overflow horizontally and break, so the user can't see what the site will really look like on a phone.

## Scope
Make the template lay out correctly inside the mobile preview shell (no horizontal overflow, readable columns) and add an explicit tablet width option.

## Technical details
- File(s): `src/features/editor/components/EditorShell.tsx` (device shell + width logic), `src/features/editor/components/DeviceToggle.tsx` (add `tablet` mode), and the responsive section components under `src/shared/site-render/sections/*` if they lack mobile breakpoints (Tailwind `sm:`/`md:`).
- Give the device shell a solid background and allow internal vertical scrolling per device width (so the page can be inspected like a real phone/tablet) without horizontal overflow.
- Ensure grids/flex layouts collapse to single/two columns at small widths via existing Tailwind responsive prefixes. Do not hardcode pixel widths on the template body.
- Extend `DeviceMode` to `"desktop" | "tablet" | "mobile"` and wire widths (e.g. `md:[1024px]`, mobile `390px`), with i18n labels for the toggle.

## Dependencies
- `01-solid-template-background` (opaque preview surface) in this milestone.

## Out of scope
- Navbar mobile menu (Milestone 02). Grid collapse is in scope; menu behavior is not.
- Any structural/drag-and-drop editing surface (permanent invariant — none may be added).

## Acceptance criteria
- Switching to mobile shows the full template usable at ~390px with no horizontal scrollbar and no clipped columns.
- Tablet mode (~768px) also renders cleanly.
- Desktop mode unchanged.
- Both EN and AR (RTL) render correctly at all three widths.

## Definition of Done
- `CODE_RULES.md` read and followed; uses Tailwind responsive utilities, no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.
