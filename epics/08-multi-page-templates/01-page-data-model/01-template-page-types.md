# Task — Template page types

## Title
Add `TemplatePage` and `pages` to the template model

## Context
Templates are currently a flat `sections: TemplateSection[]` = one page. We are moving to multi-page websites, so the template must describe a set of pages, each with its own sections, slug, and nav label.

## Scope
Extend the template type model with a page concept. This is purely a type/data-shape task (no runtime change yet).

## Technical details
- File: `src/features/templates/types.ts`.
- Add:
  ```ts
  export interface TemplatePage {
    id: string;          // 'home' | 'about' | 'services' | 'contact' | 'menu' | 'gallery' | 'faq' | 'pricing' | 'team' | 'hours'; home reserved for the root page
    slug: string;        // url segment; '' for home
    name: BilingualText; // nav label
    sections: TemplateSection[];
    nav?: boolean;       // show in main nav (home implied)
  }
  ```
- Add `pages: TemplatePage[]` to `TemplateDefinition`. Keep `sections` ONLY as a deprecated/source helper if required for compatibility, otherwise remove its usage in favor of `pages`.
- Ensure the semantic-key registry in `catalog.ts` still guarantees each field key maps to a single page (keys stay globally unique).

## Dependencies
- Epic 04/06 types exist (`TemplateDefinition`, `TemplateSection`).

## Out of scope
- Changing `Site.content` (M01 task 02). Changing the renderer (M03). Content generation (M02).

## Acceptance criteria
- The `TemplateDefinition` type compiles with `pages`; every existing code path that reads `template.sections` is updated or explicitly resolved to a page's sections.
- Type-check passes (`npx tsc --noEmit`).

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean.
