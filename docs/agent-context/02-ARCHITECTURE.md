# 02 — ARCHITECTURE MAP

Grounded in the real tree (verified 2026-09-27). Supersedes the archived
`91-ARCHIVE/planning/codebaseStrucher-2026-09.md`, which predates the
`customers`/`requests`/`services` work and still described the raw MongoDB driver and
Google-hosted fonts.

---

## 1. What this is

**Monomastic** — a Next.js 15 (App Router) AI website builder. A non-technical business owner
answers questions, picks a template + language(s), AI writes the whole site, they lightly edit
it, and publish it at a system URL. **English + Arabic (RTL) are first-class from day one.**

Routing map:

```
Browser ─▶ /[locale]/…   app pages (landing, auth, create wizard, dashboard, editor)
        ─▶ /live/…       public published sites (no locale, no auth)
        ─▶ /preview/…    template previews (noindex)
        ─▶ /api/…        thin route handlers → delegate to features/
```

---

## 2. The one boundary that matters

```
app/        ROUTES + thin glue only.   "What URL? What page? What endpoint?"
features/   THE LOGIC + UI.           "How does a site get created / edited / published?"
shared/     Reusable low-level infra.  "DB, auth, renderer, primitives."
```

A route handler in `src/app/api/**` does exactly three things: parse/validate (zod) → authenticate
and authorize (`getSession()`, check `ownerId === session.user.id`) → call **one** function from a
feature's `api/` module. **No business logic in `app/api`.**

```
features/  ──▶ shared/       ✅ allowed
features/  ──▶ features/     ⚠️ only via that feature's api/ module, never internals
shared/    ──▶ features/     ❌ forbidden
```

Standard feature layout: `types.ts` (contract) · `schemas.ts` (zod) · `repository.ts` (DB) ·
`lib/` (pure logic) · `api/` (the only callable surface) · `components/` (React).

---

## 3. The 21 features

| Feature | Responsibility | Files |
|---|---|---|
| `sites` | **Core data model** — businessInfo, languages, template, per-locale content, images | 15 |
| `templates` | Catalog + demo content + semantic field registry (`catalog.ts` is the source of truth) | 9 |
| `generation` | Async AI writing, polling, error classification, prompt building, content merge | 12 |
| `regeneration` | Site/section regeneration + impact preview | 6 |
| `editor` | Inline editing surface, autosave, device toggle, brand color | 12 |
| `create-wizard` | 4-step onboarding: business-info → templates → language → generating | 7 |
| `publishing` | Publish/unpublish → slug + snapshot + public live site | 8 |
| `monetization` | Plans, entitlements, paywalls (402/403), trials | 17 |
| `payments` | Polar provider + Egypt manual methods (Vodafone Cash / InstaPay), hosted checkout, Standard-Webhooks verification, admin-verified manual proof | 19 |
| `images` | S3 presigned uploads + signed read URLs | 4 |
| `analytics` | Pageview recording + aggregation | 4 |
| `auth` | Session helpers (`getSession`, `requireSession`) | 4 |
| `dashboard` | Site list + business dashboard | 5 |
| `customers` | Business-side customer records per site | 9 |
| `requests` | Customer service-requests (leads) + notes, incl. public submission on live sites | 13 |
| `services` | Services catalog per site + ordering | 13 |
| `landing` | Marketing page sections | 7 |
| `tutorial` | Onboarding/tutorial UI | 7 |
| `shell` | App chrome: navbar, plan badge, language switcher | 3 |
| `i18n` | Locale helpers (feature-level) | 1 |
| `template-preview` | Template browsing shell | 1 |

> `customers` / `requests` / `services` / `tutorial` extend the product beyond site building into
> running a service business. Their route surface:
> `/api/sites/[siteId]/{customers,requests,services,dashboard/overview,settings,images/sign-url}`
> plus public `POST /api/live/[slug]/{requests,services}`. Read their `types.ts` before changing them.

---

## 4. API routes (45)

Owner-scoped, all under `/api/sites/[siteId]/`:

```
content · business-info · languages · brand-color · template · switch-template
generate · generation-status · regenerate · regenerate-section · regenerate-impact
image-upload · images · images/sign-url · publish · unpublish · analytics · settings
customers · customers/[customerId] · requests · requests/[requestId] · requests/[requestId]/notes
services · services/[serviceId] · services/reorder · dashboard/overview
```

Others: `auth/[...all]` + `auth/{check-phone,store-phone}` · `health` · `templates` +
`templates/[templateId]` · `checkout` + `checkout/[paymentId]` · `trial/status` ·
`live/[slug]/{requests,services}` · **`webhooks/polar`**

