# Task 01 — Site schema, repository and indexes

## Context

The product's central entity is a website. Users abandon flows halfway and must return without losing anything (product requirement), so the site record — including its wizard position and later its AI content — persists from the first click of "Create website". This task implements the data layer exactly as specified in this milestone's `MILESTONE.md` (read it first; it holds the full canonical model).

## Scope

- `src/features/sites/types.ts` with every type from the milestone model (verbatim field names).
- `src/features/sites/repository.ts` implementing the repository contract.
- Extend `src/shared/db/indexes.ts` to create the two site indexes idempotently.
- Unit-level sanity: a `createSite(ownerId)` produces a document satisfying all defaults below.

## Technical details

Defaults applied by `createSite`:

```ts
{
  status: 'draft',
  currentStep: 'business_info',
  businessInfo: { name: '', category: undefined },   // category unset until chosen
  languagesRequested: [], activeLanguages: [],
  content: {}, images: {},
  brandColor: '',                                    // set when template is chosen
  publishedSnapshot: null,
  hasUnpublishedChanges: false,
  generation: { status: 'idle' },
}
```

Rules:
- `updateSite(id, patch)` merges ONLY the top-level keys present in `patch`, always stamps `updatedAt: new Date()`. It performs no validation — validation belongs to zod schemas at the API layer (later tasks).
- `toSiteDTO(site)` returns `_id` and `ownerId` as strings and omits nothing else.
- No API routes in this task.

## Dependencies

- `epics/02-site-creation-flow/01-site-data-model/MILESTONE.md` (the model itself)
- `epics/01-foundation/01-project-scaffold/02-mongodb-connection-layer.md`

## Out of scope

- All HTTP endpoints (Task 02).
- Any mutation semantics beyond generic merge (business-info/template/language patches belong to their step tasks).

## Acceptance criteria

- [ ] `createSite` inserts a document whose fields match the defaults above (verified via mongo shell or a temporary script removed afterwards).
- [ ] `getSiteForOwner` returns null when `ownerId` differs (rule 2 behavior at repo level).
- [ ] Indexes exist after calling `ensureIndexes`: `ownerId_1` and a unique sparse `slug_1` (verify via `db.sites.getIndexes()`).
- [ ] Duplicate slug insert throws (unique index works).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; types match the milestone model field-for-field; no new dependencies.
