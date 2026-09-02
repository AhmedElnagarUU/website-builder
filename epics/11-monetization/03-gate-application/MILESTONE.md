# Milestone 03 — Gate the Application

## Goal
Apply the monetization guards to every monetized surface with sensible Free-plan defaults so nothing breaks for existing users, and surface a clear upgrade/paywall message (bilingual) when a limit is hit.

## Shared context — GATING MATRIX (binding)
| Surface | Action | limitKey |
|---|---|---|
| Create site | `POST /api/sites` | `maxSites` |
| Change template | `POST /api/sites/[id]/switch-template` | `maxPagesPerSite` (only if pages would exceed) |
| Add language | `POST /api/sites/[id]/languages` | `maxLanguages` |
| Add/add page | content/gen path | `maxPagesPerSite` |
| Publish | `POST /api/sites/[id]/publish` | `maxPublishedSites` |
| AI generate/regenerate | `POST /api/sites/[id]/generate`, `/regenerate`, `/regenerate-section` | `dailyAiGenerations` |
| Image upload | `POST /api/sites/[id]/image-upload` | `maxImageBytes` (file size) |

- All routes keep their existing auth/side-effects; monetization is an additional guard on top, returning the standard paywall shape (M02).
- **Free-plan defaults must preserve today's behavior** (a Free site can still create/edit its e.g. 4-page site, publish 1 site, 1 language, default image size, 2 AI gens/day). If a current Free user would now be blocked vs before, prefer a permissive Free default unless the epic explicitly tightens it — keep the MVP usable.
- On a block, the client shows a bilingual paywall/upgrade prompt with a "Current plan" affordance (this epic adds the affordance; the detailed upgrade/checkout page is out of scope).
- Both EN + AR, RTL-safe; all copy through next-intl.

## Tasks
1. **01-guard-create-publish-and-language** — wire guards into create site, publish, languages, and switch-template routes.
2. **02-guard-ai-and-image** — wire daily-AI and image-size guards into generate/regenerate and image-upload.
3. **03-plan-affordance-and-paywall-ux** — "Current plan" notice + upgrade-required paywall prompts (bilingual), wired to the standardized errors.
