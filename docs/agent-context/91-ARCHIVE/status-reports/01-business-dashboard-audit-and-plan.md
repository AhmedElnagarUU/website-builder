# Phase 1 — Codebase Audit Report

## Project: AI-Powered Website Builder MVP
**Repository:** `/root/website-builder` (git cloned, 25 commits, actively developed)

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.3.3 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 4 (Vexo "paper and ink" design system) |
| Auth | better-auth (email/password + phone plugin, session cookie) |
| Database | MongoDB via Mongoose (`getModel` pattern) |
| i18n | next-intl (EN/AR locales, RTL, locale-prefixed routes) |
| Validation | Zod (at API boundaries) |
| Storage | AWS S3 (presigned PUT uploads) |
| AI | LangChain + Google Generative AI / OpenRouter |
| Payments | Paymob + Polar (plan-based limits via `withEntitlement`) |

### Architecture Patterns

#### 1. Routing: `[locale]` segment + locale-prefixed URLs
- Middleware (`src/middleware.ts`): negotiates locale, routes `/[locale]/...` for i18n, passes through `/live/...` and `/preview/...`
- Layout: `src/app/[locale]/layout.tsx` — wraps children in `NextIntlClientProvider`, `PaywallProvider`, `Navbar`, `Footer`
- Public published sites: `/live/[slug]/[lang]/[pageSlug]` (outside locale routing)

#### 2. Feature-based folder structure (CODE_RULES.md §2)
```
src/
  app/                    ← routing only: pages are thin wrappers, api/ routes are thin handlers
    [locale]/             ← all localized app pages
    live/[slug]/          ← public published websites
    api/                  ← route handlers (thin)
  features/               ← feature modules: {components/, lib/, api/, repository.ts, schema*.ts, types.ts}
  shared/
    ui/                   ← UI primitives (Button, Card, Input, etc.)
    db/                   ← MongoDB/Mongoose connection singleton + getModel
    auth/                 ← better-auth server/client setup
    site-render/          ← SiteRenderer engine (used by editor AND live site)
    i18n/                 ← locale config helpers
    lib/                  ← pure helpers used by 2+ features
  messages/
    en.json, ar.json      ← i18n catalogs
```

#### 3. API Layer Pattern (thin handlers → feature API → repository)
```
Route Handler (app/api/.../route.ts)
  → Feature API fn (features/.../api/<fn>.ts)
    → getSession() → check ownership → zod validate → repository
  → Returns typed result {ok: true, ...} | {ok: false, error: "..."}
  → Route handler maps result to HTTP status
```
**Auth pattern:** `getSession()` → `getSiteForOwner(siteId, session.user.id)` enforces ownership at repository level.
**Entitlement pattern:** `withEntitlement({siteId, limitKey}, handler)` wraps handlers for plan limits.

#### 4. Database: Mongoose model convention
- `getModel(name, schema)` in `shared/db/mongoose.ts` — singleton pattern with `global._mongooseConnectionPromise`
- Schemas use `ownerId: mongoose.Schema.Types.ObjectId` for ownership
- Indexes: `{ ownerId: 1 }` on site-scoped queries, `{ slug: 1 }` unique+sparse
- Manual schema definitions in `features/<feature>/<entity>.schema.ts`
- TypeScript interfaces in `types.ts`, DTO converters like `toSiteDTO()`

#### 5. Site Model (`features/sites/`)
**Site schema fields:** `ownerId`, `status` (draft/published/unpublished), `currentStep` (wizard), `businessInfo` (name, category, description, services, contact info, usps, notes), `templateId`, `languagesRequested`, `activeLanguages`, `content` (per-page per-locale field-value), `images`, `brandColor`, `slug`, `publishedSnapshot`, `hasUnpublishedChanges`, `generation`, timestamps.

**Site ownership:** Enforced in repository via `findOne({ _id, ownerId: ownerOid })`. Every API handler uses `getSiteForOwner(siteId, session.user.id)`.

**Site categories:** services, restaurant, retail, professional, portfolio.

#### 6. Templates
- Static catalog in `features/templates/catalog.ts` — 7 templates
- Templates define pages, sections, content fields (keys like `service_1_title`, `nav_services`, `hero_headline`)
- Templates have per-template design palettes (CSS variables) and font stacks
- Services in templates are **content fields** — AI-generated, page-local text. Not database entities.

