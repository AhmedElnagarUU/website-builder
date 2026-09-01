# Task 02 — Editor preview page

## Context

After generation auto-advances here, the user sees their REAL website (not a mockup) and the light controls around it. This page owns editor chrome; the renderer stays pure. It is also where later milestones hang their controls (color popover, regenerate buttons, publish button arrives with Epic 05).

## Scope

- Page `/{locale}/sites/[siteId]/editor` (server component): session + ownership → `404`; route guards:
  - `currentStep === 'generating'` → redirect to `/create/generating?site={id}`.
  - No content at all and step < editing → redirect to matching wizard step (resume rule).
- Chrome layout: top bar = site name, language tabs ("Editing: English / Arabic") shown only when bilingual, device toggle, right side reserved for future actions.
- Device toggle: Desktop (fluid width) / Mobile (~390px centered frame). Mobile frame still fully interactive.
- Language tab switch re-renders renderer with that locale's content + correct dir inside the preview area (the APP chrome keeps app locale direction; the PREVIEW mirrors the edited language's direction — English tab inside Arabic app UI renders LTR content).
- Review-flag badges visible (renderer handles); empty-slot hints active.
- Publish button does NOT exist yet (Epic 05 adds it explicitly — do not stub one).

## Technical details

Files:

```
src/features/editor/components/EditorShell.tsx          // client chrome state (device, tab)
src/features/editor/components/DeviceToggle.tsx
src/features/editor/components/LanguageTabs.tsx
src/app/[locale]/sites/[siteId]/editor/page.tsx         // server: auth/guards/data → EditorShell
```

Rules:
- Site data loaded server-side via repository (no self-fetch).
- Tab state = which locale's `content` snapshot is passed to renderer; switching tabs must not lose unsaved edits (flush hook from Milestone 02 integrates here — coordinate: Milestone 02's save provider wraps EditorShell).

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `editor.device.desktop` | `Desktop` | `حاسب` |
| `editor.device.mobile` | `Mobile` | `جوال` |
| `editor.tab.editing_en` | `Editing: English` | `تحرير: الإنجليزية` |
| `editor.tab.editing_ar` | `Editing: Arabic` | `تحرير: العربية` |

## Dependencies

- `epics/04-preview-and-edit/01-site-render/01-template-renderer-engine.md`
- `epics/03-ai-content-generation/01-generation-engine/03-generate-and-status-endpoints.md` (state it consumes)

## Out of scope

- Text/image/color/regeneration controls (their own milestones attach into EditorShell).
- Publishing UI (Epic 05).

## Acceptance criteria

- [ ] Generated bilingual site opens in editor showing full rendered site; language tabs switch content AND preview direction while app chrome stays RTL-stable.
- [ ] Device toggle visually constrains to phone width and back without reload.
- [ ] Non-owner visiting the URL gets `404`; anonymous gets redirected to sign-in.
- [ ] Site mid-generation redirects to the generating screen; abandoned draft at templates step redirects there.
- [ ] No structural control exists anywhere on this screen (move/add/delete section absent — product criterion).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no hardcoded strings; no new dependencies.