**Security invariant:** every owner-scoped route verifies the session and `ownerId`, else `401`
(no session) or `404` (not owner). Webhooks are the only unauthenticated routes and authenticate
via **HMAC signature**, not session.

---

## 5. Payments: Polar + Egyptian manual methods

`features/payments/` implements a `PaymentProvider` interface. Polar is the sole **provider**; Egypt
additionally gets two **manual** methods (Vodafone Cash, InstaPay) that are verified by a human, not a
provider. No Paymob code remains:

```
features/payments/
├── provider.ts        the PaymentProvider contract (createPayment, handleWebhook)
├── types.ts           PaymentRecord, PaymentSession, PaymentProviderId = "polar",
│                      PaymentMethod, ManualPaymentMethod, ManualProof
├── api/checkout.ts    the SEAM — getDefaultProvider() always returns PolarProvider;
│                      createCheckoutSession() branches manual → api/manual-payment.ts
├── api/manual-payment.ts  create/submit-proof/verify for the manual methods
├── api/webhook.ts     processWebhook() — idempotent paid/failed transitions (Polar)
├── lib/payment-methods.ts  getAvailablePaymentMethods(country) — ONE rule, client + server
└── polar/             hosted-checkout redirect integration
```

- `POST /api/checkout` (auth required) accepts `method` and **enforces availability server-side**
  from `session.user.country` (`422 method_unavailable` when the method is not on offer).
- **Polar** (`method: "polar"`) creates a **hosted checkout session** and returns `session.url`; the
  browser navigates to it with `window.location.href`. The server resolves the product from
  `POLAR_PRODUCT_ID_PRO` — nothing product-specific is trusted from the client.
- **Payment success is authoritative only from a signed webhook** (`order.paid`), never from the
  browser redirect. Webhook handling is idempotent so retries cannot double-grant Pro.
- Polar webhooks use the **Standard Webhooks** signature scheme: message =
  `webhook-id.webhook-timestamp.<raw-body>`, key = the `whsec_…` secret used directly, header
  `webhook-signature: v1,<base64>`.
- Polar hosted checkout needs only the **Product ID** (`products: [POLAR_PRODUCT_ID_PRO]`) — Polar
  resolves catalog pricing server-side. Do **not** reintroduce a Price-ID requirement.
- **Manual methods** (`vodafone_cash`, `instapay`) have no provider call. The flow is:
  `POST /api/checkout` → record `initiated` + transfer instructions → user transfers and submits a
  proof (`POST /api/checkout/[paymentId]/proof`) → record `awaiting_verification` → an admin whose
  email is in `ADMIN_EMAILS` calls `POST /api/checkout/[paymentId]/verify`, which flips the record to
  `paid` and grants Pro. **Never mark a manual payment paid from a client request.**
- `features/payments/lib/payment-methods.ts` is the single source of truth for the country → methods
  rule and is a pure module safe to import from client and server code. The browser may only *ask*;
  the server decides.
- Manual payment env: `ADMIN_EMAILS`, `MANUAL_PAYMENT_VODAFONE_NUMBER`,
  `MANUAL_PAYMENT_INSTAPAY_NUMBER`, `MANUAL_PAYMENT_EXPIRE_HOURS` (default 24). Unset wallets still
  render (number line is simply empty); unset `ADMIN_EMAILS` means nobody can verify.
- User country is captured **server-side at signup** only (`user.additionalFields.country`,
  `input: false`, written by a `databaseHooks.user.create.before` hook reading proxy headers /
  `accept-language`). It is never read from a request body.

---

## 6. The site engine (`shared/site-render/`)

A pure **content → HTML** renderer used in **two** places — which is exactly why it is `shared/`
and not a feature:

```
editor EditorShell (edit mode)  ┐
                                ├─▶ shared/site-render/SiteRenderer.tsx
publishing LiveSitePage (read)  ┘      ├── context.ts   edit-mode / brand / nav / style
                                            ├── tokens.ts    FONT_FAMILIES, radii, textOnBrand
                                            ├── atoms.tsx + internals.tsx
                                            └── sections/  Header Hero Services About
                                                          Testimonials Cta Contact Footer Menu
                                                          Gallery Faq Hours Pricing Team
```

To render a site, data must match `SiteContent` from `features/sites/types.ts` (pages → sections →
`ContentField`s). The template definition (`features/templates/catalog.ts` + `pages.ts`) declares
which sections exist and which semantic field keys each needs.

---

## 7. Key flows

**A — create** `/[locale]/create/business-info` → `create-wizard/BusinessInfoForm` →
`POST /api/sites` → `sites/api/create-site` → `sites/repository` → Mongo.

