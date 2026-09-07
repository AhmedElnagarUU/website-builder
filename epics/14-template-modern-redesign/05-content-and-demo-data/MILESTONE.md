# Milestone 05 — Content & Demo Data

## Goal
Replace the generic, shared placeholder copy ("Demo Business" / generic services) with believable, per-template bilingual demo content that supports each template's visual design — so the redesigned templates also *read* like real businesses.

## Tasks (execution order)
1. **01-template-copy.md** — Per-template realistic EN + AR demo copy in `demoContent.ts`.

## Shared context (binding for this milestone)
- Content is **data**: `src/features/templates/lib/demoContent.ts` `buildTemplateDemo(template, locale)` returns `{ content, businessInfo }`. Both locales are already populated for all pages; `businessInfo` is localized per call. All section text comes from this file — no message-key changes for section copy (messages are for app chrome only).
- Rules for copy: no "Lorem ipsum", no "Service 1/2", no "Demo Business", no generic filler that could be swapped across any category. Each template gets copy matching its business, audience, category, and design language; Arabic must be a genuine translation/adaptation (not transliteration), RTL-native, aligned with Arabic business-writing conventions.
- Content must stay within the existing field vocabulary: business name, description, location, hero headline/subline, services title + N services (title+description), about title/body, testimonial quotes/authors, CTA headline/button, contact heading/body, footer text, and per-extra-page fields (menu items+prices, gallery title, faq Q/A, hours, pricing plans, team members). Counts come from the template; the existing `pick()` cycling means arrays must be large enough to avoid duplicates for each template's actual count — check per template.
- Each template already has a believable persona direction in the audit report ("why it is different", audience, offer) — implement exactly that; adjust the audit only if copy contradicts a technical constraint (e.g. a count), documenting the change.
- Realistic contact data: use plausible (fictional but realistic-formatted) phone/email/location strings; keep them fictional — never real personal data.
- No new string constants outside `demoContent.ts`; no new image assets.