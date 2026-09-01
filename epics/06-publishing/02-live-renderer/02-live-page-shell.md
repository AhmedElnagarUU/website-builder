# Task 02 — Public live pages: `src/app/live/[slug]/[lang]/page.tsx` + HTML shell + locale redirect

## Context

The public, read-only website. This task builds `src/app/live/[slug]/[lang]/page.tsx` rendering the last **published snapshot** via the existing `SiteRenderer` (`editMode={false}`) wrapped in a minimal public HTML shell, plus the bare `/live/[slug]` route that redirects to a default locale. It is the only runtime consumer of `getPublishedSiteBySlug` (Task 01) and the `live-url` helper (M01).

## Scope

- `src/app/live/[slug]/[lang]/page.tsx` (server component) — renders the published site for `lang ∈ { en, ar }`.
- `src/app/live/[slug]/page.tsx` — redirects to a default locale segment.
- A minimal `layout.tsx` for the live section (fonts, metadata) distinct from the product's auth app shell.
- Correct `notFound()`/`not_live` handling.

## Technical details

Layout / shell (public, outside `[locale]` app routing):
- A live `layout.tsx` under `src/app/live/` that sets up fonts and base metadata only. It must NOT pull in the product's authed app shell/navigation (this is the customer-facing site, not the product UI).
- Both `/live/[slug]/en` (LTR, `lang="en"`) and `/live/[slug]/ar` (RTL, `lang="ar"`, `dir="rtl"`) are full, separate pages.

Page logic (`[lang]/page.tsx`, server component):
```ts
const { slug, lang } = await params;
const result = await getPublishedSiteBySlug(slug);
if (!result.ok) notFound();                       // unknown slug OR not-live
if (lang !== "en" && lang !== "ar") notFound();   // invalid locale segment
if (!result.snapshot.activeLanguages.includes(lang)) notFound();  // locale not active on publish
const template = getTemplate(result.snapshot.templateId);
if (!template) notFound();
```
- Render `<SiteRenderer template={template} locale={lang} content={result.snapshot.content[lang]} businessInfo={result.businessInfo} images={result.snapshot.images} brandColor={result.snapshot.brandColor} editMode={false} s3PublicBaseUrl={process.env.S3_PUBLIC_BASE_URL} />`.
- `SiteRenderer` is a client component; the page passes server-fetched props into it.

Bare `/live/[slug]`:
- `page.tsx` reads the site via `getPublishedSiteBySlug`; if `notFound`/`not_live`, `notFound()`. Otherwise `redirect("/live/{slug}/en")` (default locale; a future human may switch the default, but `en` is the default for both locales to keep the bare URL stable). Use `redirect` from `next/navigation`.

Metadata / SEO (light, not a product):
- Per-locale `<title>`/`description` from the snapshot's nav/hero prose fields if available (e.g. `content[lang]["nav_home"]` or hero headline); reuse `live-url` helper for canonical/Open Graph URL. Keep minimal — no SEO tooling.

## Dependencies

- Task 01 (`getPublishedSiteBySlug`), M01 (`live-url` helper).
- `src/shared/site-render/SiteRenderer.tsx` + its contract (`04-preview-and-edit/01-site-render/MILESTONE.md`).

## Out of scope

- Language switcher UI (Task 03).
- Any editing affordances — the page renders read-only output sublty; never add structural controls (permanent product out-of-scope).
- Restyling the generated site (the renderer owns template styling; this page only wraps it).

## Acceptance criteria

- [ ] `/live/[slug]/en` and `/live/[slug]/ar` render the published snapshot read-only via `SiteRenderer editMode={false}`.
- [ ] `/live/[slug]` redirects to `/live/[slug]/en`.
- [ ] Unknown slug, unpublished site, or a locale not in `activeLanguages` returns 404.
- [ ] Arabic `/ar` renders RTL first-class (correct `dir`/`lang`), distinct from `en`; not a translation skin of the same page.
- [ ] Public shell has no product auth/navigation chrome; only fonts/metadata + the site.
- [ ] Images resolve via `S3_PUBLIC_BASE_URL` for unauthenticated visitors.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; read-only, public, RTL-correct; no new deps; no structural editing surface; no hardcoded user-facing strings (metadata may fall back to empty when fields are absent).
