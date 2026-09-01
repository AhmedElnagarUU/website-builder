# Milestone 05 — Regeneration

## Goal

Let the owner rewrite website copy after generation: either a single section (targeted rewrite that reuses the current confirmed content of other sections) or the whole site (guarded rewrite). The non-negotiable invariant (PRD 10.5, AGENTS.md): **manually edited fields are never silently overwritten by AI regeneration.** Regeneration reuses the generation engine built in Epic 03 (same prompts, validation, retry, fallback — not a new writer).

## Tasks (execution order)

1. `01-section-regeneration.md` — regenerate one template section, preserving user edits everywhere else.
2. `02-full-site-regeneration.md` — regenerate all locales/sections with an explicit confirmation guard before discarding manual edits.

## Shared context — REGENERATION CONTRACT

Binding for this milestone; extends Epic 03's generation contract.

### What counts as "user-owned" (must be protected)

A field is user-owned and NON-overwritable when `edited === true` (and `origin === 'user'`) — exactly what the content-autosave endpoint writes (M02). Fallback/placeholder and untouched `origin:'ai'|'placeholder'` fields ARE overwritable by regeneration.

### Section regeneration semantics

- Target = one `TemplateSection` (by its `id`). Only that section's `fields` are regenerated, in the currently-active locale first; for bilingual sites the same section in each `activeLanguages` is rewritten so both match, reusing each locale's own other-section values.
- Non-target fields of the SAME locale are passed as `otherSectionValues` to `buildGenerationMessages` for tone/fact consistency (Epic 03 already supports this via `otherSectionValues`).
- Non-target fields are left byte-identical — including their `edited` flags.
- Within the target section, user-edited (`edited:true`) fields are preserved (NOT overwritten); only non-edited fields are regenerated. If a user editing surfaced mid-section, the section reruns for the non-edited subset and leaves the edited ones.
- Uses the same validation/retry/fallback pipeline (Epic 03 Task 02) — excess-length retries, fallback placeholders flagged for review, never a dead end.

### Full-site regeneration semantics

- Re-runs generation for every locale and every field from the same `businessInfo` (like the original run).
- Confirmation is REQUIRED and explicit: before discarding ANY user-edited field, the UI shows a plain-language notice (e.g. "Your manual edits will be rewritten") and the user must confirm. No silent full rewrite ever.
- After confirmation, all user-edited fields are treated as overwritable for this run (the user consented). Fields are regenerated for all `activeLanguages`.
- Same success/error lifecycle as Epic 03's job (single-flight, `queued→running→complete|failed`, machine-code errors, inputs preserved on failure).

### Job/lifecycle reuse

- Both flows reuse the single-flight guard: if `generation.status` is `queued|running` → `409 { error:'generation_running' }`.
- Status transitions mirror Epic 03; partial progress persisted per-locale; on failure inputs/content already written are retained (resume-safe).
- Success side-effects: only rewrite the target fields (section) or the full content (full); `currentStep` stays `'editing'`; `hasUnpublishedChanges` becomes `true`.

## Out of scope

- Structural regeneration (move/add/delete) — permanently out of product scope.
- Regenerating images or brand color.
- A "regenerate this one field" affordance beyond what section rerun covers (MVP keeps it section-level + full-site only).

## Definition of Done (shared)

Per task files; `edited:true` fields survive section regeneration and are only overwritten after explicit full-site confirmation; both locales; lint/typecheck/build pass; no new dependencies.
