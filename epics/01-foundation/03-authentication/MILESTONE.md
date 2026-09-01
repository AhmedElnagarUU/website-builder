# Milestone 03 — Authentication (better-auth)

## Goal

Users can register, sign in, and sign out with email/password. Sessions are cookie-based and verifiable server-side; protected areas redirect unauthenticated users to sign-in.

## Tasks (execution order)

1. `01-better-auth-setup-and-api.md` — better-auth instance (MongoDB adapter), catch-all API route, client + server session helpers, sign-out endpoint behavior.
2. `02-sign-in-sign-up-pages.md` — localized auth pages wired to the client, redirects after success.

## Shared context

- Auth library is `better-auth` (approved). Database is MongoDB via `getDb()` from `shared/db`.
- better-auth mounts ALL its endpoints under **`/api/auth/[...all]`** — no custom auth routes beyond that.
- Session helper contract used by every later feature:

```ts
// src/features/auth/lib/session.ts
getSession(): Promise<{ user: { id: string; email: string; name?: string } } | null>
```

- Ownership rule for ALL site APIs (defined once here, enforced everywhere): if `getSession()` returns null → `401`; if the requested resource's `ownerId !== session.user.id` → `404` (do not reveal existence).
- After successful sign-in/sign-up, the app redirects to `/{locale}/dashboard`. The dashboard page itself arrives in Epic 06; until then it may be a placeholder page that requires session and shows the user's email.