**B — generate** `POST /api/sites/[siteId]/generate` → `generation/api/start-generation` →
`generation/run-generation` → `lib/ai-client` (LLM, long timeout) → `lib/prompt-builder` (template
definition → prompt) → writes `ContentField`s → client polls `generation-status` →
`generation/api/get-status` → `GenerationProgress` UI.

**C — edit** `/sites/[siteId]/editor` → `editor/EditorShell` → inline field editors → autosave
(debounced) → `PATCH /api/sites/[siteId]/content` → `sites/api/update-content`.
**Invariant:** regeneration merges only into non-`user`-origin fields and never silently overwrites
manually edited content (`generation/lib/merge-content` + `regenerate-impact`).

**D — publish** editor → `POST …/publish` → `publishing/publish-site` (slug + short suffix) →
writes `publishedSnapshot` + `liveUrl` → visitors hit `/live/{slug}/{lang}/{pageSlug}` →
`publishing/get-published-site` → `LiveSitePage` → `SiteRenderer` → `analytics/recordPageview`.

**E — monetize** UI → feature api → `monetization/lib/entitlement` → `withEntitlement` (402/403
`{error, plan, limitKey}`) → `PaywallPrompt`; limits in `monetization/plans.ts`.

---

## 8. Data & persistence

- **MongoDB via mongoose** (migrated from the raw driver — epic 17). Connection singleton in
  `shared/db/`; **data access lives in each feature's `repository.ts`**; collection shapes are
  TypeScript interfaces; validate input with zod at API boundaries. `better-auth` owns
  `user`/`session`/`account` — do not touch those collections.
- Key collections: `sites` (content + images + `publishedSnapshot` + `generation`), `pageviews`,
  `subscriptions`/`memberships`/`billing`, payments records, plus the customers/requests/services
  collections.
- **Ownership invariant:** every site has `ownerId`; every read/write goes through an owner check.
- S3: presigned PUT from the browser; read URLs are **short-lived signed URLs resolved on demand,
  never persisted** (`images/lib/s3.ts`, `signed-image-urls.ts`). Key pattern:
  `sites/{siteId}/{slotId}/{uuid}.{ext}`.

---

## 9. Where to go to fix X

| Symptom | Go to |
|---|---|
| Page/redirect/URL wrong | `src/app/[locale]/…` |
| API returns wrong 401/403/404 | the route in `src/app/api/…` + `auth/lib/session.ts` |
| Site data shape/storage | `sites/types.ts`, `sites/repository.ts` |
| AI output wrong / prompt issues | `generation/lib/prompt-builder.ts` |
| Generation fails or times out | `generation/run-generation.ts`, `generation/lib/ai-client.ts` |
| Editor save behavior | `editor/lib/SaveProvider` |
| Section looks wrong on the site | `shared/site-render/sections/<Section>.tsx` |
| Add/remove a section or template field | `templates/catalog.ts` (registry) + `templates/pages.ts` |
| Checkout / payment 502 or wrong provider | `payments/api/checkout.ts` seam + `payments/polar/config.ts` |
| Webhook not granting Pro | `app/api/webhooks/polar` + `payments/polar/hmac.ts` (signature scheme) |
| Which payment methods an account sees | `payments/lib/payment-methods.ts` (`getAvailablePaymentMethods`) + `user.country` |
| Manual payment stuck / not granted | `payments/api/manual-payment.ts` state machine + `ADMIN_EMAILS` |
| Translations | `src/messages/en.json` **and** `ar.json` |
| RTL / direction bugs | `shared/i18n/config.ts`; logical properties only |
| Images failing | `images/lib/s3.ts` + S3 vars in `.env` |
| Plan limits / paywall | `monetization/plans.ts`, `monetization/lib/entitlement.ts` |
| Fonts / design tokens | `src/shared/ui/fonts.ts` (self-hosted) + `src/app/globals.css` |

---

## 10. Gotchas (learned the hard way)

- **Fonts are self-hosted.** `src/shared/ui/fonts.ts` uses `next/font/local` with 109 bundled
  `.woff2` files in `src/shared/ui/fonts/`. `next/font/google` is banned: it fetches from Google on
  every fresh build and dies with `ETIMEDOUT` on this network.
- **The project lives in a OneDrive-synced folder.** Exclude `.next` from sync; never run
  `next build` while `next dev` is running (shared `.next` → `ENOENT pages-manifest.json`).
- **mongoose, not the raw driver** — types use `Types.ObjectId`.
- `signin.txt` at the root holds a real session token — treat as sensitive, never commit.
- `@/*` maps to `./src/*`.
- `lrt` (1.4 MB) at the root is a stray binary artifact, not source.