#### 7. Design System (Vexo "paper and ink")
- **Colors:** `bg-paper`, `bg-paper-2`, `text-ink`, `text-ink-2`, `text-ink-3`, `mono-red` (accent), `border-ink`
- **Containers:** `Card` (paper surface), `SectionHead`, `TapeTag`, `Stepper`
- **Typography:** `mono-display` (header font), `font-serif2` (body serif), `mono-page` (page bg)
- **Borders:** `rounded-[4px]`, `border-[1.5px] border-ink`, `shadow-mono`
- **Layout:** Uses `container mx-auto max-w-5xl px-4 py-10` pattern for pages
- **Buttons:** `Button` with `primary`/`default`/`ghost` variants, `rounded-full`, `border-2`
- **RTL:** `ms-*`, `me-*`, `start-*`, `end-*`, `rtl:rotate-180` for directional icons

#### 8. i18n
- Messages in `src/messages/en.json` and `ar.json`
- Namespaces: `app`, `common`, `landing`, `dashboard`, `auth`, `analytics`, etc.
- Server: `getTranslations("namespace.key")`
- Client: `useTranslations("namespace.key")`
- Bilingual text types (`{ en: string, ar: string }`) used in templates

#### 9. Business Data Flow
```
1. User creates site (POST /api/sites) → Site with ownerId, currentStep: "business_info"
2. User fills business info → PATCH /api/sites/[siteId]/business-info
3. User picks template → PATCH /api/sites/[siteId]/template
4. User picks language → PATCH /api/sites/[siteId]/languages
5. AI generates content → POST /api/sites/[siteId]/generate
6. User edits content → PATCH /api/sites/[siteId]/content
7. User publishes → POST /api/sites/[siteId]/publish → creates slug, snapshot
8. Live site renders at /live/[slug]/[lang]/...
```

### Existing Business-Related Infrastructure
- **Site schema already has `businessInfo`** with: name, category, description, services (free-text), contactPhone, contactEmail, usps, notes
- **Site categories** already include `services` (service businesses)
- **Analytics feature** (`features/analytics/`) already tracks pageviews per site
- **Monetization** already has plan-based limits and trial system
- **No existing Customer or Service entities** — these don't exist yet
- **No existing Request/Lead model** — doesn't exist yet
- **Dashboard page** (`/[locale]/dashboard`) lists user's sites with analytics — not site-scoped business dashboard
- **Editor** at `/[locale]/sites/[siteId]/editor` is the content editing interface

### What Does NOT Exist (Needs Building)
1. **Customer model** — no customer entity in the codebase
2. **Service model** — services exist only as AI-generated content fields, not as managed entities
3. **ServiceRequest model** — no lead/request tracking
4. **Business dashboard** — the dashboard page shows sites, not business data
5. **Public request form** — no visitor-facing submission form on live sites
6. **Admin-side management UI** for customers, services, requests

---

# Phase 2 — Architecture Plan

## Data Models

### 1. Service (`features/services/`)
```typescript
interface Service {
  _id: Types.ObjectId;
  siteId: Types.ObjectId;        // scoped to site
  ownerId: Types.ObjectId;       // for ownership queries
  name: string;                  // service name (e.g., "Web Design")
  description: string;           // optional, longer
  image?: string;                // S3 key for image/icon
  active: boolean;               // false = archived/inactive
  sortOrder: number;             // for ordering in public form
  createdAt: Date;
  updatedAt: Date;
}
```
**Indexes:** `{ siteId: 1, sortOrder: 1 }`, `{ siteId: 1, ownerId: 1 }`

### 2. Customer (`features/customers/`)
```typescript
interface Customer {
  _id: Types.ObjectId;
  siteId: Types.ObjectId;
  ownerId: Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  notes: string[];               // internal notes, never shown publicly
  createdAt: Date;
  updatedAt: Date;
}
```
**Indexes:** `{ siteId: 1, ownerId: 1 }`, `{ siteId: 1, email: 1 }` (sparse unique per site), `{ siteId: 1, phone: 1 }` (sparse unique per site)
**Dedup strategy:** On request submission, find existing customer by email or phone within the same site.

### 3. ServiceRequest (`features/requests/`)
```typescript
type RequestStatus = "new" | "contacted" | "in_progress" | "completed" | "cancelled";

interface RequestStatusHistoryEntry {
  status: RequestStatus;
  changedAt: Date;
  changedBy: string;             // user ID; "system" for auto-created
}

interface RequestNote {
  _id: Types.ObjectId;
  note: string;
  createdAt: Date;
  createdBy: string;             // user ID (always a dashboard user, never public)
}

interface ServiceRequest {
  _id: Types.ObjectId;
  siteId: Types.ObjectId;
  ownerId: Types.ObjectId;
  customerId: Types.ObjectId;    // ref → Customer
  serviceId?: Types.ObjectId;    // ref → Service (optional; request might be general)
  message: string;
  status: RequestStatus;
  statusHistory: RequestStatusHistoryEntry[];
  internalNotes: RequestNote[];
  createdAt: Date;
  updatedAt: Date;
}
```
**Indexes:** `{ siteId: 1, createdAt: -1 }`, `{ siteId: 1, status: 1 }`, `{ siteId: 1, customerId: 1 }`

