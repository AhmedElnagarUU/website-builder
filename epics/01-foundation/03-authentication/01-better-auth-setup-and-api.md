# Task 01 — Set up better-auth with MongoDB and auth API routes

## Context

Users must have an account before creating websites (each site has exactly one owner). The PRD deliberately does not design fancy auth UX — this is standard email/password plumbing kept as thin as possible so later features can rely on `getSession()`.

## Scope

- Configure better-auth with the MongoDB adapter, email/password enabled.
- Mount better-auth's catch-all handler at `/api/auth/[...all]`.
- Provide client (`createAuthClient`) and server session helpers per the contract in `MILESTONE.md`.
- Add a `protected` server helper: `requireSession()` that redirects to `/{locale}/auth/sign-in` when unauthenticated (for use in server layouts/pages).

## Technical details

Files:

```
src/shared/auth/server.ts   // betterAuth({ database: mongodbAdapter(getDb()), emailAndPassword: { enabled: true } })
src/shared/auth/client.ts   // createAuthClient() from "better-auth/react", baseURL = NEXT_PUBLIC_APP_URL
src/features/auth/lib/session.ts  // getSession(), requireSession(locale) per MILESTONE contract
src/app/api/auth/[...all]/route.ts // { GET, POST } → auth.handler
```

Notes:
- `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` env vars are already in `.env.example` (Milestone 01). Fail fast with clear message if missing.
- Session storage: cookie-based (better-auth default). Do not customize session lifetimes beyond defaults.
- User name is optional at registration (collected by Task 02's sign-up form).
- better-auth creates its own collections (e.g. `user`, `session`, `account`) — do not manage them manually.

## Dependencies

- Milestone 01 tasks (scaffold + Mongo layer).
- Milestone 02 (i18n) — because redirect targets are locale-prefixed.

## Out of scope

- Sign-in/sign-up UI pages (Task 02 of this milestone).
- Password reset, email verification, OAuth, rate limiting beyond library defaults.
- Any site/website data model (Epic 02).

## Acceptance criteria

- [ ] `POST /api/auth/sign-up/email` with `{ email, password, name }` creates a user in MongoDB and returns a session cookie (verify via curl with cookie jar).
- [ ] `POST /api/auth/sign-in/email` with valid credentials returns `200` + session cookie; invalid credentials return `401`.
- [ ] `GET /api/auth/get-session` with the cookie returns the session JSON; without it returns `null`.
- [ ] `POST /api/auth/sign-out` invalidates the session; subsequent `get-session` returns null.
- [ ] `requireSession('/en')` redirects an anonymous visitor to `/en/auth/sign-in` (verified via a temporary test page or unit-level check).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; only approved dependency `better-auth` added; no business logic inside the route file (thin handler delegating to `shared/auth`).
