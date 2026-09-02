# Milestone 02 — Editor Template Picker Redesign

## Goal
Redesign the editor's "change/choose template" control to look native to the project style, show the actual template (visual preview) when choosing from the list, and require explicit confirmation before applying — clarity over confusion.

## Shared context
- The existing `ChangeTemplateControl` (`src/features/editor/components/ChangeTemplateControl.tsx`) opens a modal listing template names only; switching calls the `switch-template` API and tracks generation status. The current design does not reflect the project's visual style ("vexa") and gives no visual preview.
- Target style = vexa design tokens (see Epic 05 UI). Reuse the thumbnail approach from this epic's M01 task 02.
- Any new strings are bilingual EN/AR, RTL-safe.
- The permanent invariant stands: switching a template never silently drops edited content the user didn't confirm (existing 409/"confirmation required" path must be preserved).

## Tasks
1. **01-picker-redesign-style-and-preview** — restyle the picker modal in vexa style and render a template preview in each option.
2. **02-clear-confirm-and-explain** — surface what applying a template does (regenerates copy, keeps/merges edits per policy), use explicit confirmation, and keep generation-status UX.