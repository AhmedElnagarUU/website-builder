# Milestone 04 — Language Choice (Step 3)

## Goal

The user explicitly chooses which language version(s) to generate — English only, Arabic only, or both. A location-based default is pre-selected as a suggestion but never auto-confirmed (product invariant: users choose languages; the system never assumes).

## Tasks (execution order)

1. `01-language-config-api.md` — persist choice + suggestion helper.
2. `02-language-choice-screen.md` — the three equal options screen.

## Shared context

- Storage: `languagesRequested` (the user's original explicit choice — immutable after this step) and `activeLanguages` (starts equal to it; Epic 05 settings may change activeLanguages later).
- Values: `'en'` → `['en']`; `'ar'` → `['ar']`; `'both'` → `['en','ar']`.
- On successful save with advance, `currentStep='generating'` — ready for Epic 03's generate call.
- Default-suggestion rule (KISS): if the saved business location string matches any entry in a static list of Arabic-speaking countries/regions (maintained in code, ~22 entries e.g. Saudi Arabia, مصر, UAE, الإمارات, Morocco…), suggest Arabic-first options; otherwise suggest English. It is only a preselection — user must still click Continue.
