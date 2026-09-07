# Milestone 03 — Screenshot Infrastructure

## Goal
Each template definition carries a **configurable screenshot path**, defaulting to a predictable per-template location under `public/templates/<template-id>/`. Template cards consume the screenshot from the template definition (never hardcoded in components) and gracefully fall back to the existing SVG thumbnail until real screenshots exist.

## Tasks
1. `01-screenshot-config-and-cards.md` — schema field + catalog defaults + `TemplateThumbnail` screenshot rendering with fallback.

## Shared context (binding)

- `TemplateDefinition` lives in `src/features/templates/types.ts`; the catalog builder `def()` is in `src/features/templates/catalog.ts`.
- The screenshots do NOT exist yet. The card must degrade to the current SVG thumbnail (`/templates/{id}/preview.svg`) when the file is absent.
- `TemplateThumbnail` (`src/features/templates/components/TemplateThumbnail.tsx`) is a client component that already implements a `useState` + `<img onError>` fallback chain (SVG → plain name). Extend that same chain, do not create a parallel component.
- Callers of `TemplateThumbnail` that must pass the screenshot: `TemplateCard`, `TemplateGalleryCard`, and the editor picker card. The editor's confirmation thumbnail may stay on SVG (it only rescues by `templateId`).
- Convention documented for the future screenshot pipeline: place `public/templates/<template-id>/screenshot.png` (1:1 source, e.g. 1200×1200), generated from the `/preview/<template-id>` page, and no card changes will be needed to pick it up.