# Product Expansion & Template Rebuild — EPIC Implementation Plan

Date: 2026-09-29
Status: **EPIC 0 done, EPIC 1 in progress**
Companion doc: `02-expansion-decisions.md` (binding architecture decisions).

This plan turns the Monomastic expansion mandate into executable units. Each row below is the
atomic unit one sub-agent executes. Dependencies are binding; **out of scope** is binding. Every
epic ends with the verification gate (lint + `tsc --noEmit` + build + FFFD scan + en/ar acceptance).

---

## Grounding (reference table)

Audit facts the plan relies on (all verified against `src/`, 2026-09-29):

| Fact | Evidence |
|---|---|
| Template registry has **22** templates | `src/features/templates/catalog.ts:381` |
| Category system already expanded to **17** values | `src/features/sites/types.ts:3-20`, `CATEGORIES :22-40` |
| **14** builder fns, **14** section components, 14 `SectionType` values | `catalog.ts:87-259`; `src/shared/site-render/sections/`; `src/features/templates/types.ts:3-17` |
| `buildPages` rigid: home always `[header, hero, services, about, testimonials?, cta, footer]`, CTA duplicated on home/about/services | `catalog.ts:291-356` |
| Merge invariant: per-key `if (prev.edited && !force) continue`; **force only via full-site regen confirm** | `generation/lib/merge-content.ts:84-99`; `regeneration/run-site-regeneration.ts:49`; `regeneration/api/regenerate-site.ts:31-41` |
| `SYSTEM_PROMPT` rule 2 bans invented prices/facts | `generation/lib/prompt-builder.ts:10-12` |
| `isStringMap` rejects structured AI output (arrays/objects) | `generation/lib/ai-client.ts:14-21, 23-42` |
| Per-site business dashboard exists but is **orphaned** (no link target), with i18n + broken-endpoint defects | `app/[locale]/sites/[siteId]/dashboard/*`; see decisions doc §6 |
| CRM `services` collection is request/lead routing — **not** the rendered services section, no locale, not in `PublishedSnapshot` | `features/services/types.ts:3-14`; `publishing/publish-site.ts:66-73` |
| No country/location signal on user/session/site; `features/auth/lib/session.ts:10` projects to id/email/name | see auth audit |
| better-auth MongoDB adapter: no migrations, index-only; `user.additionalFields` is the sanctioned extension | `src/shared/auth/server.ts:22-29` |
| Template defects: `event-planner` palette references missing `--navy/--cream/--gold` CSS vars; hardcoded English wordmarks + taglines in `HeaderSection.tsx` | `features/templates/catalog.ts:991-1001`; `shared/site-render/sections/HeaderSection.tsx` |
| `switch-template` entitlement charges against the **new** template's page count (10 pages for 6-extras templates) | `app/api/sites/[siteId]/switch-template/route.ts:11, 21-24` |
| Template backfill is **additive-only** (stale keys orphan; no pruning) | `regeneration/run-template-backfill.ts:108-121` |
| Publish invariant: live site renders only from `publishedSnapshot` | `publishing/publish-site.ts:66-73`; `publishing/components/LiveSitePage.tsx:82-84` |

---

## EPIC 0 — Foundation: Audit & Architecture ✅

Goal: define the plan and the decisions. **Done** (this document + decisions doc).

Artifacts:
- This plan (`01-product-expansion-plan.md`).
- `02-expansion-decisions.md` — DEC-1…DEC-7 (binding).
- Audit evidence embedded in the decisions doc.

Validation: plan reviewed + approved by human (approval of DEC-1…DEC-6 requested; DEC-7 self-imposed).

---

## EPIC 1 — Country-Based Payment Methods (Egypt: Polar + Vodafone Cash + InstaPay) ✅ DONE (code) — needs human env values

Goal: Egypt users see Polar + Vodafone Cash + InstaPay; everyone else sees Polar only. Methods are
server-resolved; the value is stored server-side; Polar stays the authoritative paid-path.

