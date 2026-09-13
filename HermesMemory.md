# HermesMemory

This file provides context for Hermes Agent when working on the website-builder repository.

## Project Overview

AI-powered website builder MVP. Non-technical business owners answer questions about their business, pick a template and language(s), AI writes the whole website, they lightly edit it, and publish it at a system URL. English and Arabic are first-class from day one.

## Stack

- **Next.js App Router** (TypeScript)
- **better-auth** for authentication (email/password, session cookie-based)
- **MongoDB** (official driver, via `shared/db` singleton)
- **Amazon S3** for image storage (presigned PUT uploads)
- **Tailwind CSS** for styling
- **next-intl** for i18n (EN/AR locales, RTL support)
- **Zod** for schema validation at API boundaries

## Key Conventions

### Codebase Structure
```
src/
  app/
    [locale]/...        ← all localized app pages
    api/...              ← route handlers (thin, delegate to features)
    live/[slug]/...      ← public published websites
  features/              ← feature modules (auth, sites, create-wizard, templates, generation, editor, images, publishing, dashboard)
  shared/
    ui/                 ← UI primitives (Button, Input, Card, Label, Select)
    db/                 ← MongoDB connection singleton ONLY
    auth/               ← better-auth server/client setup
    site-render/        ← site renderer engine
    i18n/               ← locale config helpers
    lib/                ← pure helpers used by 2+ features
  messages/
    en.json
    ar.json
```

### Mandatory Reading Order
1. `CODE_RULES.md` — read in full before writing/modifying code
2. Parent `MILESTONE.md` for the task's milestone
3. The individual task file

### Task Organization
```
epics/
  NN-<epic-slug>/
    EPIC.md
    MM-<milestone-slug>.md or MM-<milestone-slug>/MILESTONE.md + KK-<task-slug>.md
```
Numbers define execution order. Dependencies are binding — never start a task whose dependencies are incomplete.

## Important Rules

- **KISS**: Simple code, no clever abstractions, optimize for readability
- **Feature-based structure**: Organize by feature, not file type
- **No comments for obvious code**: Write self-explanatory code
- **No new npm dependencies** without explicit human approval
- **i18n & RTL by default**: All strings through next-intl, both en/ar, use Tailwind logical properties (ms-*, me-*, ps-*, pe-*, text-start/end)
- **API = route handlers** in `src/app/api/**` — thin handlers that delegate to feature modules
- **No hardcoded user-facing strings**
- **Verification**: `npm run lint`, `npx tsc --noEmit`, `npm run build`

## Development

- Dev server runs on port **3001** (not 3000, to avoid WhatsApp bridge port conflict)
- Publishing and editing are separate actions
- No structural/drag-and-drop editing surface may ever be added
- Manually edited content is never silently overwritten by AI regeneration

## Environment

- DigitalOcean Droplet (Ubuntu)
- code-server running on port 8080 (password: 123456789)