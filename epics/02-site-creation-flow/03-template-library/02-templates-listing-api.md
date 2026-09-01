# Task 02 — Templates listing API with category matching

## Context

The selection screen must show category-matched templates first without ever hiding the rest (product rule: matching narrows, never hides). The API encodes that ranking once so both the wizard screen and later re-selection flows get identical behavior.

## Scope

Three endpoints (session required):

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/templates` | Full catalog DTOs. |
| GET | `/api/templates?suggested=true&category={id}` | `{ suggested: [...], others: [...] }` ranked per milestone rule. |
| GET | `/api/templates/:templateId` | Single definition. |

## Technical details

Files:

```
src/app/api/templates/route.ts               // GET (list / suggested)
src/app/api/templates/[templateId]/route.ts  // GET single
src/features/templates/api/list-templates.ts // ranking logic
```

DTO shape = the `TemplateDefinition` minus nothing (definitions are safe public data). Ranking: suggested = `categories.includes(category)` preserving catalog order; invalid/missing `category` param → `suggested=[]` silently (no error to clients — empty suggestion is a normal state); unknown category id → same silent-empty treatment.

## Dependencies

- `epics/02-site-creation-flow/03-template-library/01-template-format-and-seed-library.md`

## Out of scope

- Persisting a site's chosen template (Task 03 owns `PATCH /api/sites/:id/template`).
- Any user/site data in responses.

## Acceptance criteria

- [ ] Anonymous GET → `401`. Signed-in GET → full list of 10.
- [ ] `?suggested=true&category=restaurant` returns `warm-kitchen`,`bistro-menu` first in `suggested`; remaining 8 in `others`; catalog order stable across calls.
- [ ] `?suggested=true&category=nonsense` → `{ suggested: [], others: [all 10] }` with HTTP 200.
- [ ] `GET /api/templates/warm-kitchen` returns the exact definition (spot-check `svcCount=4`, sections length).
- [ ] Unknown templateId → `404 { error:'not_found' }`.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; thin routes; no new dependencies.