**Outcome (implemented).** `user.country` captured server-side at signup and never from a body
(`shared/auth/server.ts`); `getAvailablePaymentMethods(country)` in `lib/payment-methods.ts` is the
single rule read by both the checkout UI and `POST /api/checkout`, which rejects an unavailable method
with 422. Manual methods run the record state machine `initiated → awaiting_verification → paid`
(`api/manual-payment.ts` + `repository.ts`), with proof submitted at
`POST /api/checkout/[paymentId]/proof` and granted only at `POST /api/checkout/[paymentId]/verify`
behind `ADMIN_EMAILS`. `checkout-section.tsx` renders method tabs for EG accounts and the existing
Polar flow untouched. Expired manual records are cancelled at read time
(`MANUAL_PAYMENT_EXPIRE_HOURS`, default 24) — no background job.

**Deviations from the task list (smallest-change rule).**
- 1.4: no separate `lib/verify-payment-method.ts` — the server check lives in the route and the shared
  rule in `lib/payment-methods.ts`; the button reads that same module.
- 1.5: reused the **existing** `payments` collection (`PaymentRecord` model) rather than adding a new
  `paymentrecords` collection — the manual states are new enum members on the same model. A new
  collection would have duplicated the record shape and every query.
- Manual verification is exposed as an authenticated **API route**, not an admin page (admin UI is
  EPIC 12 scope, as originally stated).

**Open for the human before this works in production:** set `ADMIN_EMAILS` (without it nobody can
verify), `MANUAL_PAYMENT_VODAFONE_NUMBER`, `MANUAL_PAYMENT_INSTAPAY_NUMBER`. Existing users created
before this change have no `country` → they see Polar only until re-registered.

### Tasks

| Task | Scope | Logs to |
|---|---|---|
| 1.1 | Declare `user.additionalFields.country` (nullable, non-unique, unindexed ISO alpha-2 string) in `src/shared/auth/server.ts`; capture server-side at signup via `databaseHooks.user.create.before` from proxy headers (`cf-ipcountry` → `x-vercel-ip-country` → `accept-language`), `undefined` if absent. **Never trust a client body for this.** | `docs/agent-context/02-ARCHITECTURE.md` |
| 1.2 | Widen `src/features/auth/lib/session.ts:10` to include `country`; add a small local SessionUser type. Keep `requireSession` unchanged. | same |
| 1.3 | Add `PaymentMethod` union (`"polar" \| "vodafone_cash" \| "instapay"`) and `getAvailablePaymentMethods(country)` in a new `features/payments/lib/payment-methods.ts` (single source of truth; EG → all three, else Gregorian→Polar-only, unknown/anonymous → Polar-only). | `docs/agent-context/03-DATA-MODELS.md` |
| 1.4 | Extend `PaymentSession` and `/api/checkout` to accept a `method`; Polar path unchanged (hosted checkout, webhook authoritative). Add `features/payments/lib/verify-payment-method.ts` that the buy button uses (server resolves, never trusts client). | same |
| 1.5 | Manual methods (vodafone_cash, instapay): new `PaymentRecord` collection (`paymentrecords`) + `features/payments/api/*` for: create (instructions + proof submission: transaction ref, date, amount), status machine, and a verification endpoint guarded by `ADMIN_EMAILS` env (server-side; no admin UI in this epic — EPIC 12 owns it). Purchase reservation must not over-approve; expiry/`cancelled` on abandon. | `docs/agent-context/03-DATA-MODELS.md` |
| 1.6 | Rework `src/features/payments/components/checkout-section.tsx` to render method tabs for Egypt (Polar keeps the existing poll/return flow; manual methods show instructions + proof form + paid-claim states). All labels via `src/messages/en.json` + `ar.json` (reuse `business.*` / pricing keys; add new ones to **both**). | both message files |

### Acceptance
- [x] `POST /api/checkout`: country `EG` on session → all three methods render; non-EG/anon → Polar only.
- [x] Selecting Polar behaves exactly as today (Polar-only, webhook-pays).
- [x] Manual method: user submits proof → record `awaiting_verification` → admin verify → `paid` → subscription activates via the same entitlement activation the Polar webhook uses.
- [x] Webhook remains the only authoritative pay signal for Polar. Publish/editing invariants untouched.
- [x] Verification gate green (`tsc --noEmit`, `next lint`, `next build`); FFFD scan clean.
- [ ] Live verification with real wallet numbers + `ADMIN_EMAILS` (needs human; no automated path).

### Out of scope
- Admin UI/dashboard for verification (future EPIC 12). No new npm deps. No changes to existing Polar webhook behavior. No auto-verification from Vodafone/InstaPay APIs (none exist; manual flow by design).

