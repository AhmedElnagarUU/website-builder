# Milestone 01 — Site Data Model & Draft Records

## Goal

Every website a user starts (even half-finished) exists as a persisted `sites` document that tracks where they are in the journey, so abandoning mid-flow and returning later resumes exactly where they left off.

## Tasks (execution order)

1. `01-site-schema-and-repository.md` — TypeScript types + repository functions + indexes.
2. `02-site-crud-api.md` — create/fetch APIs with auth + ownership checks.

## Shared context — THE CANONICAL SITE DATA MODEL

This model is binding for Epics 02–06. Tasks restate only the slice they touch; this is the source of truth.

### Categories (fixed enum for MVP)

`'services' | 'restaurant' | 'retail' | 'professional' | 'portfolio'`

### Types (`src/features/sites/types.ts`)

```ts
export type Locale = 'en' | 'ar';
export type SiteStatus = 'draft' | 'published' | 'unpublished';
export type WizardStep = 'business_info' | 'templates' | 'language' | 'generating' | 'editing';

export interface SiteBusinessInfo {
  name: string;                 // REQUIRED
  category: CategoryId;         // REQUIRED (enum above)
  description?: string;         // what the business does
  targetCustomers?: string;
  services?: string;
  location?: string;
  contactPhone?: string;
  contactEmail?: string;
  usps?: string[];              // optional selling points
  notes?: string[];             // optional free-text extras
}

export interface ContentField {
  value: string;
  origin: 'ai' | 'user' | 'placeholder';
  edited: boolean;              // user touched it → protected from silent AI overwrite
  reviewFlagged?: boolean;      // AI filled a blank with generic content → show "review this" marker
}

export interface PublishedSnapshot {
  templateId: string;
  activeLanguages: Locale[];
  content: Record<Locale, Record<string, ContentField>>;
  images: Record<string, SiteImage>;
  brandColor: string;
  publishedAt: Date;
}

export interface SiteImage { s3Key: string; width?: number; height?: number; position?: Position9; }
export type Position9 = 'top-left'|'top'|'top-right'|'left'|'center'|'right'|'bottom-left'|'bottom'|'bottom-right';

export interface Site {
  _id: ObjectId;
  ownerId: ObjectId;                    // better-auth user id (string form in APIs)
  status: SiteStatus;                   // draft → published ⇄ unpublished (delete removes doc)
  currentStep: WizardStep;              // resume point
  businessInfo: SiteBusinessInfo;
  templateId?: string;                  // chosen at step 2
  languagesRequested: Locale[];         // original choice; never modified by later settings changes
  activeLanguages: Locale[];            // currently visible languages
  content: { [locale in Locale]?: Record<string, ContentField> };  // PROSE ONLY — see rule below
  images: Record<string, SiteImage>;    // keyed by template image slotId
  brandColor: string;                   // hex like '#2563EB'
  slug?: string;                        // assigned on FIRST publish; unique sparse index
  publishedSnapshot: PublishedSnapshot | null;
  hasUnpublishedChanges: boolean;       // draft differs from live snapshot
  generation: {
    status: 'idle' | 'queued' | 'running' | 'complete' | 'failed';
    error?: string;                     // machine code only; never surfaced raw
    startedAt?: Date;
    finishedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Binding rules (every task touching sites must respect them)

1. **Verbatim facts are NOT content fields.** Business name, phone, email, and location render straight from `businessInfo` at render time. AI never rewrites them; they are never stored inside `content`. `content` holds AI-generated/user-edited **prose** only.
2. **Ownership**: every API verifies session; `ownerId` mismatch → `404`.
3. **`hasUnpublishedChanges`** flips to `true` on any draft mutation (content, images, brand color, template, business info, languages) whenever `publishedSnapshot != null`; reset to `false` only by publishing.
4. **Resume**: `currentStep` is updated when the user advances; every wizard/editor page reads it and routes accordingly.
5. **Language retention**: removing a language shrinks `activeLanguages` only; `content[locale]` data is retained so re-adding restores it.
6. Indexes: `{ ownerId: 1 }`, unique sparse `{ slug: 1 }`.

### Repository contract (`src/features/sites/repository.ts`)

`createSite(ownerId)`, `getSiteById(id)`, `getSiteForOwner(id, ownerId)` (applies rule 2), `updateSite(id, patch)` (shallow-merge top-level keys, sets `updatedAt`), `listSitesByOwner(ownerId)`, `deleteSite(id)`. Serialization helper `toSiteDTO(site)` converts ObjectId→string for API responses.
