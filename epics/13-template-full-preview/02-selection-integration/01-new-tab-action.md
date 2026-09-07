# Task — New-tab "View template" action

## Title
Add `TemplatePreviewLink` and wire it into all three template cards

## Context
The selection pages currently open the obsolete modal preview. The desired UX is a real website in a new browser tab; the link target already exists from M01 (`/preview/<template.id>`).

## Scope
- New component `src/features/templates/components/TemplatePreviewLink.tsx` (client): an `<a href={\`/preview/${template.id}\`} target="_blank" rel="noopener noreferrer">` labelled with `t("preview.view")`, styled like the current trigger button (mono, bordered, uppercase) so it stays clearly visible. Props: `{ template: TemplateDefinition }`.
- Wire it into every card, replacing the old `TemplatePreview` trigger, and **keep selection debuggable** (the wizard card's select area and the editor picker's apply button remain the only select/apply mechanisms; the link is an additional, distinct action):
  1. `src/features/create-wizard/components/TemplateCard.tsx` — swap `<TemplatePreview …>` for `<TemplatePreviewLink …>` in the card footer.
  2. `src/features/templates/components/TemplateGallery.tsx` — swap in `TemplateGalleryCard`'s footer.
  3. `src/features/editor/components/ChangeTemplateControl.tsx` — swap in the picker card's footer (do NOT nest it inside the apply `<button>`; it is a sibling below it, same structure as today).
- Ensure a click on the link never triggers card selection or template application (safe: it is a sibling anchor).

## Technical details
- Reuse the exact button styling currently used by the old trigger so the visual change is minimal: `rounded-[4px] border-[1.5px] border-ink bg-paper px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-ink transition-colors hover:bg-ink hover:text-paper`.
- `aria-haspopup` is no longer relevant on an anchor; keep `aria-label="preview.open_new_tab"` for AT hint if added.

## Dependencies
- M01 (preview route exists). Current working-tree wiring (modal trigger already in those three files).

## Out of scope
- Removing the modal file/code (task 02). Screenshot work (M03).

## Acceptance criteria
- Each card in the wizard picker, dashboard gallery, and editor picker shows a "View template" action.
- Clicking it opens `/preview/<id>` in a new browser tab (verified by link href + target attributes and manual check).
- Clicking it does not select the template / does not open the create-wizard continue, gallery actions, or editor apply.

## Definition of Done
- `CODE_RULES.md` followed; no new deps; `npx tsc --noEmit` passes; ESLint clean; build verified per the build rule.