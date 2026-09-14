# Epic 17 — MVP Stabilization

## Purpose
Fix all MVP blockers identified in the Mission 01 gap analysis so the product meets its MVP definition: a complete, functional, bilingual (EN/AR) website builder that works end-to-end.

## Why This Epic Matters
The MVP is functionally complete but has critical issues that prevent it from being considered a stable, deployable MVP:
1. Image upload is broken (S3 region mismatch + missing public base URL)
2. Full-site regeneration contradicts its own acceptance criterion
3. Arabic users see English error strings (hardcoded strings in 3 components)
4. `<html lang/dir>` is not set at the document level (Arabic pages lack proper attributes)
5. No site settings page exists (language config change after creation is unreachable)
6. Save errors are never surfaced to the user

These are all **MVP BLOCKERS** — without fixing them, the product cannot be considered a working MVP.

## Scope Boundaries

### In Scope
- Fix S3 configuration: set `S3_REGION=us-east-1` in `.env`, set `S3_PUBLIC_BASE_URL`
- Fix full-site regeneration: ensure confirmed regeneration overwrites `edited:true` fields
- Convert hardcoded English strings to next-intl keys in 3 components
- Create site settings page at `sites/[siteId]/settings/page.tsx`
- Fix `<html lang/dir>` to apply locale attributes at document level
- Wire `SaveProvider.errors` state to visible UI in the editor

### Out of Scope
- Adding new features beyond fixing existing gaps
- Architectural rewrites
- Epic 12 (Super Admin) work
- Epic 13 (Template Preview) completion
- Epic 14/16 remaining items (template richness already resolved)

## Dependencies
None — all tasks are independent and can be prioritized by impact.

## Tasks (in execution order)

### T01 — Fix S3 Configuration
**Classification:** BUG FIX + INFRASTRUCTURE
- Set `S3_PUBLIC_BASE_URL` in `.env` (already has `S3_REGION=us-east-1`)
- Update `.env.example` to reflect correct `S3_REGION=us-east-1` default
- Verify upload pipeline works end-to-end (presigned PUT → PATCH record)
- **Acceptance:** Image upload succeeds, image renders in editor preview
- **Validation:** Manual upload test through editor

### T02 — Fix Full-Site Regeneration Confirm Semantics
**Classification:** BUG FIX
- **Evidence:** `src/features/generation/lib/merge-content.ts:89-96` — `mergePageContent` always skips `edited:true` fields, even when `confirm:true` is passed
- Fix `run-site-regeneration.ts` to pass a `force` flag through to `mergePageContent` when the user confirms
- Preserve `edited:true` protection for section-level regeneration
- **Acceptance:** When user confirms full-site regeneration, all fields (including previously edited) are regenerated
- **Validation:** typecheck + manual test: edit a field, regenerate site with confirm, verify field changed

### T03 — Convert Hardcoded English Strings to next-intl
**Classification:** BUG FIX
- **Evidence:** `src/features/create-wizard/components/TemplatePicker.tsx:43` ("Could not save template"), `src/features/create-wizard/components/LanguageChoice.tsx:57` ("Could not save"), `src/features/editor/components/ChangeTemplateControl.tsx:73/76/86` ("Couldn't switch template — try again.")
- Add translation keys to `en.json` and `ar.json` for all error messages
- Replace hardcoded strings with `t("key")` calls
- **Acceptance:** All user-facing strings in these 3 components use next-intl
- **Validation:** Grep for hardcoded strings in these files, verify typecheck

### T04 — Create Site Settings Page
**Classification:** FEATURE
- **Evidence:** `src/app/[locale]/sites/[siteId]/settings/page.tsx` declared in scaffold MILESTONE but not created; PRD §16.4 references "basic website settings"
- Create page with: site name display, language configuration (add/remove languages), basic site info
- Follow existing route patterns (owner-scoped, session-based)
- Use existing `update-languages` API for language changes
- **Acceptance:** Page loads for site owner, allows language config change, shows site name
- **Validation:** typecheck + manual verification

### T05 — Fix `<html lang/dir>` Application
**Classification:** BUG FIX
- **Evidence:** `src/app/layout.tsx:10` hardcodes `<html lang="en" dir="ltr">`; `src/app/[locale]/layout.tsx` applies locale attrs to an inner `<div>`
- Root layout must set `<html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>` based on the current locale
- Live routes (`/live/[slug]/[lang]`) already handle their own lang/dir on a wrapper div
- **Acceptance:** Arabic pages have `lang="ar" dir="rtl"` on `<html>`; English pages have `lang="en" dir="ltr"`
- **Validation:** Inspect `<html>` tag in browser for both locales

### T06 — Wire Save-Error UI
**Classification:** BUG FIX
- **Evidence:** `SaveProvider` exposes `errors` state but no component consumes it; `editor.edit.save_error` key exists in messages but unused
- Add error display in `EditorShell` or `InlineFieldEditor` that consumes `SaveProvider.errors`
- Show non-blocking error + retry on save failure
- **Acceptance:** Save failures are visible to the user with a retry option
- **Validation:** Manual test: trigger a save failure, verify error is shown

## Acceptance Criteria (Epic Wide)
- All 6 tasks completed
- `npm run lint` passes with 0 warnings
- `npx tsc --noEmit` passes with 0 errors
- Image upload works end-to-end
- No hardcoded user-facing strings remain in the 3 specified components
- Site settings page is accessible for site owners
- `<html>` tag has correct `lang`/`dir` for both locales
- Registration errors are surfaced in the editor UI

## Validation
1. Run `npm run lint` and `npx tsc --noEmit`
2. Manual verification of each fix:
   - Upload an image through the editor
   - Edit a field, then do full-site regeneration with confirm
   - Trigger errors in TemplatePicker, LanguageChoice, ChangeTemplateControl (verify Arabic)
   - Access `/en/sites/[siteId]/settings` and `/ar/sites/[siteId]/settings`
   - Inspect `<html>` tag in browser dev tools for EN and AR pages
   - Trigger a save error in the editor

## Risks
- S3 config may require AWS-side changes beyond `.env` (region is server-side config, but bucket policy may still need updating)
- `<html lang/dir>` change may require careful handling of Next.js App Router layout nesting
- Site settings page may need additional APIs beyond what exists (language change is the only one needed)

## Expected Outcome
All MVP blockers resolved. The product is a functional MVP that works in both English and Arabic.
