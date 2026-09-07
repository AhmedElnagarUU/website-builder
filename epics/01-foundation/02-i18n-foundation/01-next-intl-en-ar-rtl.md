# Task 01 — Wire next-intl for English/Arabic with RTL

## Context

The product serves non-technical business owners in English and Arabic from day one. Arabic is a first-class RTL version of the UI, not a translation skin. This task installs the internationalization backbone: locale-prefixed routes, direction handling, and the message catalogs all later tasks extend.

## Scope

- Install `next-intl` (approved dependency) and configure it for the App Router.
- Move all pages under `src/app/[locale]/` with a root redirect.
- Locale negotiation middleware (`middleware.ts` at repo root or `src/`): default `en`, detect from `Accept-Language`/cookie, always end up on a prefixed route.
- `<html lang>` + `dir="rtl"` when locale is `ar`.
- Seed `src/messages/en.json` / `ar.json` with the strings listed below.
- A tiny helper `src/shared/i18n/config.ts` exporting `locales = ['en','ar'] as const`, `defaultLocale = 'en'`, and `dirFor(locale)` returning `'ltr' | 'rtl'`.
- Replace the temporary scaffold page: `src/app/[locale]/page.tsx` shows a placeholder heading using the translation layer (it will later redirect based on auth — Milestone 04 handles that; here just render translated text).

## Technical details

- next-intl plugin in `next.config`, request config module (`src/i18n/request.ts` per next-intl docs), `NextIntlClientProvider` in `[locale]/layout.tsx`.
- Root `src/app/page.tsx` (non-localized) redirects to `/en` (or negotiated locale) — keep it minimal; middleware usually intercepts first.
- `generateStaticParams` for locales; reject unknown locales with 404 via layout `validateLocale`.
- Base RTL safety: add a global CSS comment-rule set in `globals.css`: only logical utilities allowed for layout (see CODE_RULES §6). Add `.rtl-flip { rtl:rotate-180 }`-style utility usage note where arrows appear later.

### Strings introduced (use EXACTLY these keys/values)

| Key | en | ar |
|---|---|---|
| `app.name` | `Monomastic` | `Monomastic` |
| `common.loading` | `Loading…` | `جارٍ التحميل…` |
| `common.error.generic` | `Something went wrong. Please try again.` | `حدث خطأ ما. حاول مرة أخرى.` |
| `home.placeholder` | `The website builder starts here.` | `يبدأ من هنا منشئ المواقع.` |

(Nav/auth strings arrive with their features.)

## Dependencies

- `epics/01-foundation/01-project-scaffold/01-initialize-nextjs-project.md`
- `epics/01-foundation/01-project-scaffold/02-mongodb-connection-layer.md`

## Out of scope

- Language switcher UI component (Milestone 04).
- Any product screen content (later epics own their strings).

## Acceptance criteria

- [ ] `/` redirects to `/en`; `/ar` renders the same placeholder with Arabic text.
- [ ] On `/ar/*`, rendered `<html>` has `lang="ar" dir="rtl"`; on `/en/*`, `lang="en" dir="ltr"`.
- [ ] Unknown path prefix `/fr/dashboard` returns 404.
- [ ] All visible text on existing screens comes from message catalogs (zero hardcoded strings — verified by code inspection).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; only approved dependency `next-intl` added; both catalog files contain identical key sets.
