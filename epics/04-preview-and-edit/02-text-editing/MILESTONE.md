# Milestone 02 — Text Editing

## Goal

Turn the editor preview from a read-only render into a light edit surface: tapping any prose field opens an inline editor, edits autosave continuously, and every user edit is marked `edited:true` so it is NEVER silently overwritten by a later AI regeneration (product invariant). The renderer (Milestone 01) already emits `onRequestEdit(fieldKey)` in edit mode; this milestone attaches a real editor there.

## Tasks (execution order)

1. `01-content-autosave-api.md` — owner-only PATCH content endpoint with per-field constraint validation and manual-edit flags.
2. `02-tap-to-edit-ui.md` — inline edit UI + save provider wrapping the EditorShell.

## Shared context — CONTENT-AUTOSAVE CONTRACT

Binding for this milestone and Epic 04's regeneration/template-switch milestones.

### The edited flag is sacred

`ContentField.edited` is the single source of truth for "the user owns this text". Rules:

- A user edit sets `edited:true` and `origin:'user'`.
- A user edit CLEARS `reviewFlagged` (once the user touches it, it's no longer "AI suggested").
- Editing DOES NOT transform the value beyond trimming surrounding whitespace; content is stored as typed.
- `edited:true` + `origin:'user'` is what regeneration and template-switch logic consult before deciding whether a field may be overwritten (see M05, M06).

### Endpoint contract (owner-only)

| Method | Path | Body | Purpose |
|---|---|---|---|
| PATCH | `/api/sites/:id/content` | `{ locale, updates: { <fieldKey>: <string> } }` | Persist edited prose fields for one locale. |

- Ownership rule: `401` no session, `404` not owner.
- `locale` must be in `activeLanguages` → else `422 { error:'invalid_locale' }`.
- Only fields that exist in the site's current template (`getTemplate(templateId)`) are accepted; unknown keys → `422 { error:'unknown_field' }`. (Prevents injecting keys the semantic model doesn't define.)
- Every provided value is validated against its field's constraint (`maxWords`/`maxChars` from the template). Violation → `422 { error:'field_too_long', field }`. Autosave must NEVER accept over-constraint text (matches generation's own rule).
- Each edited field: `value` = trimmed input, `edited:true`, `origin:'user'`, `reviewFlagged:false`.
- Only fields present in `updates` are changed; all other fields in that locale stay byte-identical (partial writes, like business-info PATCH).
- Always applies `hasUnpublishedChanges` rule (if previously published → `true`).
- Response `200` with updated site DTO.

### Where the save hangs

Milestone 01's `EditorShell` already calls `onRequestEdit(fieldKey)` from the renderer but currently no-ops. Task 02 wires a `SaveProvider` (context + debounced PATCH + saved-state) inside `EditorShell` so tab-switching never loses unsaved edits (flush-on-switch).

## Out of scope

- Image editing (M04), color (M03), regeneration (M05), template switch (M06) — each own milestone.
- Structural editing (move/add/delete section) — permanently out of product scope.
- Rich-text formatting (bold/lists/links) — plain text only for MVP.

## Definition of Done (shared)

Per task files; every user edit sets `edited:true`+`origin:'user'`; never writes outside the template's known fields; both locales verified; `npm run lint && npm run typecheck && npm run build` pass.
