# Milestone 01 — Project Scaffold & Data Layer

## Goal

A runnable, building, linting Next.js application that follows the canonical feature-based structure and can talk to MongoDB.

## Tasks (execution order)

1. `01-initialize-nextjs-project.md` — create the app, folder skeleton, tooling, `.env.example`, shared UI primitives.
2. `02-mongodb-connection-layer.md` — Mongo singleton client + `GET /api/health`.

## Shared context for both tasks (canonical decisions)

### Canonical folder structure (binding for the whole project)

```
src/
  app/
    [locale]/                     ← ALL localized product pages (next-intl segment)
      layout.tsx                  ← sets <html lang dir>, renders navbar shell
      page.tsx                    ← entry: redirect to /dashboard if signed in, else /sign-in
      auth/sign-in/page.tsx
      auth/sign-up/page.tsx
      dashboard/page.tsx
      create/business-info/page.tsx
      create/templates/page.tsx
      create/language/page.tsx
      create/generating/page.tsx
      sites/[siteId]/editor/page.tsx
      sites/[siteId]/settings/page.tsx
    api/                          ← route handlers only (thin)
    live/[slug]/                  ← public published websites (added in Epic 05)
  features/<feature>/             ← {components/, lib/, repository.ts, schemas.ts, types.ts}
  shared/{ui,db,auth,i18n,lib}
  messages/en.json , ar.json
middleware.ts                     ← repo root (locale negotiation; extended later by Epics 05)
```

Page paths above are the **only** page paths the product will ever use — later epics fill them in; nobody invents new ones.

### Environment variables (complete list — put all of them in `.env.example`)

```
MONGODB_URI=
MONGODB_DB_NAME=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_BASE_URL=          # e.g. https://cdn.example.com (public read base for uploaded objects)
AI_API_BASE_URL=             # OpenAI-compatible endpoint, e.g. https://api.openai.com/v1
AI_API_KEY=
AI_MODEL=                    # e.g. gpt-4o-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITES_DOMAIN=    # e.g. platformsites.com — published sites live at {slug}.{NEXT_PUBLIC_SITES_DOMAIN}
```

### npm scripts required

`dev`, `build`, `start`, `lint`, plus `typecheck` mapping to `tsc --noEmit`.
