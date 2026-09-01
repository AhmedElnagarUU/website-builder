# Task 03 — Template selection screen (Step 2)

## Context

The user now picks the visual identity of their site. Product rules: templates are described by business fit ("Good for service businesses with a booking focus"), never by layout terms; category-matched ones appear first; exactly one must be selected; business info entered in Step 1 is never re-asked or lost.

## Scope

- Page `/{locale}/create/templates?site={id}`.
- Grid of template cards: preview image, plain name, one-line description (all from the definition's localized fields).
- Suggested-first ordering using `GET /api/templates?suggested=true&category={site.category}`; a subtle "Suggested for you" group label; "See all templates" toggle reveals `others` inline.
- Selecting marks the card; Continue activates and persists via PATCH (below), then routes to `/create/language?site={id}`.
- Back link to `/create/business-info?site={id}` — purely navigational, never clears data.
- If a preview image fails to load (`onError`), card falls back to text-only (name + description) instead of a broken image.

## Technical details

Files:

```
src/app/api/sites/[siteId]/template/route.ts          // PATCH handler
src/features/templates/api/update-site-template.ts    // logic
src/features/create-wizard/components/TemplatePicker.tsx
src/features/create-wizard/components/TemplateCard.tsx
src/app/[locale]/create/templates/page.tsx
```

PATCH semantics:
- Body `{ templateId: string }`; validate id exists in catalog → else `422 { error:'invalid_template' }`.
- Ownership rules apply. Sets `templateId` and, when previously empty, initializes `brandColor = template.colors.defaultAccent`.
- Applies `hasUnpublishedChanges` rule. Returns site DTO.
- NOTE (Epic 04 extends this endpoint with template-SWITCH content preservation; here the site has no content yet, so plain assignment is correct — do not build switching logic now).

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `wizard.templates.title` | `Choose your website style` | `اختر نمط موقعك` |
| `wizard.templates.suggested_group` | `Suggested for you` | `مقترحة لك` |
| `wizard.templates.see_all` | `See all templates` | `عرض كل القوالب` |
| `wizard.templates.selected_check` | `Selected` | `تم الاختيار` |
| `wizard.templates.back` | `Back` | `رجوع` |

(Continue reuses `wizard.common.continue`.)

## Dependencies

- `epics/02-site-creation-flow/03-template-library/01-template-format-and-seed-library.md`
- `epics/02-site-creation-flow/03-template-library/02-templates-listing-api.md`
- `epics/02-site-creation-flow/02-business-info-step/02-business-info-form.md`

## Out of scope

- Switching templates after AI content exists (Epic 04 milestone 06).
- Language screen (next milestone).

## Acceptance criteria

- [ ] With site category `restaurant`, Warm Kitchen/Bistro Menu cards render before all others under a "Suggested for you" label; See-all reveals the rest without page reload.
- [ ] Card names/descriptions show Arabic text on `/ar/*`, English on `/en/*`; no layout/design vocabulary anywhere.
- [ ] Exactly-one-selection enforced visually; Continue disabled until one is selected.
- [ ] Continue → PATCH persists `templateId`; GET site confirms it; browser lands on `/create/language?site=…`.
- [ ] Breaking an image URL (devtools) shows the text-only fallback card, not a broken-image icon.
- [ ] Going Back to Step 1 shows all previously typed values intact.
- [ ] RTL: grid order flows right→left, checkmark on the correct side, nothing mirrored incorrectly.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no hardcoded strings; no new dependencies.
