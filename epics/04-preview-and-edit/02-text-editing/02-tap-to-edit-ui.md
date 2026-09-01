# Task 02 — Tap-to-edit UI + autosave provider

## Context

Milestone 01's `SiteRenderer` already makes every prose field (and image slot) a tappable target that emits `onRequestEdit(fieldKey)` when edit mode is on — but the editor currently no-ops that callback. This task delivers the actual inline editor: tap a field → replace it with a focused input/textarea → type → autosave → show a subtle saved indicator. It also introduces the `SaveProvider` that owns the debounced PATCH and holds pending edits across language-tab switches (never lose the last ~1s).

## Scope

- `SaveProvider` client context wrapping the `EditorShell` preview: exposes `save(locale, fieldKey, value)` and a `savedAt`/`saving` state for the "Saved" indicator.
- Inline editor component bound to `onRequestEdit`: on tap, the tapped field becomes an editor (textarea for prose bodies, input for short labels); on blur/Enter it commits via `save`, then re-renders as static text.
- Composition: `EditorShell` stays the chrome owner; the renderer remains pure. The `SiteRenderer` `onRequestEdit` prop is replaced by a real handler wired to the provider.
- Strings under `editor.edit.*` (below).

## Technical details

Files:

```
src/features/editor/lib/SaveProvider.tsx               // context + debounced PATCH + saving/saved state
src/features/editor/components/InlineFieldEditor.tsx   // tap→edit→commit
src/features/editor/components/EditorShell.tsx          // wire provider + edit handler (edit existing)
```

Rules:
- Editing is per the currently active tab's locale (the `activeLocale` in EditorShell) — editing one language NEVER touches the other (PRD 13.5).
- Debounce ~600ms after last keystroke before PATCH (matches the copy flow's "autosave without explicit save"); a separate flush runs immediately on tab-switch and before navigation.
- Oversized input is blocked client-side against the same constraint (word/char limit) and never sent; server double-checks (Task 01).
- Empty submitted value → renders as the dashed "Empty — tap to fill" again (renderer already handles empty in edit mode).
- On PATCH error: keep the in-progress value, show an inline non-blocking error, and retry the save on next change (never silently drop the user's text).
- Arabic: the inline editor must mirror RTL (`text-start`) and use logical spacing; no directional utilities.

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `editor.edit.save_error` | `Couldn't save — try again` | `تعذر الحفظ — حاول مجدداً` |
| `editor.edit.field_too_long` | `Too long for this spot` | `النص طويل جداً لهذا الموضع` |
| `common.saved` | `Saved` | `تم الحفظ` |

(`common.saved` already exists from the business-info form — reuse it, do not duplicate.)

## Dependencies

- `epics/04-preview-and-edit/02-text-editing/01-content-autosave-api.md`
- `epics/04-preview-and-edit/01-site-render/02-editor-preview-page.md` (EditorShell owns chrome)
- `epics/04-preview-and-edit/01-site-render/01-template-renderer-engine.md` (edit-mode context `onRequestEdit`)

## Out of scope

- Structural editing (move/add/delete) — permanently out of product scope.
- Rich-text formatting (bold/lists/links) — plain text only.
- Image slot editing (M04), color (M03), regeneration (M05), template switch (M06) — attach into EditorShell in their own milestones.

## Acceptance criteria

- [ ] Tapping any prose field in the preview opens an inline editor prefilled with its current value; committing updates the visible text without a reload.
- [ ] Edits autosave within ~1s and a subtle "Saved"/"تم الحفظ" indicator appears in both locales.
- [ ] Switching language tabs flushes pending edits for the outgoing tab and does not lose the last keystrokes; editing Arabic tab never changes English content and vice-versa.
- [ ] A user edit clears the field's "AI suggested — review this" flag and the review badge disappears after save.
- [ ] Entering text over the field's length limit is blocked locally before it is sent (no request fires).
- [ ] Emptying a field returns it to the dashed "Empty — tap to fill" placeholder.
- [ ] On a forced API failure the entered text remains in the field and an inline "Couldn't save" message shows, with no text loss.
- [ ] Arabic editing is RTL and correctly aligned.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no hardcoded strings; renderer stays pure (all editing lives in the editor feature); no new dependencies.
