# Site Creation 500 Error — Fix Summary

## Root Cause
`null` `content` on legacy sites propagated through the codebase and crashed downstream consumers:
1. **`maybeMigrateContent`** in `repository.ts` — `isLegacyFlatContent(null)` returns `false`, so null content was never normalized. Sites with `content: null` in the DB passed through as-is.
2. **`getUsageForUser`** in `lib/usage.ts` — called `Object.keys(site.content).length` on every site. When `content` was `null`, this threw `TypeError: Cannot convert undefined or null to object`. This crashed inside the entitlement check that runs before `updateLanguages`, so the 500 was unreachable by the try-catch in the languages route.

## Implemented Fix
- `maybeMigrateContent` now normalizes null/undefined content to `{}` and persists the fix to the DB
- `getUsageForUser` uses `site.content || {}` as defense-in-depth

## Validation
- TypeScript compilation passes (`npx tsc --noEmit`)
- Manual test confirms null content handling: `Object.keys(null || {}).length` → 0, no crash
- All `site.content` consumers now have null guards

## Commit Hash
`04c86c9` pushed to `origin/main`

## Current Status
✅ 500 error fixed — null content now safely normalized to `{}`

---

# Website Writing Failure — Fix Summary

## Root Cause
Two issues caused the "We couldn't finish writing your website" error:

1. **Invalid AI model**: `GEMINI_KEY` in `.env` forced `gemini-3.6-flash` (an invalid model name). The model was rejected by the provider, causing a 400 "Provider returned error".

2. **No structured output fallback**: The AI client sent `response_format: { type: "json_object" }` unconditionally. Models that don't support structured outputs rejected the request with no retry.

## Implemented Fix
| File | Fix |
|---|---|
| `src/features/generation/lib/ai-config.ts` | OpenRouter takes priority when configured; fallback to Gemini; Gemini model fixed to `gemini-2.0-flash` |
| `src/features/generation/lib/ai-client.ts` | Graceful fallback: when structured outputs are rejected, retry without `response_format` |

## Validation
- TypeScript compiles clean ✅
- End-to-end generation test: all 6 pages generated with AI content ✅
- OpenRouter priority verified with `GEMINI_KEY` set ✅
- Commit `c358d33` pushed to `origin/main`

## Current Status
✅ Website writing failure fixed — generation completes successfully

---

# HeroSection Rendering Error — Fix Summary

## Root Cause
`SiteRenderer` receives `images` that can be `undefined` at runtime (old MongoDB documents created before the `images` field existed). The TypeScript type says `Record<string, SiteImage>` (required), but at runtime it's `undefined`. All `images[slotId]` accesses in HeroSection, Gallery, Team, Header crash with `Cannot read properties of undefined (reading 'hero_image')`.

## Implemented Fix
`src/shared/site-render/SiteRenderer.tsx` — default `images = {}` so sections never receive `undefined`

## Validation
- TypeScript passes clean ✅
- Full build passes ✅
- Commit `c7f74c1` pushed to `origin/main`

## Current Status
✅ HeroSection rendering error fixed

---

# Template Strategy & Product Improvements — Status

## Completed & Committed

| Task | Commit | Key Change |
|---|---|---|
| 500 Error (null content) | `04c86c9` | Null guard in repository.ts + usage.ts |
| Website Writing Failure | `c358d33` | OpenRouter priority + structured output fallback |
| HeroSection Rendering | `c7f74c1` | Default `images = {}` in SiteRenderer |
| Publish Popup + Live URL | `23b3060` | Design system colors + NEXT_PUBLIC_APP_URL priority |
| Template Navigation | `84ceb57` | Stepper: `overflow-x-auto` → `flex-wrap` |

## Documentation
- `template-strategy.md` — 10 templates, 11 gaps, 7 archetypes proposed
- `docs/site-settings-integration-assessment.md` — MVP vs Post-MVP analysis

## Failed (needs retry)
- Eye/Preview icon horizontal overflow — rate limited 3x

## Template Gaps (11)
Construction, Interior Design, Law, Software/IT, Real Estate, Beauty/Fitness, Education, Automotive, Events, Travel, B2B-proper

## Post-MVP (not implemented)
Orders, CRM, Inventory, Payments, Business management