---

## EPIC 2 — Business Content Model

Goal: a normalized, locale-aware, provenance-carrying catalog for services / menu / gallery / hours /
contact that the site renders from and the owner manages — deliberately separate from `SiteContent`
(rendered AI text) and from the CRM `services` collection (request routing).

### Tasks
| # | Scope |
|---|---|
| 2.1 | New `src/features/business-content/` (feature folder: `types.ts`, `schemas.ts`, `<thing>.schema.ts`, `repository.ts`, `api/*`). Single collection `businessitems` (explicit `collection:` name), discriminated by `kind: "service" \| "menu_item" \| "gallery_item" \| "hours" \| "contact"`, per-locale rows linked by `baseKey`, carries `origin`/`edited` provenance, `active`, `sortOrder`, `imageS3Key` (reuse `images/lib/s3.ts` patterns). OwnerId on every owner-scoped query (fixes the audit's ownerId-filter gap). Indexes inline in schema. |
| 2.2 | CRUD API `GET/POST/PATCH/DELETE /api/sites/[siteId]/business-items{,/[itemId]}` following the services pattern (session → `getSiteForOwner` → per-item `*ForOwner(siteId, ownerId)`). Zod per-kind schemas in `schemas.ts`. |
| 2.3 | Merge-protection foundation: `business-content/lib/merge-items.ts` mirroring `mergePageContent` (`if (item.edited && !force) keep`); an item-level `countEditedItems`; wire into a shared "edited count" that EPIC 5 makes the confirm-gate consume. |
| 2.4 | Persistence: `Site` docs gain `businessContent` links? — **no**: keep catalog as its own collection (per DEC-4). `publish-site.ts` snapshot gains the catalog in EPIC 5, not here. |

### Acceptance
- CRUD works for all five kinds, owner-scoped (404 for non-owner, 401 anonymous), zod-validated (422).
- en/ar rows can coexist per `baseKey`; editing one locale never touches the other.
- Per-item `origin`/`edited` survives writes; regeneration protection contract exists (consume in EPIC 5/7).
- Verification gate green; both message files updated for any new labels.

### Out of scope
- Rendering, publishing, AI generation (EPICs 5, 7). No new npm deps. No locale-neutral CRM changes.

---

## EPIC 3 — Business Dashboard (wire it, localize it, manage the catalog)

Goal: the existing per-site dashboard stops being orphaned and manages the new catalog.

### Tasks
| # | Scope |
|---|---|
| 3.1 | **Discovery** — add a real entry point to `/{locale}/sites/[siteId]/dashboard`: link from `SiteCard` (account dashboard) and/or the editor shell. |
| 3.2 | **i18n repair** — convert the hardcoded English in `dashboard/layout.tsx`, `dashboard/*/page.tsx`, `services/*`, `requests/*`, `customers/*` (see audit list) to `next-intl`, reusing the already-declared-but-unused `business.nav.*` keys; replace directional Tailwind (`text-left/right`) with logical props. Keys in BOTH `en.json`/`ar.json`. |
| 3.3 | **Broken endpoints** — fix client components that POST to page paths instead of `/api/...` (`DeleteServiceButton`, `ChangeStatusForm`, `AddNoteForm`, `UpdateCustomerNotesForm`). |
| 3.4 | Re-enable `ServiceForm` edit mode (pass `editing`/`onCancel`, add the per-service edit UI so `PATCH` is reachable) and add catalog CRUD screens for `business-items` (services/menu/gallery/hours/contact) reusing the dashboard layout + form patterns. |
| 3.5 | Cascade delete: `sites/api/delete-site.ts` also deletes `services`, `customers`, `servicerequests`, and `businessitems` for the site (existing leak — fixes orphaned rows for every new collection). |

### Acceptance
- Dashboard reachable from product chrome; every string localized (en+ar); RTL clean.
- All CRUD actions hit `/api/...` routes that exist; edit-mode service PATCH works.
- Catalog manage/delete works; deleting a site removes all its child rows.
- Verification gate green.

### Out of scope
- New dashboard "super admin" features (EPIC 12). No visual redesign beyond the i18n/logical-prop fixes.

---

## EPIC 4 — Template Rebuild (professional multi-section templates)

Goal: professional, consistent, responsive templates with realistic demo content and consistent
footers — without breaking the immutable contract (template ids, page ids, slugs, section types,
required field keys) of existing sites.

### Tasks
| # | Scope |
|---|---|
| 4.1 | **Defect fixes** — `event-planner` palette: add the referenced `--navy`/`--cream`/`--gold` (or correct the reference); strip hardcoded English wordmarks/taglines from `HeaderSection.tsx` (`RL`, `VOLATILE`, `Ember & Oak`, `THE MERIDIAN`, `Harlan & Co.`, `Ironclad`, `mara`, `Atelier Voss`, `est. …` taglines) -> bilingual labels from the template/demo content. |
| 4.2 | **buildPages flexibility** — allow per-template page composition: stop forcing CTA duplication on home/about/services; support category-specific page patterns only where a section type exists (no new section types without approval). Keep home `header→…→footer` invariants. Re-derive `switch-template` entitlement so billing matches actual page count of the **existing** template (keep same total anyway) or document the page-cost delta. |
| 4.3 | **Consistency & richness** — audit all 22 templates for: footer consistency (shared `FooterSection`, per-template footer nav/fields), every page having meaningful, realistic demo content (`demoContent.ts` keyed per template), responsive review at mobile/tablet widths, RTL check per template, no missing `defaultAsset` image paths (validate all 13 `real/<id>/` dirs + `preview.svg`). |
| 4.4 | **Backward compatibility guard** — no template `id`, page `id`, page `slug`, `SectionType`, or required field key changes; `templateId` on existing sites keeps resolving; `page-shape`/live routes unaffected. Add a checklist entry in `05-TEMPLATE/01-template-structure.md` (§23) — tick it per template. |

### Acceptance
- All 22 templates render in `/preview/<id>` and every subpage, en+ar, no broken images.
- No hardcoded English user-facing strings anywhere in `shared/site-render/`.
- Existing published sites still render unchanged (identical ids/keys).
- Verification gate green.

### Out of scope
- New section types (approval required separately — audit shows 14 exist and cover the current pages). No changes to `SiteContent`/`SiteImage`/`PublishedSnapshot` shapes. No new npm deps.

---

## EPIC 5 — Template ↔ Data Integration

Goal: the business catalog actually drives the site, and the publish/separate-actions invariant
applies to it.

### Tasks
| # | Scope |
|---|---|
| 5.1 | `sharred/site-render` gains a catalog source: sections `services`, `menu`, `gallery`, `contact` (and `hours`) read catalog items when they exist (per locale, sorted, image via `s3Key`/`SlotImage`), falling back to the legacy content-field keys otherwise. Add the catalog as a prop on `SiteRenderer`/`SectionRenderProps` (work in `working` catalog identical to `working` content). |
| 5.2 | **Publish invariant** — `publish-site.ts` includes the active business catalog in `PublishedSnapshot`; `get-published-site` returns it; `LiveSitePage` renders from the snapshot. Editing catalog → `hasUnpublishedChanges` true; live unchanged until publish. Public `GET /api/live/[slug]/services` (CRM) behavior unchanged. |
| 5.3 | **Regen safety** — extend `countEditedFieldsInContent` (+ `/regenerate-impact`) to include item-level edited counts; full-site regen confirm now accounts for catalog edits; section-regen and template-backfill honor item `edited`. Remove/avoid the additive-only backfill trap (fix pruning of orphaned keys). |
| 5.4 | Dashboard/editor: business-catalog edit carries the item provenance (origin/edited) exactly like content does today. |

### Acceptance
- A site with catalog items renders them from the catalog; a legacy site (content fields only) renders exactly as before.
- Editing a catalog item changes the draft, never the live site until publish.
- `regenerate-impact` reports catalog edits; the forced full-site path respects the confirm modal.
- Verification gate green.

### Out of scope
- AI generation of the catalog (EPIC 7). No schema change to `SiteContent`. No structural/drag-and-drop editing surface (product invariant).

---

## EPIC 6 — Reliability & Build Integrity

Goal: keep the verification gate meaningful; fix audit-flagged hygiene issues that threaten future
work.

### Tasks
| # | Scope |
|---|---|
| 6.1 | Declare `zod` (+ `mongoose`, `langchain` if trivially already in use) in `package.json` per CODE_RULES §4 baseline reconciliation — **flag for human approval** before installing anything new. |
| 6.2 | Fix `shared/db/indexes.ts` doc mismatch: either create the file or correct `03-DATA-MODELS.md:197` to point at inline `*.schema.ts` index declarations. |
| 6.3 | Repair the auth cross-feature imports (`/api/auth/check-phone`, `/store-phone` import `features/monetization/repository`) — move phone-identity repository into `features/auth/` (or document the boundary exception) per `02-ARCHITECTURE.md:41`. |
| 6.4 | Run the full gate (`lint` + `tsc --noEmit` + build with dev server stopped) across both locales; FFFD byte-scan all touched files (OneDrive write corruption guard). |

### Acceptance
- Gate green at repo level; no FFFD bytes in working tree; docs consistent with code.
- Nothing else changes (no feature work here).

### Out of scope
- Everything feature-y (belongs to Epics 1-5, 7).

---

## EPIC 7 — AI Grounding (catalog generation with provenance)

Goal: AI writes the business catalog the same way it writes content — with per-item provenance and
the same edit-protection, without inventing prices.

### Tasks
| # | Scope |
|---|---|
| 7.1 | Relax `SYSTEM_PROMPT` rule 2 so owner-grounded catalog values (services the owner typed, prices they provided) can be used, while **still** banning invented facts untethered to owner input (grounding language added; Arabic included). |
| 7.2 | Add a catalog generation sibling: `buildCatalogMessages` (group sibling items; per-item purposes + limits), `generateCatalog` in `ai-client` (array/object-aware parser — unblock `isStringMap`), catalog validator, catalog placeholders. |
| 7.3 | Orchestrate: a catalog pass run after content generation (`run-generation`), never `force`; `run-site-regeneration` force path applies only to confirmed full regen and keeps item `edited` protection identical to content. `get-status` progress includes a catalog step. |

### Acceptance
- Generated sites (en+ar) come back with catalog items for their template's kinds; prices never invented.
- User-edited items survive regeneration; only confirmed full-site re-generation may overwrite, with the confirm gate reflecting item edits (from EPIC 5.3).
- Verification gate green.

### Out of scope
- New LLM provider or dependency. No change to the 22 templates' contract.

---

## EPIC 8 — Final Validation & Handoff

Goal: prove the whole mandate end-to-end and leave the docs true.

### Tasks
| # | Scope |
|---|---|
| 8.1 | End-to-end walk: sign up (country capture) → wizard → generate (content + catalog) → edit (both locales) → dashboard catalog CRUD → publish → live site renders catalog → regen confirm respects edits → payment surfacing (EG vs non-EG). Repeat for an existing legacy site (backward compat). |
| 8.2 | Update `02-ARCHITECTURE.md`, `03-DATA-MODELS.md`, `90-ACTIVE-TASKS.md` (add expansion epics to the inventory table), this plan (all rows → status). |
| 8.3 | Final gate + FFFD scan; handoff notes (Polar webhook registration for the new env remains a human step; `ADMIN_EMAILS` documented). |

---

## Dependency graph

```
EPIC 0 ──► EPIC 1
    └────► EPIC 2 ──► EPIC 3
                 └──► EPIC 4 ──► EPIC 5 ──► EPIC 7
                        ▲          │
                        └──── 6 ───┘  (continuous gate; run before 8)
                        EPIC 8 (final)
```

- EPIC 2 before 3 and before 5. EPIC 4 before 5 (integration needs the rebuilt templates). EPIC 7 after 2+5.
- EPIC 1 is independent (analysis + payments only) and is **done in code** — it needs human env
  values (`ADMIN_EMAILS`, wallet numbers) to be live.
- Next execution unit: **EPIC 2 — Business Content Model** (`features/business-content/`), then 3.

## Execution model

- One sub-agent per **task** (or one per epic with explicit task bounds), each with: `CODE_RULES.md` +
  parent context + this plan + the decisions doc.
- Shared architectural files (`merge-content.ts`, `publish-site.ts`, `catalog.ts`, `SiteRenderer`/sections,
  `session.ts`) are touched **serially** — never two agents editing them concurrently.
- Never start a task with incomplete dependencies; never implement another logic-track's scope while in one.
- Every epic: update this plan's status + `docs/agent-context/90-ACTIVE-TASKS.md` when closed.