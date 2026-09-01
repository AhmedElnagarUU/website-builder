# Task 01 — Language configuration API & default-suggestion helper

## Context

Language choice determines how many content variants the AI will generate (Epic 03) and must be respected absolutely: if the user picks English only, no Arabic content may ever be generated (product acceptance criterion). This endpoint persists that choice at creation time.

## Scope

- PATCH endpoint storing the choice.
- Pure helper `suggestLanguageFromLocation(location?: string): 'ar-first' | 'en-first'` + the static Arabic-region list, used by the screen in Task 02.

## Technical details

Files:

```
src/app/api/sites/[siteId]/languages/route.ts        // PATCH
src/features/sites/api/update-languages.ts           // logic
src/shared/lib/arabic-regions.ts                     // static list + suggestLanguageFromLocation
```

PATCH semantics:
- Body `{ languageChoice: 'en' | 'ar' | 'both', advance?: boolean }`; zod enum validation → `422 { error:'invalid_choice' }` otherwise.
- Ownership rules apply.
- Maps to arrays per milestone table; writes BOTH `languagesRequested` and `activeLanguages`.
- Only allowed while site has NO generated content (`content` empty for all locales): if any locale has fields → `409 { error:'content_exists' }` (post-generation language changes are Epic 05's settings endpoint — do not build them here).
- `advance:true` → sets `currentStep='generating'`.
- Applies `hasUnpublishedChanges` rule. Returns DTO.

Helper:
- Case-insensitive substring match over the location string; empty/missing → `'en-first'`.

## Dependencies

- `epics/02-site-creation-flow/01-site-data-model/01-site-schema-and-repository.md`

## Out of scope

- The choice screen UI (Task 02).
- Add/remove language AFTER generation (Epic 05 site settings).

## Acceptance criteria

- [ ] `{ languageChoice:'both' }` → DTO shows `languagesRequested=['en','ar']`, `activeLanguages=['en','ar']`.
- [ ] `{ languageChoice:'ar', advance:true }` → also `currentStep='generating'`.
- [ ] `{ languageChoice:'fr' }` → `422`.
- [ ] After Epic 03 generates content (simulate by inserting a content field directly), PATCH → `409 { error:'content_exists' }`.
- [ ] `suggestLanguageFromLocation('Riyadh, Saudi Arabia') === 'ar-first'`; `('') === 'en-first'`; `('Cairo') === 'ar-first'`.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; thin route; no new dependencies.
