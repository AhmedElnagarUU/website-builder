# 03 — DATA MODELS & CONTRACTS

Source of truth is always the TypeScript. This file is the map. Verified against
`src/features/sites/types.ts`, `src/features/payments/types.ts`,
`src/features/monetization/plans.ts` (2026-09-27).

---

## 1. Site — the core aggregate

`src/features/sites/types.ts`. One document holds everything about a customer's website.

```ts
type Locale     = "en" | "ar";
type SiteStatus = "draft" | "published" | "unpublished";
type WizardStep = "business_info" | "templates" | "language" | "generating" | "editing";
type GenerationStatus = "idle" | "queued" | "running" | "complete" | "failed";

interface Site {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;      // ← ownership invariant, enforced on every read/write
  status: SiteStatus;
  currentStep: WizardStep;
  businessInfo: SiteBusinessInfo;
  templateId?: string;
  languagesRequested: Locale[];
  activeLanguages: Locale[];
  content: SiteContent;         // pages → locale → sectionKey → ContentField
  images: Record<string, SiteImage>;
  brandColor: string;
  slug?: string;                // set on publish
  publishedSnapshot: PublishedSnapshot | null;
  hasUnpublishedChanges: boolean;
  generation: SiteGeneration;   // { status, error?, startedAt?, finishedAt? }
  createdAt: Date; updatedAt: Date;
}
```

`SiteDTO` mirrors `Site` with `ObjectId`/`Date` stringified — this is what crosses the API boundary.
Use the DTO in client code; never leak raw mongoose objects.

`UpdateSitePatch = Partial<Omit<Site, "_id" | "ownerId" | "createdAt">>` — `ownerId` is immutable
through the API by construction.

### businessInfo

`{ name, category, description?, targetCustomers?, services?, location?, contactPhone?,
contactEmail?, usps?: string[], notes?: string[] }`

`category` is a closed union of 17 `CategoryId`s (`services`, `restaurant`, `retail`,
`professional`, `portfolio`, `construction`, `interior_design`, `law`, `software_it`,
`real_estate`, `beauty_fitness`, `education`, `automotive`, `events`, `travel`, `b2b`, `clinics`)
with a parallel `CATEGORIES` array. **Adding a category means touching both.**

---

## 2. Content — the part with the hard rules

```ts
type ContentOrigin = "ai" | "user" | "placeholder";

interface ContentField {
  value: string;
  origin: ContentOrigin;
  edited: boolean;
  reviewFlagged?: boolean;
}

type PageContent = Record<Locale, Record<string /* sectionKey */, ContentField>>;
type SiteContent = Record<string /* pageId */, PageContent>;
```

So the shape is `content[pageId][locale][sectionKey] → ContentField`.

**`origin` + `edited` are the mechanism behind the product's core invariant:** AI regeneration must
never silently overwrite what a human wrote. Merge logic lives in
`features/generation/lib/merge-content.ts`, and the editor calls `/regenerate-impact` to preview
what a regeneration *would* change. If you touch regeneration, you touch this rule — see
`features/generation/lib/merge-content.ts` and preserve `origin: "user"`.

---

## 3. Images

```ts
type Position9 = "top-left" | "top" | "top-right" | "left" | "center"
               | "right" | "bottom-left" | "bottom" | "bottom-right";

interface SiteImage {
  s3Key: string;
  url?: string;        // short-lived SIGNED url, resolved on demand — never persisted
  width?: number; height?: number;
  position?: Position9;
}
```

`images` is `Record<slotId, SiteImage>`. The bucket is **private**: reads go through
`images/lib/signed-image-urls.ts` / `images/sign-url`, so a stored `url` must never be treated as
durable. S3 key pattern: `sites/{siteId}/{slotId}/{uuid}.{ext}`.

---

## 4. Publishing snapshot

```ts
interface PublishedSnapshot {
  templateId: string;
  activeLanguages: Locale[];
  content: SiteContent;
  images: Record<string, SiteImage>;
  brandColor: string;
  publishedAt: Date;
}
```

The live site renders **only** from this snapshot, never from live `site.content`. That is what makes
publishing a distinct, deliberate action and lets the editor show a
"has unpublished changes" drift indicator. Editing a site therefore does **not** change the public
site until publish runs again.

---

## 5. Payments

`src/features/payments/types.ts`

```ts
type PaymentProviderId = "polar";
type PaymentStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded" | "voided";

interface PaymentRecord {
  _id: Types.ObjectId; userId: Types.ObjectId;
  planId: "pro";
  status: PaymentStatus;           // "paid" only ever set by a verified webhook
  amountMinorUnits: number;        // integer minor units — never floats
  currency: string;
  provider?: PaymentProviderId;
  providerPaymentId?: string; providerOrderId?: string; providerTransactionId?: string;
  providerMetadata?: Record<string, unknown>;
  paymentMethod?: string;
  createdAt: Date; updatedAt: Date;
}

interface PaymentSession {         // what the provider hands back to the client
  provider: PaymentProviderId;
  providerPaymentId: string;
  providerOrderId?: string;
  url: string;    // Polar hosted-checkout redirect URL the browser follows
}
```

`CreatePaymentInput.internalPaymentId` **is** the `PaymentRecord._id` as a string — it is echoed to
the provider as `external_customer_id` so the webhook can find the record again.

**Amounts are integers in minor units** (EGP piastres). Pro is `49900` minor units = **499.00 EGP**.
Take the amount from the plan definition, never hardcode it in a route or component.

---

## 6. Plans & entitlements

`src/features/monetization/plans.ts` — bilingual plan names, per-plan limits:

| Limit | Free | Pro |
|---|---|---|
| `maxSites` | 1 | 10 |
| `maxPagesPerSite` | 4 | 50 |
| `maxLanguages` | 1 | 2 |
| `maxPublishedSites` | 1 | 10 |
| `maxImageBytes` | 10 MB | 50 MB |
| `dailyAiGenerations` | 2 | 50 |
| `customDomain` | ❌ | ✅ |
| price | — | `49900` minor units EGP |

Enforcement is via `monetization/lib/entitlement.ts` → `withEntitlement`, which returns
`402`/`403` with `{ error, plan, limitKey }`. A `limitKey` is a *limit field name*, so the client can
show the right message — keep new limits in the same shape.

Trial state lives in its own status endpoint (`/api/trial/status`).

---

## 7. Auth collections — hands off

`user`, `session`, `account` and better-auth's other collections are created and maintained by
**better-auth's own adapter**. Read through `features/auth/lib/session.ts`
(`getSession` / `requireSession`); never write these collections directly.

---

## 8. Conventions for changing a model

1. Edit the interface in the owning feature's `types.ts` — never in `shared/`.
2. Update `schemas.ts` (zod) if the change crosses an API boundary.
3. Migrations/backfill: none are automated here. For a shape change on existing data, write an
   explicit, idempotent backfill and say so in your task report.
4. Add DB indexes in `src/shared/db/indexes.ts` if a new query becomes hot.
5. Anything user-facing that a model introduces must appear in **both**
   `src/messages/en.json` and `src/messages/ar.json`.
