# Task 01 — Navbar with language switcher and app shell

## Context

The product requires a language switcher available on every page (product invariant). Users are non-technical and often on phones; switching between English and Arabic must be one obvious tap that preserves where they are. The navbar also reflects auth state so signed-in users can reach the dashboard and sign out.

## Scope

- `Navbar` component: left/start — app name (`app.name`); end — auth-aware actions + language switcher.
  - Signed out: "Sign in" link, "Create account" link.
  - Signed in: "Dashboard" link + "Sign out" button.
- `LanguageSwitcher` component: a small toggle showing the OTHER locale's name (e.g. on an English page it shows "العربية"; on Arabic pages "English"). Clicking swaps the `[locale]` URL segment in place, preserving the rest of the path and query string.
- Footer: single line with app name + © year. Minimal by design.
- Wire shell into `src/app/[locale]/layout.tsx` so every localized page gets it.
- Root page behavior: `src/app/[locale]/page.tsx` redirects to `/{locale}/dashboard` if a session exists, else to `/{locale}/auth/sign-in`.

## Technical details

Files:

```
src/shared/ui/Navbar.tsx?            ← NO: navbar is product chrome → src/features/shell/components/Navbar.tsx
src/features/shell/components/LanguageSwitcher.tsx
src/features/shell/components/Footer.tsx
```

(Create feature folder `shell`. It is used by all features but is itself a leaf — importing from every feature would couple it; keep it dumb: it receives session state via props from the server layout.)

Rules:
- Language switch uses `usePathname`/`useSearchParams` from next/navigation + `router.replace` with the swapped locale prefix. Direction change is automatic via `<html dir>` already handled in Milestone 02.
- Navbar reads session server-side in `[locale]/layout.tsx` (via `getSession()` from `features/auth/lib/session`) and passes a plain `{ isSignedIn }` prop down. No client-side session fetching.
- Sign-out button calls better-auth client `signOut()` then routes to `/{locale}/auth/sign-in`.
- Active/hover styles only; no dropdown menus.

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `nav.dashboard` | `Dashboard` | `لوحة التحكم` |
| `nav.sign_in` | `Sign in` | `تسجيل الدخول` |
| `nav.sign_up` | `Create account` | `إنشاء حساب` |
| `nav.sign_out` | `Sign out` | `تسجيل الخروج` |
| `nav.language_switch_label` | `Switch language` | `تبديل اللغة` |

## Dependencies

- `epics/01-foundation/03-authentication/01-better-auth-setup-and-api.md`
- `epics/01-foundation/03-authentication/02-sign-in-sign-up-pages.md`
- `epics/01-foundation/02-i18n-foundation/01-next-intl-en-ar-rtl.md`

## Out of scope

- Dashboard page content (Epic 06 builds it; placeholder until then).
- Any branding/logo asset beyond text app name.

## Acceptance criteria

- [ ] On `/en/dashboard` (signed in), navbar shows Dashboard + Sign out; clicking Sign out lands on `/en/auth/sign-in` and session is gone.
- [ ] Clicking "العربية" while on `/en/auth/sign-in` navigates to `/ar/auth/sign-in`, direction flips to RTL, path otherwise identical.
- [ ] Signed-out users see Sign in / Create account links on every page.
- [ ] At 375px viewport width nothing overflows horizontally in either locale.
- [ ] Anonymous visit to `/en` ends at `/en/auth/sign-in`; signed-in visit ends at `/en/dashboard`.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no new dependencies; shell components contain no business logic.
