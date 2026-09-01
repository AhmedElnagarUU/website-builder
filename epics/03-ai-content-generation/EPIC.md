# Epic 03 — AI Content Generation

**One-line purpose:** Turn the user's business facts into complete, constraint-fitting website copy for every chosen language — localized, never fabricating specifics, and clearly flagging anything the user should review.

## Why this epic matters for the MVP

This is the product's core promise: "AI does the writing." The user provides facts once and receives full website copy in English, Arabic, or both — Arabic generated as its own culturally-localized version, not a translation of the English. Everything after this epic (editing, publishing) is meaningless without it.

## Scope boundaries

**In scope**
- AI provider client (OpenAI-compatible via plain `fetch`, env-configured — no SDK dependency).
- Prompt builder encoding all generation rules; structured JSON output parsing.
- Field-level constraint enforcement with automatic shorter-retry; safe fallbacks that never block the whole run.
- Full-site generation endpoint (async job pattern) + status endpoint.
- The Step 4 progress screen with retry-on-failure preserving all user input.

**Out of scope**
- Section-level and full-site REGENERATION flows (Epic 04 — they reuse this engine).
- Adding/removing a language after generation (Epic 05).
- Any editing UI (Epic 04).
- Streaming partial results to the client (over-engineering for MVP; poll instead).

## Milestones (in execution order)

| # | Milestone | One-line description |
|---|---|---|
| 01 | `01-generation-engine/` | Client, prompts, validation/retry/fallback, generate + status endpoints. **Contains THE generation contract — read even if your task is elsewhere.** |
| 02 | `02-generation-progress-screen.md` | Single-task milestone: the "Writing your website…" experience. |

## Cross-epic dependencies

Depends on ALL of Epic 02 (site record with businessInfo + templateId + languages must exist). Epic 04 depends on this epic for any content-dependent screen.
