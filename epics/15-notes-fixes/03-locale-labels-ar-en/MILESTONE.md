# Milestone 03 — Language Labels to "ar"/"en"

## Goal
Normalize every in-app language label to the locale codes `ar`/`en` instead of mixed full names ("العربية", "English", "EN"), per the note: "change the language from name العربيه to ar and english to en."

## Tasks (execution order)
1. **01-normalize-locale-labels.md** — Replace hardcoded labels in four files.

## Shared context (binding for this milestone)
- There is no shared `LOCALE_LABELS` helper (each surface hardcodes inline) — that is the pattern to update without over-engineering; do NOT create a new shared abstraction.
- Template preview shell (`TemplatePreviewShell.tsx:59-71`) already renders raw codes `{lang}` — confirm, do not change.
- No new message keys — the change replaces literal strings, not translation keys.

## Files to change (independent edits)
1. `src/features/shell/components/LanguageSwitcher.tsx:14`
   - **Before:** `const otherLabel = otherLocale === "ar" ? "العربية" : "English";`
   - **After:** `const otherLabel = otherLocale;` (renders `"ar"` or `"en"`).
2. `src/features/publishing/components/LiveLocaleSwitcher.tsx:4-7`
   - **Before:** `{ en: "EN", ar: "العربية" }`
   - **After:** `{ en: "en", ar: "ar" }`
3. `src/features/dashboard/components/SiteCard.tsx:36`
   - **Before:** `const langLabel = srcLangs.map((l) => (l === "ar" ? "العربية" : "English"));`
   - **After:** `const langLabel = srcLangs;` (already `"ar"` or `"en"`).
4. `src/features/landing/components/Languages.tsx:23,40`
   - **Before:** `EN — English` / `AR — العربية`
   - **After:** `EN` / `AR` (keep the red/blue dot + the mono pill styling — just drop the long names).

## Verification (end of milestone)
`/en/dashboard` and `/ar/dashboard` render; navbar toggle shows `"ar"` / `"en"`; published-site switcher shows `"en"` / `"ar"`; landing languages block reads `EN` / `AR`; `tsc --noEmit` + `npm run lint` pass.