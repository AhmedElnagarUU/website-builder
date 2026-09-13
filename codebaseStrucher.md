# Codebase Structure & Boundaries — Monomastic (website-version2)

> Goal of this doc: understand **what lives where**, **how the pieces talk to each other**, and **where to go to fix something**.

---

## 1. The Big Picture

This is a **Next.js 15 (App Router)** app called **Monomastic** — an AI website builder.
A non-technical owner answers questions, picks a template + language(s), AI writes the whole site, they lightly edit, and publish at a system URL. English (`en`) and Arabic (`ar`, RTL) are first-class.

```
                    ┌─────────────────────────────┐
                    │      src/ (the app)          │
                    └─────────────────────────────┘
   Browser ──▶ /[locale]/...   app pages (landing, create wizard, dashboard, editor)
          ──▶ /live/...        public published sites (no locale)
          ──▶ /preview/...     template previews (noindex)
          ──▶ /api/...         thin route handlers → delegate to features/
```

The whole app lives in **`src/`**. Everything else at the repo root (`docs/`, `epics/`, `design/`, `newmodern/`, `public/`) is planning, design references, or static assets — NOT application code.

**The golden rule of this repo** (from `CODE_RULES.md`): features are isolated modules. API routes are thin; they authenticate, authorize, and call feature functions. No module reaches into another module's internals — they communicate through the `api/` modules of each feature.

---

## 2. Top-Level Directory Map

| Path | What it is | Do you touch it? |
|---|---|---|
| `src/` | **The entire application** — all code you fix | ✅ Yes |
| `public/templates/` | Static site images + template thumbnails (SVG + JPG) | Sparse |
| `epics/` | Agile planning (Epics → Milestones → Tasks) | Planning only |
| `docs/` | Project docs (01-overview, 02-design, 03-reference, 04-status…) | Planning only |
| `design/landingPage/` | HTML/CSS design variants — source of the "Monomastic" look | Reference only |
| `newmodern/` | Hand-built static site references | Reference only |
| `scripts/` | `fetch-template-images.mjs` — Pexels image fetcher | Occasionally |
| `.env` / `.env.example` | Secrets & config (MongoDB, S3, AI, better-auth, domain) | Config |
| `package.json` | Scripts + approved deps | Rarely; ⚠️ no new deps without approval |
| `CODE_RULES.md` | **Binding coding rules** (read before modifying code) | Read only |
| `AGENTS.md` | Orchestration rules for coding agents | Read only |
| `tailwind.config.ts`, `next.config.ts`, `tsconfig.json`, `postcss.config.js` | Build/config | Config |

