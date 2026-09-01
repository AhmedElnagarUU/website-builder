# Task 01 — Section-level regeneration

## Context

PRD 10.5: a section rewrite replaces only the targeted section's fields, reuses the current confirmed content of other sections as context (so tone/facts stay consistent), and never touches user edits elsewhere. This reuses Epic 03's engine end-to-end.

## Scope

One owner-only endpoint:

| Method | Path | Body | Purpose |
|---|---|---|---|
| POST | `/api/sites/:id/regenerate-section` | `{ sectionId }` | Regenerate one template section across active languages. |

## Technical details

Files:

```
src/app/api/sites/[siteId]/regenerate-section/route.ts   // thin POST
src/features/regeneration/api/regenerate-section.ts        // orchestration
src/features/regeneration/run-section-regeneration.ts      // the job (locale loop, subset fields)
```

`regenerate-section`:
1. Session/ownership (`401`/`404`).
2. If `generation.status` is `queued|running` → `409 { error:'generation_running' }`.
3. `template = getTemplate(site.templateId)`; none → `404`.
4. Find target `TemplateSection` by `sectionId`; not found → `422 { error:'unknown_section' }`.
5. Set `generation` to `queued`→`running` and `void` the job (like Epic 03).

`run-section-regeneration(siteId, sectionId)`:
- For each `locale` in `activeLanguages`:
  - Build the field list: only the target section's fields.
  - `otherSectionValues` = the current values of ALL non-target fields (from the same locale's existing content) — passed into `buildGenerationMessages` for consistency.
  - Call `generateFields` → `validateAndSanitize` → `mergeGeneratedContent` (Epic 03 Task 02 pipeline).
  - For each regenerated field: if the existing field had `edited:true`, SKIP (keep the user's value, its `edited`/`origin'`/`reviewFlagged` untouched). Otherwise write the new generated value.
  - Persist `content[locale]` after each locale (partial progress survives a later crash).
- On success: keep `currentStep='editing'`, set `hasUnpublishedChanges=true`, `generation.status='complete'` + `finishedAt`.
- On any failure: `generation.status='failed'` with machine code (`timeout`|`provider_error`|`bad_response`); content written so far remains.

## Dependencies

- `epics/04-preview-and-edit/05-regeneration/MILESTONE.md` (contract).
- `epics/03-ai-content-generation/01-generation-engine/01-ai-client-and-prompt-builder.md` (`buildGenerationMessages`, `otherSectionValues`).
- `epics/03-ai-content-generation/01-generation-engine/02-field-validation-retry-fallback.md` (validation/retry/fallback reuse).
- `epics/04-preview-and-edit/02-text-editing/01-content-autosave-api.md` (`edited` flag semantics).

## Out of scope

- Full-site regeneration (Task 02); image/color regeneration (none); structural controls.

## Acceptance criteria

- [ ] Anonymous POST → `401`; non-owner → `404`.
- [ ] Regenerating `about` → only `about_title`/`about_body` change (per target locale(s)); hero/services/etc. field VALUES and `edited` flags are byte-identical.
- [ ] A user-edited (`edited:true`) field inside the target section (e.g. the owner edited `about_body`) is NOT overwritten — its value + flag survive; the non-edited `about_title` is rewritten.
- [ ] Non-target fields are passed as context (verify a request fires with `otherSectionValues` present in the assembled user prompt).
- [ ] POST while a run is active → `409 { error:'generation_running' }`.
- [ ] On an unreachable provider the job ends `failed` (machine code) and the previously persisted content (including user edits) is unchanged.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; thin route; orchestration in regeneration feature; reuses Epic 03 engine (no duplicated prompt/validation logic); no new dependencies.
