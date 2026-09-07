# Milestone 05 — Editor Chrome (Monomastic style)

## Goal

Restyle the editor experience (built in Epic 04) with the Monomastic design language: the `EditorShell` top bar (language tabs, desktop/mobile toggle, saved indicator, brand color control, action area), the preview surface's affordances (empty-placeholder blocks, "AI suggested — review this" badges), and related control surfaces (text-edit popover, image-slot UX). Visual only — the renderer engine (`shared/site-render`) and ALL editor behavior/APIs are untouched. Generated user sites keep their own template styling (EPIC.md out-of-scope: this does NOT restyle end-user sites).

## Tasks (execution order)

1. `01-editor-shell-top-bar.md` — restyle the editor top bar / chrome and its controls.
2. `02-preview-affordances.md` — restyle the in-preview affordances: empty-placeholder blocks, review badges, tap-to-edit focus, image-slot and color controls.

## Shared context

- The editor chrome is the most functional, dense surface in the product (EPIC.md flag #2 → restraint: subdued paper, clear affordances, no decorative interference with editing).
- All editor strings already exist via next-intl (e.g. `editor.*` from M03 brand-color, `saved`, language tabs, `review this`, empty-placeholder copy from Epic 04 renderer). No re-wording.
- The renderer's edit-mode affordance contract (empty placeholders, `reviewFlagged` badges) is defined in `epics/04-preview-and-edit/01-site-render/MILESTONE.md` — restyle those, don't add structural controls (permanent product out-of-scope: no move/add/delete).

## Definition of Done (shared)

Per task files; top bar + preview affordances styled, token-driven, RTL-safe; renderer behavior and editing flows untouched; no hardcoded strings; no new deps; `npm run lint && npm run typecheck && npm run build` pass.