**Approved dependencies (do NOT add new ones):** `next` 15.3.3, `react` 19, `tailwindcss` v4, `next-intl` 4.14.1, `better-auth` 1.7.2, `mongodb` 7.6.0, `zod`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`.

**Scripts:** `npm run dev` (port 3001) · `npm run build` · `npm run lint` · `npm run typecheck` (`tsc --noEmit`).

---

## 3. `src/` — the App Tree

```
src\
├── middleware.ts          ← next-intl locale routing guard (skips /live, /preview)
├── globals.css            ← Tailwind v4 + "Monomastic" design tokens + RTL-safety rule
├── layout.tsx             ← root layout (html lang, font variables)
├── i18n\request.ts        ← loads src/messages/{locale}.json
├── messages\en.json       ← UI strings (English)
├── messages\ar.json       ← UI strings (Arabic)
├── app\                   ← Next.js App Router: PAGES + API ROUTES
├── shared\                ← code reused across features (db, auth, site-render, ui)
└── features\              ← 15 feature modules (the actual logic) — see section 4
```

---

## 4. The Two Biggest Ideas: `app/` vs `features/`

This is the **most important boundary** in the whole codebase:

```
app/          = ROUTES + thin glue. "What URL? What page? What API endpoint?"
features/     = THE LOGIC + UI components. "How does the site get created/edited/published?"
shared/       = reusable low-level code. "DB connection, auth singleton, primitives."
```

**Everything in `app/` is thin.** A route handler has 3 jobs:
1. Parse/validate input (zod schemas from the feature).
2. Authenticate + authorize (`getSession()`, check `site.ownerId === session.user.id`).
3. Call one function from a feature's `api/` module and return the result.

If you're fixing "wiring" (wrong URL, missing redirect, 401 logic) → `app/`.
If you're fixing "real behavior" (how a template renders, how content is merged, why generation failed) → `features/`.

---

## 5. Route Map (`app/`)

### 5.1 Pages — `app/[locale]/…`
All app pages live under the `[locale]` segment (always-prefixed, so `/en/...` and `/ar/...`).

| Route | File | Purpose |
|---|---|---|
| `/en` and `/ar` | `page.tsx` | Landing page; redirects signed-in users to dashboard |
| `/auth/sign-in`, `/auth/sign-up` | `page.tsx` | better-auth forms |
| `/create/business-info`, `/create/templates`, `/create/language`, `/create/generating` | `page.tsx` | The 4-step creation wizard |
| `/dashboard` | `page.tsx` | List of user's sites (sites list from `features/dashboard`) |
| `/sites/[siteId]/editor` | `page.tsx` | **The editor** — inline editing + AI regen |
| `/pricing`, `/privacy`, `/terms` | `page.tsx` | Static/marketing pages |

### 5.2 Public published sites — `app/live/…` (NO locale)
Server-rendered from the **published snapshot**, with per-pageview analytics:
```
app/live/
├── layout.tsx                      ← live site chrome
├── [slug]/page.tsx                 ← default page (lang detection)
├── [slug]/[lang]/page.tsx          ← one language
└── [slug]/[lang]/[pageSlug]/page.tsx ← a specific page
```

### 5.3 Template previews — `app/preview/[templateId]/[[...slug]]/page.tsx`
`noindex`, so search engines ignore it.

### 5.4 API — `app/api/…`

| Endpoint | What it does |
|---|---|
| `/api/auth/[...all]` | better-auth (sign-in/sign-up/session) |
| `/api/health` | health check |
| `/api/sites` | POST → create site |
| `/api/sites/[siteId]` | GET / PATCH / DELETE a site |
| `/api/sites/[siteId]/{content, business-info, languages, brand-color, template, switch-template}` | PATCH specific fields |
| `/api/sites/[siteId]/{generate, generation-status}` | start AI generation + poll status |
| `/api/sites/[siteId]/{regenerate, regenerate-section, regenerate-impact}` | AI re-generation |
| `/api/sites/[siteId]/{image-upload, images}` | S3 image upload |
| `/api/sites/[siteId]/{publish, unpublish, analytics}` | publishing + stats |
| `/api/templates`, `/api/templates/[templateId]` | template catalog listing |

**Security invariant:** every owner-scoped route verifies session + ownership, else 401/404.

---

## 6. Feature Modules (`src/features/`) — the Heart of the App

Each feature is a self-contained folder. The **standard internal layout** is:
```
features/<name>/
├── types.ts                ← TypeScript types (the contract)
├── schemas.ts              ← zod validation at API boundaries
├── repository.ts           ← MongoDB reads/writes
├── lib/                    ← pure logic (helpers, builders, client-side)
├── api/                    ← the ONE place app/api route handlers may call
└── components/             ← React components (pages use these)
```

### The 15 features & their jobs

| Feature | Responsibility | Key files |
|---|---|---|
| **auth** | Session helper + sign-in/up forms | `lib/session.ts` (`getSession`, `requireSession`), `components/SignInForm.tsx` |
| **sites** | The core data model (site = businessInfo + languages + template + pages content + images) | `types.ts`, `schemas.ts`, `repository.ts`, `api/` |
| **create-wizard** | 4-step onboarding (business-info → templates → language → generating) | `components/BusinessInfoForm.tsx`, `lib/useAutosaveForm.ts` |
| **templates** | Template catalog + demo content + semantic field registry | `catalog.ts` (**source of truth**), `pages.ts`, `lib/demoContent.ts` |
| **generation** | Async AI writing, polling, error classification | `run-generation.ts`, `api/start-generation.ts`, `lib/prompt-builder.ts`, `lib/merge-content.ts` |
| **regeneration** | Re-generating site/section + impact preview | `run-site-regeneration.ts`, `run-section-regeneration.ts` |
| **editor** | The editing surface (inline fields, images, brand color, autosave 600ms, device toggle, tabs) | `components/EditorShell.tsx`, `lib/SaveProvider.tsx` |
| **publishing** | Publish/unpublish → public live URL + snapshot | `publish-site.ts`, `get-published-site.ts`, `page-shape.ts`, `components/LiveSitePage.tsx` |
| **site-render** | **The site engine** — renders a site from content (shared by editor + live sites) | `SiteRenderer.tsx`, `sections/` (14 section components) |
| **images** | S3 signed uploads | `lib/s3.ts`, `api/request-image-upload.ts` |
| **dashboard** | Site list + analytics panel | `components/SiteCard.tsx`, `SiteAnalyticsPanel.tsx` |
| **monetization** | Plans (free/pro), entitlements/paywalls (402/403) | `plans.ts`, `lib/withEntitlement.ts`, `components/PaywallPrompt.tsx` |
| **analytics** | Pageview recording + aggregation | `repository.ts`, `api/get-site-analytics.ts` |
| **shell** | App chrome (Navbar with plan badge, Footer, LanguageSwitcher) | `components/Navbar.tsx` |
| **template-preview** | Preview shell for browsing templates | `components/TemplatePreviewShell.tsx` |
| **landing** | Marketing page components | `components/Landing.tsx`, `Hero.tsx`, … |

---

## 7. Shared Modules (`src/shared/`) — the Bottom Layer

`shared/` is where feature modules may **import downward** for common infrastructure:

| Module | What it exposes |
|---|---|
| `auth/server.ts` | **Singleton** better-auth instance (email/password + MongoDB adapter) |
| `auth/client.ts` | `createAuthClient()` for browsers |
| `db/client.ts` | MongoClient singleton |
| `db/database.ts` | `getDb()` helper |
| `db/indexes.ts` | DB indexes (sites.ownerId, slug unique, pageviews, subscriptions…) |
| `i18n/config.ts` | `locales: ["en","ar"]`, `dirFor(locale)` → ar = `rtl` |
| `site-render/` | **SiteRenderer + 14 section components** + context + tokens (fonts/radii) |
| `ui/` | Primitives: `Button, Card, Input, Label, Textarea, Select, SectionHead, Stepper, StickyNote, TapeTag`, `fonts.ts` (~20 Google fonts incl. Noto Sans Arabic) |
| `lib/` | `arabic-regions.ts`, `brand-palette.ts`, `image-upload.ts` |

**Dependency direction (THE key boundary):**
```
features/  ──imports──▶  shared/      ✅ allowed
features/  ──imports──▶  features/    ⚠️ only via their api/ modules (never internals)
shared/    ──imports──▶  features/    ❌ forbidden
```

---

## 8. Data Model & DB

One MongoDB database, collections:

| Collection | Purpose |
|---|---|
| `sites` | The big one — see `features/sites/types.ts`. Holds `businessInfo`, `languages`, `templateId`, `brandColor`, per-locale **pages content** (`ContentField`s with `value`/`status`/`pending`), `images` map (slotId → s3Key), `generationStatus`, `publishedSnapshot` (`{content, images, brandColor, liveUrl, publishedAt, version}`) |
| `pageviews` | per slug+lang+page/day aggregates |
| `subscriptions`, `memberships`, `billing` | monetization |
| `user`, `session`, `account`, … | created by better-auth's MongoDB adapter — don't touch |

Key entry points: `features/sites/types.ts` (contract), `features/sites/repository.ts` (all reads/writes), `features/monetization/plans.ts` (limits per plan).

**Ownership invariant:** a site always has `ownerId`; every read/write goes through owner checks.

---

## 9. Key Cross-Feature Flows (how files talk to each other)

### Flow A — "Create a site" (wizard)
```
/[locale]/create/business-info/page.tsx
  → features/create-wizard/components/BusinessInfoForm.tsx
  → POST /api/sites            (app/api/sites/route.ts)
  → features/sites/api/create-site.ts
  → features/sites/repository.ts → createSite() → MongoDB
