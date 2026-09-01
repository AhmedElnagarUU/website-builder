# Task 01 — AI provider client & prompt builder

## Context

The engine talks to an OpenAI-compatible chat completions API configured entirely by env vars (no SDK dependency — approved-deps rule). The prompt is the product's quality gate: it must force structured JSON, native Arabic localization, and the no-fabrication rules. This task produces two pure, testable modules.

## Scope

- `generateFields(prompt): Promise<Record<string,string>>` — calls the provider, parses JSON robustly.
- `buildGenerationMessages({ businessInfo, templateDefinition, locale, otherSectionValues? }): { system, user }` — assembles messages per the contract in this milestone's `MILESTONE.md`.

## Technical details

Files:

```
src/features/generation/lib/ai-client.ts
src/features/generation/lib/prompt-builder.ts
src/features/generation/types.ts   // GenerationRequest, ParsedFields etc.
```

ai-client rules:
- POST `{AI_API_BASE_URL}/chat/completions` with `{ model: AI_MODEL, messages, temperature: 0.7, response_format: { type: 'json_object' } }` via fetch; `Authorization: Bearer AI_API_KEY`.
- Timeout: AbortController at 45s.
- Parsing: strip markdown fences if present, `JSON.parse`, validate shape (`fields` object of strings); on malformed → throw typed error `bad_response` (caller decides retry).
- Never log full prompts/keys; log only status + duration.

System prompt — use EXACTLY this text (English; placeholders in braces filled by builder):

```
You are a professional website copywriter for small businesses.
You write copy for ONE language version of a website, following these absolute rules:

1. Write natively for the target audience. If the target language is Arabic, write natural,
   culturally appropriate Arabic for an Arabic-speaking audience (greetings, framing, tone) —
   never a literal translation of English phrasing. Facts must stay identical across languages.
2. NEVER invent checkable facts: no years in business, no prices, no awards, no certifications,
   no client counts, no named clients — unless explicitly provided in the business information.
   Prefer generic qualitative statements ("experienced local team").
3. Testimonials you write are clearly SAMPLE content: generic first names only, realistic but
   obviously illustrative quotes.
4. Respect every field's length constraint exactly.
5. Use plain, warm, concrete business language. No marketing jargon, no design terminology.

You will receive: business information (some fields may be empty — write plausible, generic
content appropriate to the stated business category for those), and a list of fields with
id, purpose, and constraints.
Return ONLY valid JSON, exactly:
{ "fields": { "<fieldId>": "<text>", ... } }
Every field id MUST be present exactly once.
```

User message contains: labeled business info block (empty values shown as `(not provided)`), target locale code + name, and the field table `key | purpose | maxWords/maxChars`.

## Dependencies

- `epics/03-ai-content-generation/01-generation-engine/MILESTONE.md`
- `epics/02-site-creation-flow/03-template-library/MILESTONE.md` (field list source)

## Out of scope

- Validation/retry/fallback (Task 02), endpoints (Task 03), any UI.

## Acceptance criteria

- [ ] With a mock/fake HTTP server (or injected fetch stub), client posts correct URL/auth/body and returns parsed fields map.
- [ ] Fenced JSON (```json … ```) still parses; garbage response throws typed `bad_response`.
- [ ] 45s timeout aborts and throws typed timeout error.
- [ ] `buildGenerationMessages` for locale `'ar'` includes the Arabic-native instruction verbatim and lists every template field key with its constraint.
- [ ] No secrets logged anywhere (code inspection).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; both modules pure (no DB/site access); zero new dependencies (plain fetch).
