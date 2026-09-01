# Task 02 — `POST /api/sites/[siteId]/publish` route

## Context

The explicit Publish action is surfaced as an HTTP endpoint so the editor's separate Publish control (M03) can trigger it. This task wires the `publishSite` function from Task 01 into a route handler following the project's thin-route convention (parse → call feature function → return response; zero business logic in the route).

## Scope

- A route `src/app/api/sites/[siteId]/publish/route.ts` with a `POST` handler.
- Maps `PublishSiteResult` to the correct HTTP status and body.

## Technical details

Route handler (thin, mirrors `src/app/api/sites/[siteId]/content/route.ts`):

```ts
import { NextResponse } from "next/server";
import { publishSite } from "@/features/publishing/publish-site";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const result = await publishSite(siteId);

  if (result.ok) {
    return NextResponse.json({ site: result.site, slug: result.slug, liveUrl: <liveUrl> }, { status: 200 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (result.error === "not_found") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ error: "validation_error" }, { status: 422 });
}
```

`liveUrl`: `nextUrl(slug)` — a small helper (`src/features/publishing/live-url.ts`) that builds the canonical public URL:
- Resolve a base origin from `process.env.NEXT_PUBLIC_SITES_DOMAIN` when set, else fall back to the current request origin (`process.env.VERCEL_URL` or a sensible default like the request `Host` header available in the handler).
- Return `{base}/live/{slug}`. A bare URL (default locale) is fine for the response; per-locale URLs are the renderer's concern (M02).

Keep `live-url.ts` as the single source of the public URL so M02/M03 reuse it rather than duplicating origin logic.

## Dependencies

- Task 01 (`publishSite`), the `[siteId]` route directory already in use.

## Out of scope

- Unpublish route (M04).
- The editor UI that calls this endpoint (M03).
- Per-locale live URLs (M02).

## Acceptance criteria

- [ ] `POST /api/sites/[siteId]/publish` for an owner with a valid, publishable site returns `200` with `{ site, slug, liveUrl }` and creates the snapshot.
- [ ] Unauthenticated request → `401`; non-owner / unknown siteId → `404`; invalid template/locales → `422`.
- [ ] Successfully published response `liveUrl` uses `NEXT_PUBLIC_SITES_DOMAIN` when set and the request origin otherwise.
- [ ] Route contains no business logic (it only maps results to responses).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; response shape stable for the M03 UI; no new deps.