```

### Flow B — "AI generates my site"
```
POST /api/sites/[siteId]/generate
  → features/generation/api/start-generation.ts
  → features/generation/run-generation.ts
    → features/generation/lib/ai-client.ts  (Gemini OR OpenRouter, 180s timeout)
    → features/generation/lib/prompt-builder.ts (template definition → AI prompt)
    → writes ContentFields with status "pending"
  ← client polls /api/sites/[siteId]/generation-status
    → features/generation/api/get-status.ts
    → UI: features/create-wizard/components/GenerationProgress.tsx (+ useGenerationPolling)
```

### Flow C — "Edit + autosave"
```
/sites/[siteId]/editor (app)
  → features/editor/components/EditorShell.tsx
  → InlineFieldEditor (updates content)
  → features/editor/lib/SaveProvider.tsx  (600ms debounce)
  → PATCH /api/sites/[siteId]/content  → features/sites/api/update-content.ts
```
**Invariant:** AI regeneration merges into `pending` fields and **never silently overwrites** manually-edited content (`features/generation/lib/merge-content.ts` + `/regenerate-impact`).

### Flow D — "Publish"
```
/editor → PublishControl
  → POST /api/sites/[siteId]/publish
  → features/publishing/publish-site.ts   (slug + 6-char UUID suffix)
  → writes publishedSnapshot + liveUrl
→ Public visitors hit /live/{slug}/{lang}/{pageSlug}
  → features/publishing/get-published-site.ts (reads snapshot)
  → features/publishing/components/LiveSitePage.tsx
  → shared/site-render/SiteRenderer.tsx  (renders from snapshot content)
  → features/analytics/repository.ts → recordPageview
