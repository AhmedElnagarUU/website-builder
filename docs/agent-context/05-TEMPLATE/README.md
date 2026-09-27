# 05 — TEMPLATE reference

| File | What it is | Size |
|---|---|---|
| `01-template-structure.md` | **Source of truth** for how templates are structured, defined, registered, rendered and routed | 38 KB |
| `02-template-strategy.md` | Template strategy & audit — how many, which categories, coverage gaps | 12 KB |

Read `01-template-structure.md` when you touch the template engine, the catalog, section field keys, or
anything under `src/shared/site-render/`. It is long, so read the section you need rather than the
whole file.

## The short version (details in `01-template-structure.md`)

- `src/features/templates/catalog.ts` is the **registry and source of truth**. `pages.ts` declares
  pages and their sections. `lib/demoContent.ts` supplies demo content.
- A template declares which sections exist and which **semantic field keys** each section needs —
  the AI fills those keys, it does not invent structure.
- Rendering is a pure content → HTML pass through `src/shared/site-render/SiteRenderer.tsx`, shared
  by the editor (edit mode) and the live published site (read mode).
- Every template's CSS variables (`--font-body`, `--font-serif2`, `--font-mono`,
  `--font-playfair-display`, …) are defined in `src/shared/ui/fonts.ts` and wired via
  `fontVariables` in `src/app/layout.tsx`. All 26 are bundled locally.
- Adding or removing a section, or a template field, means editing `catalog.ts` **and** `pages.ts`
  together — then check the 14 section components in `src/shared/site-render/sections/`.
