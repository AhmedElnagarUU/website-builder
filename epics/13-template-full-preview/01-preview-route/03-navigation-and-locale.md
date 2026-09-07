# Task — Multi-page navigation and locale

## Title
Real page-to-page navigation inside the preview + EN/AR toggle

## Context
A preview must feel like a finished website. With `editMode={false}` the renderer's `HeaderSection` and `CtaSection` emit real anchors whose hrefs are derived from `pageBaseHref` + page slug. Pointing `pageBaseHref` at the preview route gives natural, path-based multi-page navigation for free (full server round-trips on each page — exactly how a real site behaves). Locale is bilingual-first: the shell's toggle switches EN/AR content and RTL direction client-side with no URL change.

## Scope
- **Navigation:** the shell passes `pageBaseHref=\`/preview/${template.id}\``. Header nav links and the CTA button then navigate to `/preview/<id>/<slug>` and back to `/preview/<id>` (home) — real links, real page visits. The preview page resolves the slug to the active page (task 01) and 404s on unknown slugs.
- **Locale toggle:** a small EN/AR pill toggle in the chrome strip:
  - switches `locale` state `"en" | "ar"`;
  - `buildTemplateDemo(template, locale)` recomputes localized `businessInfo` (content is already bilingual in `demo.content`);
  - the page wrapper sets `lang`/`dir` and `NextIntlClientProvider` is keyed/remounted per locale so `useTranslations("site").days` (HoursSection) and all `nav_*`/field labels render in the right language;
  - toggle labels are the language codes `EN`/`AR` (not translated strings).
- **Responsiveness:** nothing extra — the real renderer's `@container` layout resizes with the browser window; verify by resizing rather than adding fake device bars.

## Technical details
- Keep the URL free of the locale (the preview is a single standalone site; localizing via query/path would split page URLs from the demo). Document this decision in code.
- Ensure clicking a link in the header from within the preview navigates to the *other page's* preview URL (slug match), and that `aria-current` highlighting still works (renderer uses `activePageId`).

## Dependencies
- Task 02 shell; task 01 route slug→page resolution.

## Out of scope
- Live-site behavior changes, editor changes, tracking which page was visited.

## Acceptance criteria
- From `/preview/<id>` clicking "About" in the header loads `/preview/<id>/about` with the about page rendered; other pages likewise across all catalog templates (menu/gallery/faq/hours/pricing/team where present).
- Back/home link returns to home page URL.
- EN↔AR toggle swaps copy, day names, and RTL direction without a reload or URL change.
- Resizing the browser reflows the preview (photo hero stacks, mobile header menu appears under a container width, etc.).

## Definition of Done
- `CODE_RULES.md` followed; no new deps; `npx tsc --noEmit` passes; ESLint clean; build verified per the build rule.