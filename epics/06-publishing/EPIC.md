# Epic 06 — Publishing & Live Serving

**One-line purpose:** Let the business owner take the finished, edited site and publish it as a read-only public website served at a system URL (`/live/[slug]`), where editing and publishing stay strictly separate, and English + Arabic are both served first-class.

## Source of truth / current state

This epic is the final product gap identified in `COMPACTION1.md` (project root): **the publishing / live-serving epic is NOT STARTED**. There is no publish action anywhere in the codebase, and `src/app/live/[slug]/` does not exist (verified: `Test-Path "src\app\live"` -> False). Everything this epic plans is greenfield, but it MUST build on the real artifacts already in place:

- The `PublishedSnapshot` / `Site` / `ContentField` / `SiteImage` / `Locale` types in `src/features/sites/types.ts` (quoted in `01-publish-api/MILESTONE.md` — do not invent a different shape).
- The site persistence layer `src/features/sites/repository.ts` (`updateSite`, `getSiteForOwner`, `toSiteDTO`).
- The shared renderer `src/shared/site-render/SiteRenderer.tsx` + its rendering contract (`04-preview-and-edit/01-site-render/MILESTONE.md`).
- The established auth + ownership pattern (`getSession()` + `getSiteForOwner`) used by every `[siteId]` route.
- The unique `slug` index already declared in `src/shared/db/indexes.ts`.
- The `NEXT_PUBLIC_SITES_DOMAIN` env var (declared in `.env.example`).
- The Monomastic UI foundation from Epic 05 for the Publish control's styling.

## Why this epic matters for the MVP

The product promise is: AI writes a whole website, the owner lightly edits it, and **publishes it at a system URL**. Epics 02–05 deliver everything up to the edit surface; without this epic the finished site exists only in an authenticated editor and can never be shared with the world. This epic closes the loop: a genuine, explicit Publish action that freezes a snapshot, a public read-only renderer served from that snapshot, an Unpublish/re-publish lifecycle, and the "you have unpublished changes" state — all honoring the invariant that publishing and editing are separate actions and Arabic is first-class RTL.

## Scope boundaries

**In scope**
- A real Publish action: a `POST /api/sites/[siteId]/publish` route + feature function + repository method that snapshots the site's current `content` / `images` / `templateId` / `activeLanguages` / `brandColor` / `businessInfo` into `Site.publishedSnapshot`, assigns a unique `slug`, sets `status` to `published`, and resets `hasUnpublishedChanges` to `false` (`M01`).
- A public read-only renderer at `src/app/live/[slug]/` that reads the **last published snapshot** and renders it with the existing `shared/site-render` engine (`editMode` off) wrapped in a minimal HTML shell, with per-locale `/live/[slug]/en` and `/live/[slug]/ar` pages so Arabic is a first-class RTL URL, never a translation skin (`M02`).
- The Publish UI in the editor: a clearly separate "Publish" control distinguished from inline editing/autosave, with confirmation, success state, the live URL, and an "unpublished changes" re-publish affordance (`M03`).
- Unpublish + re-publish lifecycle: an explicit Unpublish action, unpublished sites return a "not live" state, and verification/health-style checks across the whole publish → serve → edit → republish → unpublish flow (`M04`).

**Out of scope**
- ANY structural/drag-and-drop editing surface — permanently out of product scope (AGENTS.md/CODE_RULES.md). The live page is read-only output; never add move/add/delete, even disabled.
- Auto-publishing on autosave or any implicit trigger. Publishing is only ever an explicit user action (product invariant).
- Silent overwrites: editing/regenerating/retemplating content never touches the published snapshot, and re-publishing is always an explicit confirmed action.
- A custom domain / subdomain product (the live site is served on the main app at `/live/[slug]`; no DNS, no per-site subdomain cert provisioning). `NEXT_PUBLIC_SITES_DOMAIN` is used only as the canonical public origin for shareable links.
- Contact form submissions, CMS, analytics, SEO tooling, or a publishable admin/back-office beyond what the tasks define.
- New npm dependencies (none are required; no font, no hosting SDK).

## Milestones (in execution order)

| # | Milestone | One-line description |
|---|---|---|
| 01 | `01-publish-api/` | The explicit Publish action: snapshot creation, unique slug assignment, and the owner-authorized `POST /api/sites/[siteId]/publish` route. |
| 02 | `02-live-renderer/` | Public read-only `src/app/live/[slug]/` pages serving the last published snapshot via `shared/site-render` (EN + AR first-class). |
| 03 | `03-publish-ui/` | The editor's separate Publish control + live-URL display + unpublished-changes / re-publish affordance. |
| 04 | `04-unpublish-and-verify/` | Unpublish action, unpublished-state handling on the live route, and end-to-end verification. |

## Flags raised (do not resolve silently)

Per the epic-structuring instructions, the following were explicitly checked and flagged rather than decided behind the scenes. Defaults chosen are marked; a human should sign off before building.

