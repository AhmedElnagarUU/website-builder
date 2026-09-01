# Task 02 — Field validation, constraint retry, fallbacks & review flags

## Context

The user must never see broken or overflowing text (product rule), and blank inputs must become plausible-but-flagged suggestions rather than holes. This module is the safety net between raw AI output and stored site content, implementing the contract sections "Verbatim-fact & missing-info handling" and fallback policy from this milestone's `MILESTONE.md`.

## Scope

- `validateAndSanitize(fields, templateDefinition, locale)` → per-field outcome: `ok` | `retried-shorter` | `fallback`.
- Constraint retry: one re-request per violating field asking for a SHORTER version (stricter limit stated), then fallback.
- Fallback placeholder texts (generic, editable, purpose-appropriate) per section type.
- `mergeGeneratedContent(site, locale, generatedFields): Record<string, ContentField>` — builds stored records incl. `reviewFlagged` computation.

## Technical details

Files:

```
src/features/generation/lib/field-validation.ts
src/features/generation/lib/placeholders.ts
src/features/generation/lib/merge-content.ts
```

Validation checks per field:
- Present & non-empty string (trim).
- Within `maxWords` / `maxChars` from its `TemplateField.constraint`.
- Retry call reuses ai-client with a one-field user prompt: same system prompt + "Rewrite ONLY field `<key>` with maximum <limit>. Return the same JSON shape." One attempt only, then fallback.

Placeholders (`placeholders.ts`) — bilingual pairs by section type, e.g.:

| Section | en placeholder | ar placeholder |
|---|---|---|
| hero_headline | `Welcome to {businessName}` | `أهلاً بك في {businessName}` |
| any body/description | `Tell your customers about this here.` | `أخبر عملاءك عن هذا هنا.` |
| cta_button_label | `Contact us` | `تواصل معنا` |
| testimonial quote | `Sample quote — replace with real feedback.` | `اقتباس نموذجي — استبدله برأي حقيقي.` |

(Fallbacks are intentionally dull; they exist to prevent broken layout and get flagged.)

reviewFlagged rules (from milestone contract):
- Supporting input blank → flag. Mapping (KISS, explicit):
  - description blank → flag all hero/about/services prose fields
  - services blank → flag service_N_* fields
  - targetCustomers blank → flag about_body
  - location blank → flag contact_body/footer_text
  - ALL testimonial_quote/author fields always flagged
- origin: `'ai'`; edited:false. Fallback fields: origin `'placeholder'`, flagged true.

## Dependencies

- `epics/03-ai-content-generation/01-generation-engine/01-ai-client-and-prompt-builder.md`
- `epics/03-ai-content-generation/01-generation-engine/MILESTONE.md`

## Out of scope

- Persisting to the site document (Task 03 orchestrates merge→store).
- UI rendering of flags (Epic 04).

## Acceptance criteria

- [ ] Field over maxWords → one shorter-retry issued; if retry passes, outcome `retried-shorter` with new value; if fails again, fallback used — generation continues for remaining fields either way.
- [ ] Missing field key in AI output → treated as violation (fallback), not crash.
- [ ] Site where description+services were blank produces reviewFlagged=true on hero/about/service fields; a fully-filled info run flags only testimonials (+location-dependent when blank).
- [ ] Placeholder text interpolates `{businessName}` correctly in BOTH locales.
- [ ] Pure functions — unit-verifiable without DB/network except the single retry call (injectable).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no new dependencies.
