# Task 01 — Content autosave API

## Context

The product requires zero-explicit-save editing (auto-save on edit) and mandates that manual edits persist and be protected from later silent overwrites. This endpoint is the write path: it accepts edited prose for one locale, validates it against the template's constraints, marks the fields as user-owned, and persists a partial update — mirroring the business-info PATCH philosophy (partial writes never blank untouched fields).

## Scope

One owner-only endpoint:

| Method | Path | Body | Purpose |
|---|---|---|---|
| PATCH | `/api/sites/:id/content` | `{ locale, updates }` | Validate + persist one locale's edited prose fields. |

## Technical details

Files:

```
src/app/api/sites/[siteId]/content/route.ts   // thin PATCH handler
src/features/sites/schemas.ts                  // contentPatchSchema (add here, reusable)
src/features/sites/api/update-content.ts       // logic
```

Zod validation (`contentPatchSchema`):
- `locale`: enum `'en' | 'ar'`.
- `updates`: object mapping field key → string; values trimmed; each max 2000 chars.
- Unknown top-level keys stripped, not errors.

Semantics (`update-content`):
1. Session/ownership (`401`/`404`).
2. `site.activeLanguages` must include `locale` → else `422 { error:'invalid_locale' }`.
3. Resolve `template = getTemplate(site.templateId)`; if none → `404`.
4. Build the set of valid field keys from `template.sections[].fields[].key`.
5. For every key in `updates`: if key not in the valid set → `422 { error:'unknown_field', field:key }`. (Reject the whole request on the first unknown field — never partially write.)
6. For every key in `updates`: validate value against the field's `constraint`:
   - `maxWords` → count words (whitespace split); exceed → `422 { error:'field_too_long', field:key }`.
   - `maxChars` → string length; exceed → `422 { error:'field_too_long', field:key }`.
   - Reject whole request on first violation.
7. Merge into `content[locale]`: each provided key becomes `{ value: <trimmed>, origin:'user', edited:true, reviewFlagged:false }`. Keys NOT in `updates` are untouched.
8. Apply `hasUnpublishedChanges` rule (if `publishedSnapshot !== null` → `true`).
9. Return `200` with updated site DTO (via `toSiteDTO`).

## Dependencies

- `epics/04-preview-and-edit/02-text-editing/MILESTONE.md` (contract).
- `epics/02-site-creation-flow/03-template-library/01-template-format-and-seed-library.md` (field keys/constraints).
- `epics/02-site-creation-flow/01-site-data-model/MILESTONE.md` (repository, DTO, ownership, hasUnpublishedChanges rule).

## Out of scope

- Inline UI (Task 02), autosave hook/flush.
- Editing images/color.
- Regeneration/template-switch overwrite logic (M05/M06 read `edited` flag; they do not write here).

## Acceptance criteria

- [ ] Anonymous PATCH → `401`; non-owner → `404`.
- [ ] `{ locale:'fr', updates:{...} }` → `422 { error:'invalid_locale' }`.
- [ ] `{ locale:'en', updates:{ not_a_field:'x' } }` → `422 { error:'unknown_field' }`; nothing persisted.
- [ ] Updating a real field (e.g. `service_1_title`) → DTO shows `value` set, `edited:true`, `origin:'user'`, `reviewFlagged:false`; other fields unchanged.
- [ ] Editing an AI field that was `reviewFlagged:true` clears the flag after save.
- [ ] Value exceeding the field constraint (set `hero_headline` to >10 words) → `422 { error:'field_too_long' }`; nothing persisted.
- [ ] Passing a full `updates` object touching 2+ fields updates exactly those fields, leaves the rest byte-identical.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; zod schema in sites feature; route thin; no new dependencies.
