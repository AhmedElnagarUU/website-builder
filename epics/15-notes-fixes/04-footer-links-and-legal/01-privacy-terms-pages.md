# Task — Privacy & Terms Pages

## Title
Create public `/[locale]/privacy` and `/[locale]/terms` pages with the milestone's EN + AR legal copy.

## Context
No legal routes exist and the footer's privacy/terms links are dead. These pages give the footer its targets and satisfy the note.

## Scope
- `src/app/[locale]/privacy/page.tsx` and `src/app/[locale]/terms/page.tsx` — server components following `dashboard/page.tsx`'s pattern (`setRequestLocale(locale)`); each uses `getTranslations("legal.privacy")` / `getTranslations("legal.terms")`.
- Layout per page: `<section className="container mx-auto max-w-3xl px-4 py-10 sm:px-6">`, a `mono-display` `text-5xl` title, a small `last_updated` line (mono, `text-ink-3`), then the numbered sections — each a `mono-display` `text-2xl` heading + `font-serif2` body paragraph (`text-ink-2`, `leading-relaxed`). Respect RTL automatically via the layout (`dir`).
- Both pages come from the milestone's message keys — do not copy text into the components.

## Dependencies
CODE_RULES.md; `src/app/[locale]/layout.tsx` (provides Navbar + Footer + messages).

## Out of scope
Any auth/business logic on these pages; an "About" page; dynamic legal content.

## Acceptance criteria
1. All four routes (`/en/privacy`, `/ar/privacy`, `/en/terms`, `/ar/terms`) return 200 with correct localized content (verify ar pages render Arabic, RTL, with the vertem AR strings, not transliterations).
2. Content renders from message keys (no hardcoded legal prose in components).
3. `tsc --noEmit` + `npm run lint` pass.