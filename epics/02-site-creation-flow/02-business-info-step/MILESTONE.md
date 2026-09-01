# Milestone 02 — Business Information Step (Step 1 of the journey)

## Goal

Collect the facts the AI will write from — with minimum friction: only two required fields, everything autosaved, questions phrased as plain business questions (never design questions).

## Tasks (execution order)

1. `01-business-info-api.md` — validated PATCH endpoint + advance-step semantics.
2. `02-business-info-form.md` — the grouped, autosaving form screen.

## Shared context

### Field list & requirements (binding for both tasks)

Grouped exactly like this on screen:

**About your business**
- Business name * (required)
- Business category * (required — searchable select, NOT free text)
- What does your business do? (textarea, optional)

**Who you serve**
- Who are your customers? (optional)
- What services or products do you offer? (optional)

**How can customers reach you?**
- Location (optional)
- Phone (optional)
- Email (optional)

**Anything else? (optional)**
- What makes you different? (list of short lines = `usps`)
- Anything else you want us to know? (= `notes`)

### Categories (fixed list; searchable select filters these five)

| id | en label | ar label |
|---|---|---|
| `services` | `Services` | `خدمات` |
| `restaurant` | `Restaurant & Food` | `مطاعم وطعام` |
| `retail` | `Retail & Products` | `تجارة ومنتجات` |
| `professional` | `Professional & Personal Brand` | `مهنيون وعلامة شخصية` |
| `portfolio` | `Portfolio & Creative Work` | `أعمال ومشاريع إبداعية` |

### Flow decisions

- "Create website" (dashboard, Epic 06) calls `POST /api/sites` then routes to `/{locale}/create/business-info?site={id}`. Until Epic 06 exists, entry is manual URL.
- The form autosaves continuously; clicking **Continue** sends `advance:true` which flips `currentStep` to `'templates'`, then routes to `/create/templates?site={id}`.
- Continue stays disabled until name non-empty AND category selected (the only validations).
