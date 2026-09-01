# Task 01 — Business information save API

## Context

The business-info form autosaves as the user types (product requirement: zero explicit "save"), and must never lose input. This endpoint accepts partial updates of any subset of fields, validates the two required ones only when advancing, and moves the wizard forward on demand.

## Scope

One endpoint:

| Method | Path | Body | Purpose |
|---|---|---|---|
| PATCH | `/api/sites/:id/business-info` | `{ ...fields?, advance?: boolean }` | Merge given businessInfo fields; optionally advance step. |

## Technical details

Files:

```
src/app/api/sites/[siteId]/business-info/route.ts   // thin PATCH handler
src/features/sites/schemas.ts                        // zod schema businessInfoPatchSchema
src/features/sites/api/update-business-info.ts       // logic
```

Zod validation (`businessInfoPatchSchema`):
- All string fields: `name` (trim, max 120), `description`/`targetCustomers`/`services`/`location` (max 2000), `contactPhone` (max 40), `contactEmail` (`z.string().email()` when present, max 200).
- `usps`: array of strings, each max 140, max 5 items. `notes`: array of strings, each max 500, max 5 items.
- `category`: optional enum of the five ids.
- `advance`: boolean optional.
- Unknown keys → stripped, not errors.

Semantics:
- Ownership rule applies (`401` / `404`, see Epic 02 M01 rules).
- Merge patch into `businessInfo`; stamp `updatedAt`; apply `hasUnpublishedChanges` rule (M01 rule 3).
- If `advance === true`: require `name` non-empty and `category` set AFTER merge → else `422 { error: 'missing_required_fields' }`. On success set `currentStep='templates'`.
- Response: `200` with updated site DTO.

## Dependencies

- `epics/02-site-creation-flow/01-site-data-model/01-site-schema-and-repository.md`
- `epics/02-site-creation-flow/01-site-data-model/02-site-crud-api.md`

## Out of scope

- Form UI (Task 02).
- Writing template/language/generation state — other endpoints own those.

## Acceptance criteria

- [ ] Anonymous PATCH → `401`; non-owner → `404`.
- [ ] `{ name: 'Salon Noor', category: 'services' }` persists both fields; GET returns them.
- [ ] `{ contactEmail: 'not-an-email' }` → `422`; nothing was persisted.
- [ ] `{ advance: true }` with empty category after merge → `422 { error: 'missing_required_fields' }` and `currentStep` unchanged.
- [ ] `{ name:'X', category:'retail', advance:true }` → DTO has `currentStep='templates'`.
- [ ] Partial patches (single field) never blank out other fields.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; zod schema lives in the sites feature (reusable), route file thin; no new dependencies.
