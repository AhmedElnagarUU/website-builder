# Product Expansion — Architecture Decisions (binding)

Date: 2026-09-29
Status: OPEN — provisional until human approval of DEC-1…DEC-6 (DEC-7 is self-imposed and stands).

Each decision records the problem, the recommendation, why, and what it rules out.

---

## DEC-1 — Country identity: stored on the user, captured server-side at signup

**Problem.** No country/location signal exists anywhere (auth audit: exhaustive grep — zero). The
checkout and pricing surfaces need one, must not trust a client body, and the mandate bans new
dependencies (no geo-IP lib).

**Decision.** Add `country` (ISO-3166-1 alpha-2, nullable, **non-unique, unindexed** `string`) via
better-auth's sanctioned `options.user.additionalFields` in `src/shared/auth/server.ts`. Capture it
server-side at signup through `databaseHooks.user.create.before`, reading proxy headers in this
trust order: `cf-ipcountry` → `x-vercel-ip-country` → `accept-language` (last resort) →
`undefined`. Widen the single projection at `src/features/auth/lib/session.ts:10` so every API
handler / RSC sees `session.user.country`. The decision layer (`features/payments/lib/payment-methods.ts`)
defaults to Polar-only for non-EG, `undefined`, and anonymous users.

**Why.** The write goes through better-auth (never the raw `user` collection — preserves
`02-ARCHITECTURE.md:39-43,182-183`); MongoDB is schemaless so there is **zero migration**
(adapter creates indexes only, and we add none); freezing at signup makes the value stable against
travel/VPN/header changes; `undefined` fails safely.

**Rules out.** Per-request header derivation (spoofable, flaky, not persistent); phone-prefix
derivation as the *primary* source (silent hole for users without a `phoneidentities` row — and
`store-phone` failure is swallowed client-side); the raw `session.otherFields` (better-auth writes
add-on session fields on every request — server load, risk of mismatch).

**Remaining note.** A signup behind VPN/CDN-edge gets a possibly-wrong frozen value → requires a
future admin override (EPIC 12). Not blocking.

---

## DEC-2 — Payment methods: one server-side source of truth

**Problem.** Payment availability must vary by country but never be decided in scattered UI branches.

**Decision.** `PaymentMethod = "polar" | "vodafone_cash" | "instapay"`. Single function
`getAvailablePaymentMethods(country: string | undefined): PaymentMethod[]` in
`features/payments/lib/payment-methods.ts`: `"EG"` → `["polar","vodafone_cash","instapay"]`,
anything else / undefined / anonymous → `["polar"]`. `/api/checkout` accepts an explicit `method`
validator; the server (re)resolves the list for the session user and refuses methods outside it
(422). Polar path is byte-for-byte today (hosted checkout, webhook = only pay signal).

**Why.** One place the rule lives; the checkout button reads it; the server enforces it; Polar trust
surface is unchanged.

**Rules out.** Client-side `if (country === "EG")` branches; deriving methods from availability of
the header at request time.

---

## DEC-3 — Manual methods (Vodafone Cash / InstaPay): PaymentRecord + admin verify, no auto-verification

**Problem.** Vodafone Cash and InstaPay have no approved/integrated automated API; the product needs
a verified-paid path that activates the subscription without inventing providers.

**Decision.** New `paymentrecords` collection in `features/payments/`:
- Fields: `siteId?` none — `userId`, `planId`, `method: "vodafone_cash"|"instapay"`, `amount` (minor
  units, server-resolved from `plans.ts` — never client), `currency`, `status: "initiated" |
  "awaiting_verification" | "paid" | "cancelled"`, `proof?: { reference, paidAt, screenshotKey? }`,
  `contactPhone` (for the transfer), `timestamps`.
- Flow: user selects manual method → instructions + payment details rendered → user submits proof →
  `awaiting_verification` → admin verifies via a guarded endpoint → `paid` → subscription activated
  through the **same activation function Polar's webhook uses** (`order.paid` → entitlements).
- Verification endpoint is a thin route calling `features/payments/api/verify-manual-payment.ts`,
  authorization = server-side check that `session.user.email ∈ ADMIN_EMAILS` env (documented in
  `.env.example`). No admin UI here — EPIC 12 owns the surface; the function + route are the
  mechanism.
- Abandon/expiry: any manual record that is neither `paid` nor `cancelled` after `EXPIRE_HOURS`
  (env-default 24h) is treated as `cancelled` at read time (no background job in this epic).

**Why.** Manual verification is the honest, dependency-free design; reuse of the existing
entitlement activation keeps one paid-path; KISS.

**Rules out.** Payment-provider SDKs or money APIs (new deps — needs approval); pretending the
manual methods are automated; letting the *client* decide the amount.

---

## DEC-4 — Business content model: one `businessitems` collection, discriminated, locale-aware, provenance-carrying

**Problem.** Everything customers would manage (menu, gallery, hours, contact, plus services for
rendering) is frozen into `SiteContent` as positional, template-derived, string-only `ContentField`s
(no prices, no images, no ordering, no locale for menu). The CRM `services` collection lacks locale,
lacks `origin`/`edited`, is not in `PublishedSnapshot`, and is not read by the renderer. The AI
output parser (`isStringMap`) is a type-level wall against structured output.

