# Task 02 — Full-site regeneration with confirmation guard

## Context

PRD 10.5: full-site regeneration re-runs generation for every field from the same business information, and requires explicit confirmation before discarding any manually edited content. The guard is not optional polish — it is the mechanism that enforces "manually edited content is never silently overwritten" at the full-site scale.

## Scope

Two owner-only endpoints + a confirmation flow:

| Method | Path | Body | Purpose |
|---|---|---|---|
| POST | `/api/sites/:id/regenerate` | — | Start full-site regeneration after confirmation. |
| GET | `/api/sites/:id/regenerate-impact` | — | Report how many fields would be overwritten (for the confirmation notice). |

## Technical details

Files:

```
src/app/api/sites/[siteId]/regenerate/route.ts            // thin POST
src/app/api/sites/[siteId]/regenerate-impact/route.ts     // thin GET
src/features/regeneration/api/regenerate-site.ts           // orchestration + guard
src/features/regeneration/api/regenerate-impact.ts         // count edited fields
src/features/regeneration/run-site-regeneration.ts         // job (all locales, all fields)
```

`regenerate-impact`:
- Session/ownership (`401`/`404`).
- Return `{ userEditedCount, locales }` = number of `edited:true` fields across `activeLanguages` content, and which locales. Pure read, no mutation.

`regenerate`:
- Session/ownership (`401`/`404`).
- If `generation.status` is `queued|running` → `409 { error:'generation_running' }`.
- Require explicit confirmation: body `{ confirm: true }` required when `userEditedCount > 0`. Without it (or `confirm:false` when edits exist) → `409 { error:'confirmation_required', userEditedCount }`. This is the ONLY way a user-edited field may be overwritten — the UI must show the notice from `regenerate-impact` and get the owner's `confirm:true`.
- `template = getTemplate(site.templateId)`; none → `404`.
- Set `generation` to `queued`→`running` and `void` the job.

`run-site-regeneration(siteId)`:
- For each `locale` in `activeLanguages`: build messages from `businessInfo` + full `template` (no `otherSectionValues` needed for a full rewrite), `generateFields` → `validateAndSanitize` → `mergeGeneratedContent`, write `content[locale]` after each locale.
- Because the user confirmed, the previously `edited:true` fields are overwritten in this run (explicit consent in effect).
- Success: `currentStep='editing'`, `hasUnpublishedChanges=true`, `generation.status='complete'` + `finishedAt`, ensure `brandColor` non-empty.
- Failure: `generation.status='failed'` with machine code; partial content already written remains.

UI (integrated in editor):
- A "Regenerate site" control in the editor chrome calls `regenerate-impact`; if `userEditedCount > 0`, show the plain-language confirmation notice "Your manual edits will be rewritten" and a confirm/cancel; only on confirm does it POST `{ confirm:true }`.
- The editor then shows the existing generation progress/polling UI (reuse the polling hook from Epic 03 M02 — a generation in progress is indistinguishable from a rewrite in progress).
- Strings under `editor.regenerate.*`.

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `editor.regenerate.site` | `Regenerate site` | `إعادة إنشاء الموقع` |
| `editor.regenerate.confirm` | `Your manual edits will be rewritten. Continue?` | `ستتم إعادة كتابة تعديلاتك اليدوية. المتابعة؟` |
| `editor.regenerate.confirm_btn` | `Rewrite and continue` | `إعادة الكتابة والمتابعة` |
| `editor.regenerate.cancel` | `Cancel` | `إلغاء` |

## Dependencies

- `epics/04-preview-and-edit/05-regeneration/MILESTONE.md`
- `epics/03-ai-content-generation/01-generation-engine/03-generate-and-status-endpoints.md` (job lifecycle, polling reuse)
- `epics/03-ai-content-generation/01-generation-engine/02-field-validation-retry-fallback.md`
- `epics/04-preview-and-edit/02-text-editing/MILESTONE.md` (`edited` flag)

## Out of scope

- Section regeneration (Task 01); structural controls; image/color regeneration.

## Acceptance criteria

- [ ] `regenerate-impact` shows `userEditedCount` = number of `edited:true` fields (0 when none).
- [ ] With user edits present, POST `/regenerate` without `{ confirm:true }` → `409 { error:'confirmation_required' }`; nothing is overwritten.
- [ ] With user edits present and `{ confirm:true }` → job runs; on completion all fields (including previously edited ones) are regenerated, `hasUnpublishedChanges=true`.
- [ ] With NO user edits, POST succeeds without requiring `confirm`.
- [ ] UI: with edits, the notice "Your manual edits will be rewritten." shows before any request fires; without edits, regeneration starts directly (no notice).
- [ ] `409 { error:'generation_running' }` while a run is active.
- [ ] Both locales regenerated; Arabic stays a native localized version (not an English translation) per the engine's prompt.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; the confirmation guard is enforced server-side (not just in the UI); reuses Epic 03 engine; no hardcoded strings; no new dependencies.
