# Problem: Template images are real but not business-accurate (Epic 08, M04 task 02)

## Resolution (2026-09-09)

**Status: RESOLVED.** Template imagery is now Pexels-powered and business-accurate,
sourced by `scripts/fetch-template-images.mjs` and self-hosted under
`public/templates/real/<template-id>/` — one folder per template (not per category),
so each template's personas from the Epic-14 audit get their own matched photos.
**No network fetch happens at render/SSG time**; images are downloaded once by the
script and stored in the repo (JPEG, verified ≥ slot minimums on disk).

- Source: Pexels free API (`GET /v1/search`, `Authorization: <key>` header, key from
  `process.env.PEXELS_API_KEY`, defined in `.env.example` only as a placeholder).
  License: commercial use allowed; Pexels asks for a prominent link to
  https://www.pexels.com and photo credit when possible (see
  https://www.pexels.com/api/documentation/ Guidelines).
- Layout: per-template folders under `public/templates/real/<template-id>/`
  (`logo.jpg`, `hero_image.jpg`, `gallery_N.jpg`, `team_N.jpg`). `defaultAsset`
  literals were updated in `src/features/templates/catalog.ts` (`.webp` → `.jpg`,
  category folder → template folder). Old category folders and 37 `.webp` files were
  removed.
- Re-run the script any time (re-fetches fresh photos): set `PEXELS_API_KEY` and run
  `node scripts/fetch-template-images.mjs` (add `--dry-run` to preview what it would
  fetch). Rate limit ~200 req/hour free tier; the script backs off and retries.

---

## What the epic asked for

Each template should use real, **business-accurate** photos. For example:

- a *restaurant* template should show food
- a *consultancy / professional* template should show an office
- a *shop / retail* template should show products
- a *portfolio* template should show creative work

This is M04 task 02 ("Real stock imagery replacing SVG placeholders").
The requirement: replace placeholder SVGs with real imagery, licensed-safe,
self-hosted under `public/templates/real/<category>/`, with **no network fetch
or new dependency at render time**.

## What was done

We downloaded **37 real photos** into the project, self-hosted and offline at
`public/templates/real/<category>/` (categories: services, restaurant, retail,
professional, portfolio). They are genuine photographs (collected via the free
service **picsum.photos**, which serves Unsplash-licensed photos).

This satisfied the mechanical parts of the task:
- real photographic imagery (not flat SVGs)
- local + offline at render time (no runtime third-party fetch)
- no new dependency
- correct aspect ratios / minimum dimensions

All code checks pass: `tsc --noEmit`, `next lint`, `next build`.

## The actual problem

**picsum.photos serves a random photo for a given number/seed — it cannot
search by topic.** It has no "give me a restaurant" or "give me an office"
feature. So while every image is a real photo, its subject is not guaranteed to
match the business category.

Consequences:
- a *restaurant* template's images may show e.g. a mountain or an abstract
  scene instead of food
- a *professional* template may show a landscape instead of an office
- this undercuts "imagery that sells the business" from the milestone, and the
  visual distinctiveness required by the design-polish task

So: **real imagery ✅, business-accurate imagery ❌ (not guaranteed).**

## Why it was not fixed with accurate photos

To get pictures that actually match a topic we need a service that searches by
keyword. We tried the two common free options and **both are currently down**:

| Source | Purpose | Status today |
|--------|---------|--------------|
| `https://source.unsplash.com/1600x900/?restaurant,food` | Search photos by keyword | **HTTP 503 (server unavailable)** |
| `https://loremflickr.com/1600/900/restaurant?lock=7` | Search photos by keyword | **HTTP 500 (server error)** |

`picsum.photos` (the one that works) cannot do topic search.

## Options to resolve

1. **Keep the current real photos (recommended).** Everything works end-to-end
   and all checks are green; the only shortcoming is the subject of each photo is
   not category-guaranteed.

2. **Provide your own photos.** You drop business-accurate images into
   `public/templates/real/<category>/` (same filenames) and we wire them up.
   This gives the best, fully accurate result.

3. **Keep retrying the keyword sources.** They may come back, but they are
   flaky and this could take longer with no guarantee.

## Files affected

- `src/features/templates/catalog.ts` — the `defaultAsset` paths point to
  `/templates/real/<category>/...`
- `public/templates/real/<category>/*.webp` — the downloaded photos