**Decision.** New feature `src/features/business-content/` with **one** explicit collection
`businessitems`:
```ts
type BusinessItemKind = "service" | "menu_item" | "gallery_item" | "hours" | "contact";
interface BusinessItem {
  _id; siteId; ownerId;
  kind: BusinessItemKind;
  locale: "en" | "ar";        // content is per-locale, like SiteContent
  baseKey: string;            // links the en/ar rows of one logical item ("service-1", "gallery-3")
  data:                       // zod-per-kind:
    | { name; description?; price?; imageS3Key? }                       // service | menu_item
    | { title?; imageS3Key }                                            // gallery_item
    | { dayIndex: 0-6; open?; close?; closed: boolean }                 // hours
    | { type: "phone"|"whatsapp"|"email"|"address"|"instagram"|"facebook"|"maps"; value; label? } // contact
  sortOrder; active;
  origin: "ai" | "user" | "placeholder";   // same vocabulary as ContentField
  edited: boolean;
  createdAt; updatedAt;
}
```
- Repository mirrors the `services` pattern but **filters every mutation on `ownerId`** (fixing the
  audit's Layer-2 gap). Indexes inline in `<thing>.schema.ts` (`{siteId, active}`, `{siteId, kind}`,
  `{siteId, baseKey}`), explicit `collection: "businessitems"`.
- Images reuse `images/lib/s3.ts` + `signed-image-urls.ts` (`s3Key`), never a bare string.
- Merge protection inherits the content vocabulary (`origin`/`edited`) — EPIC 5 makes the regen
  confirm-gate consume item edits; EPIC 7 generates items through the same protection.

**Why.** One CRUD seam, one auth shape, one cascade; locale-first (Arabic first-class); separate from
both `SiteContent` (which stays the AI-written free text) and CRM `services` (which stays the
request/lead source). Backward compatible by definition — new collection, new endpoints.

**Rules out.** Extending `SiteContent` with nested item shapes (breaks `isStringMap`, `F()`,
snapshot, and every section contract); reusing CRM `services` for rendering (no locale/provenance,
would leak draft→live via the public route and break the publish invariant); per-kind collections
(five× boilerplate; contradict KISS).

---

## DEC-5 — Publish invariant extended to the catalog

**Problem.** `publish-site.ts:66-73` snapshots only `{templateId, activeLanguages, content, images,
brandColor, publishedAt}`. Any catalog rendered live without being snapshotted drifts silently
exactly like the CRM `services` public route does today (draft→live with no publish), violating
"publishing and editing are separate actions."

**Decision.** EPIC 5 adds the active business catalog to `PublishedSnapshot`; `LiveSitePage` renders
from the snapshot; a `businessitems` edit sets `hasUnpublishedChanges` exactly like content edits;
public site is untouched until publish.

**Why.** Preserves the product invariant; gives the "live" contract a single source.

**Rules out.** Rendering the catalog from the working collection on live (the CRM-services trap).

---

## DEC-6 — Template rebuild respects the immutable contract; shared visuals are the vehicle

**Problem.** Strategy doc `05-TEMPLATE/02-template-strategy.md` is **stale** (says 10 templates /
5 categories; code has 22 templates / 17 categories — the expansion already partly happened). The
rebuild must improve visuals + consistency without breaking any stored site or snapshot.

**Decision.** Only what `01-template-structure.md` §20/§21 marks as redesignable may change:
`colors.defaultAccent`, `style.*`, `theme.*`, section ordering/composition, extra pages, `name`/
`description`/`screenshot`/demo copy/assets, and **shared** visual output
(`src/shared/site-render/` + `globals.css`). Never: template `id`, page `id`/`slug`, `SectionType`,
required field keys, home `header→…→footer` invariant, `SiteContent`/`SiteImage`/`PublishedSnapshot`.
Consistent footers come from the shared `FooterSection` (per-template data only). `buildPages`
gains the flexibility to drop the duplicated CTA and compose per-template pages — still emitting
only existing section types (14). Fix the two real defects (event-planner CSS vars; hardcoded
English wordmarks). Re-derive `switch-template` billing per actual page count (billing is not to be
silently changed for existing users — document the delta).

**Why.** Backward compatibility is the first invariant; the renderer is the single lever for a
professional look (per `01-template-structure.md` §24 — shared components are the only way to get a
truly different layout).

**Rules out.** New section types without separate human approval; touching template ids/keys; new
npm deps (fonts/images are file assets, already local).

---

## DEC-7 — Verification gate (self-imposed, binding)

Every epic/task closes only when:
1. `npm run lint` — 0 warnings; `npx tsc --noEmit` — exit 0.
2. `npm run build` — green, run with the dev server **stopped** (shared `.next`).
3. Acceptance criteria from this plan pass, checked in **both** `en` and `ar`.
4. Changed files byte-scanned: zero `U+FFFD` (OneDrive write-corruption guard); use
   `[regex]::Matches($text,[char]0xFFFD).Count`.
5. `.env.example` documents every new env var (`ADMIN_EMAILS`, `MANUAL_PAYMENT_EXPIRE_HOURS`); secrets
   never committed.
6. This plan + `90-ACTIVE-TASKS.md` + affected `02-ARCHITECTURE.md`/`03-DATA-MODELS.md` are updated.

---

## Open items needing human input (not blocking EPIC 0)

1. `ADMIN_EMAILS`: who verifies Vodafone/InstaPay proofs? Provide at least one email (else the
   verification endpoint is inert until EPIC 12 ships a UI).
2. Manual-method transfer accounts: display "transfer to this phone/wallet" numbers — where do these
   live? (env or code constant; server-rendered; per method.)
3. `zod`/`mongoose`/`langchain` not declared in `package.json` — approve adding them to the declared
   baseline (used already; the packages are installed as transitive deps today).
4. `buildPages` page-count billing delta: confirm we keep the current total (10 pages for max-extras
   templates) and adjust only the entitlement cost formula to match the *actual* template page set,
   without changing what existing users are charged.