# Site Settings / Integration Architecture — Assessment

**Date:** 2026-09-26
**Status:** Evaluation only — no implementation

---

## Current Architecture

### Site Model (`src/features/sites/site.schema.ts`)
The `Site` document holds everything under one roof:
- `businessInfo`: name, category, description, targetCustomers, services, location, contactPhone, contactEmail, usps, notes
- `templateId`, `languagesRequested`, `activeLanguages`
- `content`: per-page, per-locale content
- `images`, `brandColor`, `slug`
- `publishedSnapshot`, `hasUnpublishedChanges`
- `generation`: status tracking

### Existing Settings Surface
| Route | What it does |
|---|---|
| `PATCH /api/sites/[siteId]/settings` | Name + category only (via `businessInfoPatchSchema`) |
| `PATCH /api/sites/[siteId]/brand-color` | Brand color |
| `PATCH /api/sites/[siteId]/languages` | Language selection (en/ar/both) |
| `PATCH /api/sites/[siteId]/business-info` | Full businessInfo merge (all fields) |
| `PATCH /api/sites/[siteId]/content` | Page content updates |

### Settings UI (`SettingsPageContent.tsx`)
Renders only: business name, category, language display, site status, slug. No integrations, no analytics config, no contact/conversion settings.

### What Already Exists
- **Analytics:** Pageview tracking (en/ar) with daily aggregation, per-page, 7/30-day trends
- **Payments:** Paymob pixel + Polar hosted checkout for subscription only
- **Customers:** CRUD, search by name/email/phone, request count
- **Requests:** Full service request lifecycle with status, notes, dashboard overview
- **Monetization:** Free/Pro plans, subscriptions, billing records

---

## MVP Assessment

**What the MVP genuinely needs:**

1. **Basic site settings** — Partially done. Name + category exist. Missing: contact info exposure, slug management, site status toggle.
2. **Contact/conversion configuration** — `contactPhone` and `contactEmail` are already in `businessInfo` but not surfaced in the settings UI. These should be exposed.
3. **Supported integrations** — Not started. Needs a configuration surface.
4. **Analytics/pixel configuration** — Pageview tracking exists server-side. Needs: pixel ID storage (Facebook, Google, etc.) and a UI to configure them.

**MVP recommendation:** Keep settings minimal. Expose `contactPhone` + `contactEmail` from `businessInfo`, add pixel/analytics ID fields to the Site model, and wire them into the rendered site output. No new feature modules needed — extend existing ones.

---

## Post-MVP Items

### Orders
- **Status:** Does not exist
- **Needs:** Order model (siteId, customerId, items[], total, status, createdAt), order lifecycle API, order management UI
- **Depends on:** Customers, Products/Catalog

### Customers (CRM)
- **Status:** Basic CRUD exists (`src/features/customers/`)
- **Gap:** No segmentation, no notes pipeline, no lead scoring, no communication history
- **MVP suffices for now;** CRM features (tags, pipelines, email history) come later

### Inventory / Product Catalog
- **Status:** Does not exist
- **Needs:** Product model, SKU/stock tracking, category management
- **Not needed until orders are implemented**

### Payments (beyond subscriptions)
- **Status:** Subscription payments via Paymob/Polar exist
- **Gap:** No order-level payment capture, no refund handling, no payout flow
- **Depends on:** Orders

### Business Management
- **Status:** Dashboard overview exists (customer/request counts)
- **Gap:** Revenue reporting, staff roles, multi-user ownership
- **Can be layered on after core flow is stable**

---

## Architectural Decision Points

1. **Where do integration configs live?** Options: (a) add fields to Site model, (b) separate `SiteIntegration` collection, (c) JSONB column. For MVP, (a) is simplest — `site.integrations = { facebookPixel?: string, googleAnalytics?: string }`.
2. **Analytics:** The current `Pageview` model is write-heavy. If pixel/events are added, consider a separate `Event` collection to avoid schema conflicts.
3. **RTL support:** All new settings UI must respect the existing `next-intl` + RTL layout (ar locale).

---

## File Map (relevant only)

```
src/features/sites/
  types.ts                  # Site, SiteBusinessInfo, SiteDTO
  site.schema.ts            # Mongoose schema
  schemas.ts                # Zod validation (businessInfoPatchSchema)
  repository.ts             # CRUD
  components/SettingsPageContent.tsx  # Settings UI
  api/                      # Individual update handlers
src/features/analytics/
  pageview.schema.ts        # Pageview tracking
  repository.ts             # recordPageview, listSitePageviewDays
src/features/payments/
  components/paymob-pixel.tsx  # Paymob checkout pixel
src/features/customers/     # Customer CRUD
src/features/requests/      # Service request lifecycle
src/features/monetization/  # Plans, subscriptions, billing
```

---

## Verdict

The product has a partial settings foundation (name, category, brand color, languages) but lacks integrations, analytics config, and contact/conversion settings. The data model (businessInfo) already has contact fields — they just aren't exposed. MVP should extend what exists; orders, inventory, full CRM, and business management are Post-MVP.
