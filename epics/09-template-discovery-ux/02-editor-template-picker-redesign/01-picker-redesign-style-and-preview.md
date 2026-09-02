# Task — Pick any template with a visual preview, in the project style

## Title
Restyle the editor template picker with visual previews and vexa design

## Context
The editor's "Change template" picker is a bare list of template names in a plain modal, which does not match the product's visual language and doesn't show what the user is choosing. It must present each template with a real visual preview, styled with the vexa design tokens, and make selection obvious.

## Scope
Redesign `ChangeTemplateControl`'s picker modal: vexa-styled surface/typography, each template as a rich card with a preview thumbnail (reusing M01 task 02), name + description in the current locale, and a clear "current" indicator. Keep the existing switch-generation axios/fetch flow intact.

## Technical details
- Files: `src/features/editor/components/ChangeTemplateControl.tsx` (and shared `TemplateGalleryItem`/thumbnail component).
- Reuse the thumbnail component from Epic 09 M01 task 02.
- Add i18n keys (e.g. `editor.template.change`, `editor.template.preview`, `editor.template.current`, `editor.template.pick`) in `en.json`/`ar.json`.
- RTL-safe; consistent with `vexa-surface`, `vexa-display`, `vexa-red` tokens.
- No new dependencies.

## Dependencies
- Epic 09 M01 task 02 (thumbnail component). Epic 08 (enhanced/real templates). Epic 07 (opaque preview).

## Out of scope
- Confirmation/explanation copy beyond the current modal (task 02). Changing the switch API semantics.

## Acceptance criteria
- Picker opens in-project styled; each option shows a visual preview, name, and description (current locale); current template clearly marked.
- Selecting closes/activates the same apply flow as today.
- EN + AR (RTL) correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.