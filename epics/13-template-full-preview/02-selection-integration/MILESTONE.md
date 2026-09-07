# Milestone 02 — Selection Integration

## Goal
Every template card across all selection surfaces exposes a clearly visible **View template** action that opens the preview in a **new browser tab**, and the obsolete modal preview implementation is fully removed so the new-tab preview is the single source of truth.

## Tasks (execution order)
1. `01-new-tab-action.md` — `TemplatePreviewLink` (anchor, `target="_blank"`) wired into the wizard picker, dashboard gallery, and editor picker cards.
2. `02-remove-obsolete-modal.md` — delete the modal preview implementation and its now-unused message keys.

## Shared context (binding for this milestone)

- Selection surfaces and their cards:
  - create-wizard: `src/app/[locale]/create/templates/page.tsx` → `TemplatePicker` → `TemplateCard` (`src/features/create-wizard/components/TemplateCard.tsx`).
  - dashboard gallery: `src/app/[locale]/dashboard/templates/page.tsx` → `TemplateGallery`/`TemplateGalleryCard` (`src/features/templates/components/TemplateGallery.tsx`).
  - editor picker: `src/features/editor/components/ChangeTemplateControl.tsx` (its picker grid).
- To-be-obsolete: `src/features/templates/components/TemplatePreview.tsx` — the modal + trigger previously wired into those three cards. It is REPLACED, not kept.
- The new-tab URL is `/preview/<template.id>` (Epic 13 M01). `target="_blank"` + `rel="noopener noreferrer"`.
- Label/aria text via messages: keep `preview.view`, add `preview.open_new_tab` if an accessible hint is needed. No hardcoded strings.
- After deletion, grep the repo for `TemplatePreview` (component) and `preview.sample_hint|preview.close|preview.page_label` and confirm zero references.