# Epic 01 — Foundation: Scaffold, i18n, Auth & App Shell

**One-line purpose:** Stand up the runnable Next.js application with database access, bilingual English/Arabic infrastructure with RTL, email/password authentication, and the shared app shell every other screen lives inside.

## Why this epic matters for the MVP

Nothing else can be built until the app runs, persists data, authenticates users, and renders in two languages/directions. This epic is the dependency root of the entire project. It also locks in the feature-based code organization and the i18n/RTL patterns that all later UI tasks must follow, so drift is impossible.

## Scope boundaries

**In scope**
- Next.js (App Router) + TypeScript + Tailwind scaffold with the canonical feature-based folder layout (defined in Milestone 01).
- MongoDB connection layer + health check.
- i18n infrastructure: `en`/`ar` locales, locale-prefixed routes, `<html lang/dir>` handling, language switcher mechanics.
- better-auth email/password auth: API routes, sign-in/sign-up pages, session helpers, protected-route redirect.
- App shell: navbar (auth-state aware) with language switcher, minimal footer.
- Minimal shared UI primitives (`shared/ui`).

**Out of scope**
- Anything about sites, templates, AI, publishing, or dashboard (later epics).
- OAuth/social login, password reset, email verification (not needed to validate the MVP).
- Landing/marketing pages beyond a trivial redirect after sign-in.
- Design system work beyond the five primitives listed in Milestone 01.

## Milestones (in execution order)

| # | Milestone | One-line description |
|---|---|---|
| 01 | `01-project-scaffold/` | Runnable Next.js app with feature folders, env config, Tailwind, lint/tsc scripts; MongoDB connection + health endpoint. |
| 02 | `02-i18n-foundation.md` | next-intl wired for `en`/`ar`: locale routing, RTL direction, seeded message catalogs, language-switch mechanics. |
| 03 | `03-authentication/` | better-auth setup + API routes; sign-up/sign-in pages with translated strings. |
| 04 | `04-app-shell-navigation.md` | Navbar with auth state + working EN↔AR switcher applied to the localized app layout. |

## Cross-epic dependencies

None — this is the first epic. Every other epic depends on parts of this one.
