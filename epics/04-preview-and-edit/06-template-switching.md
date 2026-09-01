# Task 01 — Template switching after content exists (field preservation semantics)

A single-task milestone. Chosen because content is modeled as semantic fields (*not* layout slots — a PRD 11.4 data-model requirement), so switching templates can preserve everything the new template shares and only write what's missing.

## Context

PRD 11.4: shared fields keep their content; required fields the new template has no equivalent for are generated fresh (never left blank), from the original business information; orphaned content is retained in the background (never shown, never deleted) so switching back is lossless; the user sees a plain-language notice before confirming, not a technical diff. This MUST reuse the generation engine we built (Epic 03), exactly like regeneration.

## Scope

- A template-switch flow usable ONLY when the site has generated content (in-wizard selection already acts through a separate endpoint and must stay untouched — see out of scope).
- Owner-only endpoint to switch the template post-content, with a notice/confirmation, shared-field preservation, and fresh generation of missing required fields.
- The existing in-wizard `/template` PATCH keeps its current behavior.

## Technical details

Files:

```
src/app/api/sites/[siteId]/switch-template/route.ts       // thin POST (new; distinct from in-wizard /template)
src/features/sites/api/switch-site-template.ts            // orchestration
src/features/regeneration/run-template-backfill.ts         // generate only the missing fields (reuses engine)
```

Semantics (`switch-site-template`, owner-only):
1. Session/ownership (`401`/`404`); `templateId` for a valid existing template → else `422 { error:'invalid_template' }`.
2. If the site has NO generated content (content empty for all locales) → this flow is not the right one: redirect conceptual intent to the in-wizard endpoint. Return `409 { error:'no_content' }` (the wizard endpoint is for pre-generation).
3. Compute the diff against the CURRENT template:
   - `shared` = field keys present in BOTH old and new templates → their existing content (including `edited` flags) carries over untouched.
   - `missing` = field keys required by the NEW template not present in the OLD one → regenerated fresh (empty → generated) from `businessInfo`.
   - `orphaned` = keys in content but not in the new template → left in `content[locale]` (retained, hidden because the renderer only reads the new template's keys — so they're automatically invisible and kept for a future switch-back).
4. Confirmation with notice: return `GET`-able impact so the UI can show "Some content will be rewritten to fit the new design"; POST requires `{ confirm:true }` when `missing.length > 0` else `409 { error:'confirmation_required' }`. (No user-edited field is silently discarded: shared user edits carry over; only missing fields are newly generated, so nothing user-owned is lost.)
5. Update `templateId` + `brandColor` (keep existing brandColor unless empty → new template `defaultAccent`), set `hasUnpublishedChanges=true` (if previously published), keep `currentStep='editing'`.
6. Generation of `missing` fields runs as the job (single-flight guard; reuses `buildGenerationMessages`/`generateFields`/`validateAndSanitize`/`mergeGeneratedContent`), writing only the missing keys into each locale's content and leaving everything else byte-identical. On failure: template not switched / status `failed` with machine code; on success `generation.status='complete'`.

UI:
- Expose a "Change template" control in the editor (displays a template picker filtered by the site category, reusing catalog data).
- Before applying, if `missing.length > 0`, show the plain-language notice; require confirm.

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `editor.template.change` | `Change template` | `تغيير التصميم` |
| `editor.template.notice` | `Some content will be rewritten to fit the new design.` | `سيُعاد كتابة بعض المحتوى ليناسب التصميم الجديد.` |
| `editor.template.apply` | `Apply new template` | `تطبيق التصميم الجديد` |

## Dependencies

- `epics/02-site-creation-flow/03-template-library/MILESTONE.md` (template definitions, catalog, ranking).
- `epics/03-ai-content-generation/01-generation-engine/*` (engine reuse for missing-field generation).
- `epics/04-preview-and-edit/02-text-editing/MILESTONE.md` (semantic keying, `edited` flag).
- Existing `src/features/templates/api/update-site-template.ts` + `/template` route must remain for the in-wizard path.

## Out of scope

- Altering the existing in-wizard `/template` PATCH selection behavior.
- Deleting orphaned content (retained by design for switch-back).
- Resizing/migrating images across templates (images keyed by `slotId`; a slot the new template lacks is also retained-and-hidden; slot mapping between templates is out of scope for MVP).

## Acceptance criteria

- [ ] Switching to a template that shares all fields → content carries over unchanged; NO new generation fires; nothing user-edited is lost.
- [ ] Switching to a template with a new required field (e.g. from a template without `testimonials` to one with it) → after the backfill job the `testimonial_*` fields are populated (never blank), while all shared fields keep their exact values + `edited` flags.
- [ ] Orphaned content (keys not in the new template) remains in `content[locale]` but the renderer no longer displays it; switching back restores it.
- [ ] With missing fields, POST without `{ confirm:true }` → `409 { error:'confirmation_required' }`; the UI shows "Some content will be rewritten to fit the new design." before applying.
- [ ] Site with no content yet → `409 { error:'no_content' }` (in-wizard flow is used instead).
- [ ] Existing in-wizard template selection (Epic 02) still works unchanged (regression check).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; field-preservation is data-driven (semantic keys) not per-layout hacks; reuses the generation engine; no hardcoded strings; no new dependencies.
