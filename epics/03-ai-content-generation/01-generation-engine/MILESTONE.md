# Milestone 01 — Generation Engine

## Goal

A reliable, rule-abiding generation pipeline: business facts + template field list + locale → validated prose for every template field in that locale, stored as semantic `ContentField`s on the site.

## Tasks (execution order)

1. `01-ai-client-and-prompt-builder.md` — provider client + prompt assembly (exact system prompt text provided).
2. `02-field-validation-retry-fallback.md` — constraint checks, shorter-retry, placeholders, review flags.
3. `03-generate-and-status-endpoints.md` — async full-site job + polling status.

## Shared context — THE GENERATION CONTRACT

Binding for this milestone AND Epic 04's regeneration tasks.

### Inputs assembled per run

- `businessInfo` from the site (whatever the user filled; only name+category guaranteed).
- The chosen `TemplateDefinition`'s field list: every field's `key`, `purpose`, and `constraint` (from Epic 02 M03).
- Target locale(s) = `site.activeLanguages`.
- For section regeneration ONLY: current values of other sections (tone/fact consistency).

### Output shape (AI must return exactly this JSON)

```json
{ "fields": { "<fieldKey>": "<generated text>", "...": "..." } }
```

One call per locale. Every key of that locale's template fields MUST be present.

### Hard rules (encoded in the system prompt verbatim — see Task 01)

1. **Localized, not translated**: Arabic output is written natively for an Arabic-speaking audience (greetings, framing, tone), NOT a literal rendering of English phrasing. Facts stay identical across languages.
2. **Never fabricate checkable specifics**: no years-in-business numbers, prices, awards, certifications, client counts, or named clients — unless the user provided them. Use generic qualitative language instead.
3. **Testimonials are SAMPLES**: clearly generic sample quotes, never presented as real customers.
4. **Respect each field's constraint** (max words/chars) exactly.
5. **Business language only** — plain, warm, concrete; no jargon.
6. Factual fields (business name, phone, email, location) are NEVER generated — they render from `businessInfo` at display time (Epic 02 M01 rule 1). The AI is not asked for them.

### Verbatim-fact & missing-info handling at merge time (not prompt time)

- After parsing, fields whose supporting user input was blank get `reviewFlagged: true` (`origin:'ai'`) → editor shows "AI suggested — review this" (Epic 04 renders the flag).
- ALL testimonial quote/author fields get `reviewFlagged: true` (samples by definition).
- Fields failing constraints after retry get fallback placeholder text with `origin:'placeholder'`, `reviewFlagged: true`. Generation NEVER fails because one field misbehaved.

### Job lifecycle & concurrency

- Site-level single-flight: if `generation.status === 'queued'|'running'`, new generate calls → `409`.
- Status transitions: `idle|failed|complete --POST--> queued --> running --> complete | failed`.
- On `failed`: nothing about businessInfo/template/languages/content changes (inputs preserved); error stored as machine code (`timeout`, `provider_error`, `bad_response`) — never raw provider text.
- Timing targets: <20s single language, <35s both. Per-locale soft budget 45s then abort → mark failed.
- Success side-effects: write `content[locale]` records, set `currentStep='editing'`, ensure `brandColor` non-empty, stamp `generation.finishedAt`.

### Execution pattern (MVP-appropriate)

Generation runs detached inside the route handler process (`void run()` after responding `202`). Acceptable for MVP deployment (single long-running Node server); documented limitation: serverless platforms may kill it — status endpoint lets the UI detect a stuck `running` (>90s → treat as failed client-side).