```
**Invariant:** Publishing and editing are separate actions; "has unpublished changes" drift indicator lives in the editor.

### Flow E — "Monetization / paywall"
```
UI action → feature api module
  → features/monetization/lib/entitlement.ts → withEntitlement (402/403 {error, plan, limitKey})
  ← client: paywall-client.ts → usePaywall → PaywallPrompt
Limits defined in features/monetization/plans.ts (free: 1 site/4 pages/1 lang/1 published/10MB/2 gens/day; pro: bigger)
```

---

## 10. Rendering the Actual Website (the "site engine")

The `shared/site-render/` module is a **pure content → HTML renderer** used in TWO places — this is why it's shared, not in a feature:

```
Same component tree:
  features/editor EditorShell (edit mode)         features/publishing LiveSitePage (read mode)
        │                                                 │
        └──────────▶ shared/site-render/SiteRenderer.tsx  ◀──────────┘
                     ├── context.ts (edit-mode / brand / nav / style)
                     ├── atoms.tsx + internals.tsx
                     ├── tokens.ts (FONT_FAMILIES, RADIUS_CLASSES, textOnBrand)
                     └── sections/  Header · Hero · Services · About · Testimonials ·
                                      Cta · Contact · Footer · Menu · Gallery · Faq ·
                                      Hours · Pricing · Team
```

To render a "site", data must match the site content model from `features/sites/types.ts` (SiteContent with pages → sections → ContentFields). The **template definition** (`features/templates/catalog.ts` + `pages.ts`) declares which sections exist and the *semantic field keys* each section needs.

---

## 11. Where to Go to Fix X (decision table)

| If you need to fix… | Go to |
|---|---|
| A page not loading / wrong redirect / new URL | `src/app/[locale]/...` |
| An API returns 401/403/404 wrongly | the route in `src/app/api/...` + `features/auth/lib/session.ts` |
| How a site's data is stored/shaped | `src/features/sites/types.ts`, `schemas.ts`, `repository.ts` |
| AI text is wrong / prompt issues | `src/features/generation/lib/prompt-builder.ts` |
| Generation times out / fails | `src/features/generation/run-generation.ts`, `lib/ai-client.ts` |
| Editor save behavior | `src/features/editor/lib/SaveProvider.tsx` |
| How a section looks on the website | `src/shared/site-render/sections/<Section>.tsx` |
| Add/remove a section or a template field | `src/features/templates/catalog.ts` (registry!) + `src/features/templates/pages.ts` |
| Translation strings | `src/messages/en.json` / `ar.json` |
| RTL/direction issues | `src/shared/i18n/config.ts` + RTL-safe utilities only (`ms-`, `me-`, `ps-`, `pe-`, `text-start`) |
| Login/logout/session | `src/shared/auth/server.ts` + `features/auth/lib/session.ts` |
| Publish/live URL issues | `src/features/publishing/publish-site.ts`, `live-url.ts`, `app/live/` |
| Image upload errors | `src/features/images/lib/s3.ts` + `.env` S3 vars |
| Plan limits / paywall | `src/features/monetization/plans.ts`, `lib/entitlement.ts` |
| Analytics numbers wrong | `src/features/analytics/repository.ts` |
| Design tokens / colors / fonts | `src/globals.css` + `src/shared/ui/fonts.ts` |
| DB connection / indexes | `src/shared/db/*` |
| Template thumbnails / images missing | `public/templates/` + `scripts/fetch-template-images.mjs` |

---

## 12. Rules That Keep This Structure Alive (from `CODE_RULES.md`)

1. **Feature-based structure** — keep code inside its feature; shared stuff goes in `shared/`.
2. **Thin API routes** — delegate to feature `api/` modules; never put business logic in `app/api`.
3. **No new npm dependencies** without explicit human approval.
4. **No drag-and-drop / structural editor** — editing is inline-field based only (product invariant).
5. **Never silently overwrite manually-edited content** with AI regeneration.
6. **Publishing and editing are separate actions.**
7. **Arabic is a first-class RTL version** — never a translated skin of English.
8. **Verify** with `npm run lint`, `tsc --noEmit`, and `npm run build` after any change.

---

## 13. Gotchas / Sensitive Notes

- ⚠️ `signin.txt` at the root contains a **real better-auth test session token** — treat as sensitive, never commit it.
- `.env` has real secrets — never search, log, or commit it.
- `lrt` (1.44 MB binary) and `let` (0 B) at the root are stray artifacts, not source code.
- `@/*` in imports = `./src/*`.
- Dev server runs on port **3001** (not 3000).
- `docs/03-reference` is the source of truth for template structure.