### Model Relationships
```
Site (existing)
 │
 ├── Service
 │      └── ServiceRequest (serviceId → Service._id)
 │
 ├── Customer
 │      └── ServiceRequest (customerId → Customer._id)
 │
 └── ServiceRequest
        ├── statusHistory[] (embedded)
        └── internalNotes[] (embedded)
```

## API Endpoints

### Dashboard (authenticated, site-scoped)
```
GET    /api/sites/[siteId]/services             → list services
POST   /api/sites/[siteId]/services             → create service
GET    /api/sites/[siteId]/services/[id]        → get service
PATCH  /api/sites/[siteId]/services/[id]        → update service
DELETE /api/sites/[siteId]/services/[id]        → delete service

GET    /api/sites/[siteId]/customers            → list customers (paginated, searchable)
GET    /api/sites/[siteId]/customers/[id]       → get customer
PATCH  /api/sites/[siteId]/customers/[id]       → update customer (name, email, phone, notes)
DELETE /api/sites/[siteId]/customers/[id]       → delete customer (if no requests)

GET    /api/sites/[siteId]/requests             → list requests (filterable by status, search)
GET    /api/sites/[siteId]/requests/[id]        → get request detail
PATCH  /api/sites/[siteId]/requests/[id]/status  → update status (with history)
POST   /api/sites/[siteId]/requests/[id]/notes   → add internal note

GET    /api/sites/[siteId]/dashboard/overview   → aggregate stats (customers, requests by status)
```

### Public (unauthenticated, untrusted)
```
GET  /api/live/[slug]/services    → list active services (for public form dropdown)
POST /api/live/[slug]/requests   → submit a service request (creates/finds customer)
```

## Dashboard Routes (App Router)
Following existing pattern: `/[locale]/sites/[siteId]/...`
```
/[locale]/sites/[siteId]/dashboard/page.tsx                    → Overview (stats + recent activity)
/[locale]/sites/[siteId]/dashboard/services/page.tsx           → Services list + CRUD
/[locale]/sites/[siteId]/dashboard/services/[id]/page.tsx      → Service edit (or unified page)
/[locale]/sites/[siteId]/dashboard/customers/page.tsx          → Customers list
/[locale]/sites/[siteId]/dashboard/customers/[id]/page.tsx     → Customer details
/[locale]/sites/[siteId]/dashboard/requests/page.tsx           → Requests list
/[locale]/sites/[siteId]/dashboard/requests/[id]/page.tsx      → Request details
```

## Public Website Integration
- Add a service request form to the live site's contact page or as a contact form section
- The form fetches active services from `/api/live/[slug]/services`
- Submits to `/api/live/[slug]/requests`
- Uses existing `ContactSection` component area or adds a new form section

## Authorization Strategy
1. All dashboard APIs: `getSession()` → 401 if no session
2. All dashboard APIs: `getSiteForOwner(siteId, session.user.id)` → 404 if not owner
3. All dashboard mutations: Verify resource belongs to site (query with `{ _id, siteId }`)
4. Public API: Resolve site by slug (no auth). Validate service belongs to site.
5. No client-provided `siteId` or `ownerId` in mutation payloads — always derived from session + URL params.

## Feature Availability
- Services module available for `services`, `professional`, `portfolio`, `retail` categories
- Not available for `restaurant` (future: menu ordering)
- MVP only implements generic service-business model

## i18n
Add translation keys to both `en.json` and `ar.json` under new namespaces:
- `dashboard.overview`
- `dashboard.services`
- `dashboard.customers`
- `dashboard.requests`
- `dashboard.nav`
- `form.*` (input labels, validation messages)
- `status.*` (request statuses)
- `notes.*` (internal notes section)

## Implementation Phases (delegation order)
1. **Database Layer** — schemas, types, repositories for all 3 entities
2. **Backend API** — all route handlers + feature API functions (auth + validation + ownership)
3. **Dashboard UI** — pages, navigation, components, overview stats
4. **Public Integration** — public API endpoints + live site form
5. **i18n** — translation keys

## Verification
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Manual: auth tests, ownership tests, public submission flow, empty states
