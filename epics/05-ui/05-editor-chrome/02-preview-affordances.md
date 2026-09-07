# Task 02 — Preview affordances restyle (empty placeholders + review badges + tap/edit visuals)

## Context

Inside the editor preview, the renderer (Epic 04 M01) already emits edit-mode affordances: empty optional fields render a localized dashed "Empty — tap to fill" placeholder, and `reviewFlagged` fields get a small "AI suggested — review this" badge. Tap-to-edit (M02) opens an inline editor. This task restyles those affordances and the inline edit surface to the Monomastic language. Renderer behavior, edit flow, and autosave are untouched.

## Scope

- Restyle the dashed empty-placeholder block ("Empty — tap to fill") in editor mode — a clear, paper-tinted call-to-fill target.
- Restyle the `reviewFlagged` "AI suggested — review this" badge — a small `TapeTag`-style marker with a distinct muted/hand-note treatment.
- Restyle the inline text-edit surface (popover/editor) and image-slot UX affordances (uploader modal framing, crop/reposition chrome) to the same token language.
- Do NOT add structural controls (no move/add/delete) — permanent product out-of-scope.

## Technical details

Files (restyle components from Epic 04; the renderer affordances live in `shared/site-render`, the edit UI in `features/editor`):

```
src/shared/site-render/... (empty-placeholder + reviewFlagged badge styling)
src/features/editor/components/ (TextEditPopover / inline editor framing)
src/features/editor/components/ (ImageSlotUx / uploader modal framing)
```

Mapping:
- Empty placeholder: dashed `--rule`/ink border block, `ink-3` text, warm hover (paper fill) that telegraphs "tap to write here".
- Review badge: `TapeTag`-style (translucent yellow, slight blur, small) reading "AI suggested — review this" (existing `editor.*` string reused; localized).
- Inline editor: paper panel over the preview (M02 `Card`/`StickyNote`), Caveat body for the editable text within the preview, clear Done/“saved” indicator; the user's own edits are visibly distinct from AI text (the renderer's existing edited/plain distinction styled accordingly).
- Image slot: uploader/crop chrome wrapped in paper panels with the same tokens.

## Dependencies

- `epics/04-preview-and-edit/01-site-render/*`, `02-text-editing/02-tap-to-edit-ui.md`, `03-brand-color-customization.md`, `04-image-handling/02-image-slot-ux.md`.
- `epics/05-ui/02-shared-component-set/*` (M02 primitives).

## Out of scope

- Changing renderer behavior, the edit-mode contract, autosave, or image upload flow.
- Adding structural/drag-and-drop editing controls (permanently out of product scope).
- Restyling the editor top bar (Task 01).

## Acceptance criteria

- [ ] Empty fields show a clear, tappable "Empty — tap to fill" placeholder; `reviewFlagged` fields show the localized "AI suggested — review this" badge; both are styled, not just default.
- [ ] Inline edit surface is paper-styled, shows saved state, and clearly distinguishes user-edited text from AI text.
- [ ] Image-slot uploader/crop chrome is framed consistently with the same tokens.
- [ ] No structural editing controls introduced or revealed.
- [ ] RTL-correct in `/ar/*`; usable at 375px in preview.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; token-driven; no hardcoded strings; no behavior/API changes; renderer contract intact; no new deps; RTL-safe.
