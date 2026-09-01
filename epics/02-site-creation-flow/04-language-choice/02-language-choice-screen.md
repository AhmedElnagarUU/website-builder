# Task 02 — Language choice screen (Step 3)

## Context

The last input before AI takes over. Three options must look EQUALLY valid — none visually implied as "the real" default (product requirement). Bilingual needs a one-line explanation of what "both" means: visitors get a switcher on the live site.

## Scope

- Page `/{locale}/create/language?site={id}` with three radio-style option cards:
  - English only / الإنجليزية فقط
  - Arabic only / العربية فقط
  - English + Arabic / الإنجليزية والعربية
- One-line explanation under "both" (string below).
- Default preselection via `suggestLanguageFromLocation(site.businessInfo.location)` (ar-first → preselect "Arabic only"; en-first → "English only"). Preselection is a suggestion ONLY — user must click an option (preselected counts as selected but they still press Continue; never auto-advance).
- Continue disabled until an option is chosen; on click → PATCH with `advance:true` → route `/create/generating?site={id}`.
- Back link to templates page (non-destructive).

## Technical details

Files:

```
src/features/create-wizard/components/LanguageChoice.tsx
src/app/[locale]/create/language/page.tsx
```

Rules:
- Option cards equal size/weight; selection ring identical for all three; no checkmark styling difference between "suggested" vs chosen-by-user.
- RTL: options stack vertically (works identically both directions); text right-aligned in Arabic.
- Strings via next-intl namespace `wizard.language.*`.

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `wizard.language.title` | `Choose your website language` | `اختر لغة موقعك` |
| `wizard.language.option.en` | `English only` | `الإنجليزية فقط` |
| `wizard.language.option.ar` | `Arabic only` | `العربية فقط` |
| `wizard.language.option.both` | `English + Arabic` | `الإنجليزية والعربية` |
| `wizard.language.both_hint` | `Your site gets a small switcher so visitors can pick their language.` | `سيحصل موقعك على مبدّل صغير ليختار الزائر لغته.` |
| `wizard.language.suggested_tag` | `Suggested` | `مقترح` |
| `wizard.templates.back` | *(reuse existing key)* | *(reuse)* |

## Dependencies

- `epics/02-site-creation-flow/04-language-choice/01-language-config-api.md`
- `epics/02-site-creation-flow/03-template-library/03-template-selection-screen.md`

## Out of scope

- Generation itself (Epic 03 starts from this hand-off).

## Acceptance criteria

- [ ] All three options render equally styled; selecting any enables Continue.
- [ ] Site with location "Dubai" opens with "Arabic only" preselected and tagged "مقترح"; user can still choose either other option.
- [ ] Continue → site DTO has correct `languagesRequested`/`activeLanguages` and `currentStep='generating'`; browser lands on `/create/generating?site=…`.
- [ ] Back returns to template step with previous selection still marked.
- [ ] Arabic locale renders fully RTL with Arabic strings.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no hardcoded strings; no new dependencies.
