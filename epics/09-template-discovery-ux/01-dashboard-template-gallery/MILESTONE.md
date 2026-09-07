# Milestone 01 — Dashboard Template Gallery

## Goal
Let the owner browse every template variant this webapp offers — with a rendered visual preview, name, category, and style — from the dashboard, before or as they build/switch sites.

## Shared context
- The dashboard (`src/app/[locale]/dashboard/page.tsx`) currently lists the owner's sites only. A template gallery gives access to the full `TEMPLATES` catalog (`src/features/templates/catalog.ts`) with metadata (BilingualText name/description, categories, style, defaultAccent).
- Previews should render the actual template (via a lightweight preview renderer or styled thumbnails reusing `SiteRenderer` in a non-interactive scale-down) using real/default images from Epic 08.
- All UI bilingual EN + AR, RTL-safe, mono-styled.

## Tasks
1. **01-gallery-page-and-listing** — a dashboard "Template gallery" page listing all templates with metadata.
2. **02-template-preview-thumbnails** — render a true visual thumbnail for each template in the gallery.
