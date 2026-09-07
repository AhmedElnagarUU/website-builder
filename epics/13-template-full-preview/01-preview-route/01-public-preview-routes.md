# Task — Public preview routes

## Title
Exempt `/preview` from intl middleware and add `/preview/[templateId]/[[...slug]]` server routes

## Context
The preview must live outside the `/[locale]` tree (it is a standalone website, not an app page). next-intl middleware with `localePrefix: "always"` would rewrite any non-locale path into a locale path, so `/preview` must be explicitly bypassed — matching the existing `/live` bypass.

## Scope
- `src/middleware.ts`: extend the bypass list so `firstSegment === "preview"` (and `"live"`) returns `NextResponse.next()`.
- New route `src/app/preview/[templateId]/[[...slug]]/page.tsx` (optional catch-all: `/preview/<id>` = home page; `/preview/<id>/<pageSlug>` = that page).
- `generateStaticParams()` for every `TEMPLATES` catalog entry × each of its pages (id + `slug: [page.slug]`, home as `slug: []`) so preview pages are SSG.
- `generateMetadata()`: title = template name (+ page name), `robots: noindex` (product preview surface). Return `{}` when the template is unknown.
- 404 when the template id or page slug does not exist in the catalog.
- New feature folder `src/features/template-preview/` to host shell/helpers (task 02 lives there).

## Technical details
- Resolve the active page: `slug?.[0]` (or empty) → find `template.pages` by `slug`; fall back to the `home` page. Use `getTemplate(templateId)` from `src/features/templates/api/list-templates`.
- Render `<TemplatePreviewShell template={template} activePageId={page.id} />` (created in task 02).
- Do not add an app `layout.tsx` with the product navbar/footer — the preview page is entirely the shell. A minimal metadata-only layout is acceptable.

## Dependencies
- Epic 08 (multi-page templates + renderer). Task 02 for the shell it renders.

## Out of scope
- The shell's internals (demo content, locale toggle) — task 02/03.
- Auth, analytics recording, editing.

## Acceptance criteria
- `GET /preview/classic-services` returns 200 and the rendered site HTML; `GET /preview/classic-services/about` renders the about page.
- Unknown template `/preview/nope` and unknown page `/preview/classic-services/nope` → 404.
- `/preview/...` is never redirected to `/[locale]/preview/...` and never rewritten.
- Preview pages appear under `○`/`●` SSG in `next build` output.

## Definition of Done
- `CODE_RULES.md` followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean; build verified per the build rule (stop dev → delete `.next` → `npm run build` → restart → `/api/health`).