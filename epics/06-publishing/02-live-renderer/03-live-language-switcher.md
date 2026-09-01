# Task 03 — Live page language switcher (first-class per-locale EN ⇄ AR)

## Context

The published site can be bilingual (the snapshot stores `activeLanguages`, which may include both `en` and `ar`). The live page must let a visitor switch between published locales as first-class pages — `/live/[slug]/en` ⇄ `/live/[slug]/ar` — each its own URL with its own content, never a client-side "translate this page" skin. Arabic is a first-class RTL version, not a translation skin (product invariant).

## Scope

- A small, unobtrusive switcher on the live page shell that appears only when the snapshot's `activeLanguages.length > 1`.
- Renders links to the alternate locale's absolute URL; the current locale is shown as active/disabled.

## Technical details

- Place in the live shell (Task 02's page or a `LiveLocaleSwitcher` component under `src/features/publishing/components/`), outside the site content itself so it never interferes with the customer site's design.
- Render plain anchor tag links (`<Link href="/live/{slug}/ar">`) — a full page load to the alternate locale URL. No stateful SPA locale toggle.
- Only for locales actually active in `publishedSnapshot.activeLanguages`. If only one locale, render nothing.
- Direction-safety: the switcher uses logical CSS properties and inherits the `dir` of the surrounding page (`dir="rtl"` for `/ar`) so it never mis-mirrors.
- Labels: use existing next-intl messages via the product's message files if the switcher carries user-facing text (e.g. language names "EN"/"العربية"). Add any new strings to BOTH `src/messages/en.json` and `src/messages/ar.json`. For a bare public page outside `[locale]` routing, resolve locale/labels from a light static map consistent with the product's locale config (`src/shared/i18n`) rather than next-intl's request locale (the live site has no locale-prefixed product context).

## Dependencies

- Task 02 (the live page it augments).

## Out of scope

- Editing mode or any control that modifies content.
- Structurally altering the site (no add/move/delete).
- Auto-detecting/redirecting language without an explicit `[lang]` segment.

## Acceptance criteria

- [ ] On a bilingual published site, the switcher offers links to both `/live/[slug]/en` and `/live/[slug]/ar`; each is a distinct first-class URL.
- [ ] Arabic `/ar` switcher UI renders RTL-correct (`dir="rtl"` inherited) with logical properties.
- [ ] A single-locale site renders no switcher.
- [ ] The switcher never renders an editing/structural control.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; first-class locales (never a translation skin); RTL-safe; no new deps; strings (if any) added to `en.json` + `ar.json`.
