# Task — Normalize Locale Labels to "ar"/"en"

## Title
Replace the four remaining hardcoded full-language-name labels with the locale codes.

## Context
Four surfaces use hardcoded `EN`/`العربية`/`English`/`English`+`AR — العربية`; the rest (template preview shell) already show codes. No shared helper exists; the cleanest fix is inline replacement at each site.

## Scope
Edit the four files as specified by the milestone (verbatim before/after strings given there). No new imports, no new shared constants, no new message keys.

## Dependencies
CODE_RULES.md.

## Out of scope
Changing the preview shell (already correct). Creating a shared `LOCALE_LABELS` constant.

## Acceptance criteria
1. All four surfaces display `"en"` and `"ar"` — verify in both locales via browser.
2. No hardcoded `English`, `العربية`, or `EN` labels remain in app UI (grep for them — only accept the two landing `Languages.tsx` decorative `EN`/`AR` text if you chose to keep it, which matches the note).
3. `tsc --noEmit` + `npm run lint` pass.