1. **Serving mechanism — main-app `/live/[slug]`, no separate domain.** The scaffold and `COMPACTION1.md` expect the public live site at `src/app/live/[slug]/`, served on the main app. `NEXT_PUBLIC_SITES_DOMAIN` exists in `.env.example`; this epic treats it as the **canonical public origin** for shareable links and `<link rel="canonical">`/Open Graph URLs, **falling back to the request origin when unset**. It does **not** provision a per-site subdomain or separate hosting. **Decision default: main-app `/live/[slug]`; env var optional override.** Flag for review.
2. **Publish trigger — explicit user action only.** Publishing fires on an explicit Publish button, fully separate from editing/autosave. It never fires on autosave, content PATCH, image upload, regeneration, or template switch (all of those instead set `hasUnpublishedChanges`, which the codebase already does via the `site.publishedSnapshot !== null ? true : …` pattern). This is required by the invariant. Default chosen; no conflict.
3. **Renderer reuse — confirmed.** The published page reuses the existing `shared/site-render` `SiteRenderer` and only wraps it in an HTML shell (`<html lang dir>`, fonts, page metadata) for a public URL. There is exactly one renderer (never a second divergent implementation), per `04-preview-and-edit/01-site-render`. Default chosen.
4. **Edited-but-unpublished content.** The live URL always serves `Site.publishedSnapshot` (the last *published* version), never in-progress edits. Editing sets `hasUnpublishedChanges=true` (already true in the codebase once a snapshot exists). Re-publishing overwrites the snapshot as an explicit, confirmed action — never silently. Default chosen; consistent with existing code.
5. **Assignment of `Site.slug` on publish.** `Site.slug` is currently never set anywhere, yet a unique index on it already exists (`src/shared/db/indexes.ts`). This epic assigns the slug on publish (slugified `businessInfo.name` + short unique suffix, with collision retry against the unique index). **This is the first writer of `slug`** — flagged so a human knows `slug` becomes live-populated here. Default chosen.
6. **Authorization for publish/unpublish.** Publishing is a genuine action on the owner's own site: the publish and unpublish routes verify the session and `site.ownerId === session.user.id` via the existing `getSession()` + `getSiteForOwner` pattern, returning `401`/`404` otherwise — identical to all other `[siteId]` routes. The live read path is **public** (no auth) but only serves `publishedSnapshot` of `status==="published"` sites. Default chosen.
7. **Arabic/RTL on the live site.** The snapshot stores `activeLanguages`, and Arabic is a first-class locale. To keep the live site outside locale-prefixed app routing yet fully first-class, the live site uses **per-locale URL segments** `/live/[slug]/en` and `/live/[slug]/ar` (each a fully separate page rendering `content[ar]`/`content[en]` with correct `dir`), plus a language switcher. This is **not** a translation skin — each locale is a distinct URL with its own content. A bare `/live/[slug]` redirects to the preferred/`en` locale. Default chosen.
8. **S3 vs DB for the snapshot.** The `PublishedSnapshot` itself is stored in MongoDB on `Site.publishedSnapshot` (matching the model), and its images are referenced by `s3Key`. Public (unauthenticated) serving reads images from the existing public bucket base URL (`S3_PUBLIC_BASE_URL`, per CODE_RULES §7) — images are already served publicly, so no new public-access/signing work is needed. Default chosen; flagged because public S3 access is assumed by existing image serving.

## Cross-epic dependencies

- **Epic 01** — better-auth session (`getSession`), db singleton, i18n message infrastructure.
- **Epic 02** — `Site` model (`publishedSnapshot`, `slug`, `status`, `hasUnpublishedChanges`), repository, zod schemas, template catalog (template resolution by `templateId`).
- **Epics 03/04** — content/images/brand/template exist and are editable; `SiteRenderer` (Epic 04 M01) is the live renderer.
- **Epic 05** — Monomastic UI tokens/components for styling the Publish control (additive only).
- Executes **after** all of 01–05 (they are complete per `COMPACTION1.md`).

## Acceptance criteria (epic-wide)

- A user can Publish an owned site and receive a stable `/live/[slug]` URL; the snapshot it serves reflects the site's content/images/brand/template/active languages at publish time.
- The live page is read-only and renders via `shared/site-render` with editing disabled; it serves the **last published snapshot**, never in-progress edits.
- Editing after publish shows "unpublished changes" and never auto-publishes or silently overwrites published content; re-publishing is an explicit confirmed action.
- Both `/live/[slug]/en` and `/live/[slug]/ar` render correctly with proper `lang`/`dir` (Arabic RTL first-class, not a translation skin).
- Unpublish makes the URL return a clear "not live" state; re-publish restores it.
- No structural/drag-and-drop editing surface anywhere; no new npm dependencies; no hardcoded user-facing strings (all through next-intl, `en`/`ar`).
- `npm run lint && npm run typecheck && npm run build` pass; safe build procedure from `COMPACTION1.md` respected.
