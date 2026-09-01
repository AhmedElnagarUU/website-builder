# Epic 04 — Preview, Light Edit & Regeneration

**One-line purpose:** Show the real, finished website immediately after generation and let the user make light, safe adjustments — inline text edits, image swaps, brand color — plus surgical or full AI rewrites, with zero structural editing surface anywhere.

## Why this epic matters for the MVP

The product succeeds when the site feels created FOR the user and they only review, not build (PRD vision). This epic delivers the review surface: tap-to-edit text, image replacement, a constrained color choice, and regeneration that respects manually edited content (never silently overwritten — product invariant).

## Scope boundaries

**In scope**
- Shared site-renderer used by BOTH the editor preview and the public live site (Epic 05).
- Editor chrome: desktop/mobile toggle, per-language tabs, saved indicator, review flags.
- Inline text editing with continuous autosave + manual-edit protection flags.
- Brand color customization from a curated safe palette.
- Image uploads to S3 (presigned), slot replacement, crop positioning, low-res warnings, category defaults.
- Section-level regeneration; full-site regeneration with confirmation guard.
- Template switching AFTER content exists (field preservation semantics).

**Out of scope**
- Publishing/live serving (Epic 05).
- ANY structural control: move/delete/add/duplicate sections — permanently out of product scope; nothing here may add such controls even disabled.
- Undo history, multi-select editing, rich-text formatting (bold/lists) — plain text only for MVP.

## Milestones (in execution order)

| # | Milestone | One-line description |
|---|---|---|
| 01 | `01-site-render/` | Renderer engine + editor preview page around it. |
| 02 | `02-text-editing/` | Content autosave API + tap-to-edit UI. |
| 03 | `03-brand-color-customization.md` | Single-task milestone: palette + endpoint + control. |
| 04 | `04-image-handling/` | S3 presigned uploads + image slot UX. |
| 05 | `05-regeneration/` | Section rewrite + guarded full rewrite. |
| 06 | `06-template-switching.md` | Single-task milestone: change templates without losing content. |

## Cross-epic dependencies

- Depends on Epic 02 (site model, template catalog/format) and Epic 03 (content exists; regeneration reuses its engine).
- Epic 05 depends on Milestone 01 (renderer) and the editing data flows.
