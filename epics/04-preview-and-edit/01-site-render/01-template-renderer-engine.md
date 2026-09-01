# Task 01 — Template renderer engine

## Context

Generated content is only valuable once assembled into the template's fixed structure. This engine is the single source of visual truth for previews AND published sites (Epic 05), so it must render purely from data with no editor assumptions baked in. Read this milestone's `MILESTONE.md` first — the rendering contract (props, section law, edit-mode context, style tokens) is binding.

## Scope

- `shared/site-render/SiteRenderer.tsx` — maps `template.sections` to section components in order.
- Section components per `SectionType`: `HeaderSection, HeroSection, ServicesSection, AboutSection, TestimonialsSection, CtaSection, ContactSection, FooterSection` under `shared/site-render/sections/`.
- `SiteEditModeContext` + internal tappable text/image wrappers (`F`, `SlotImage`) implementing the contract.
- Style token application (`fontPair/radius/--brand`) scoped by a wrapper div class.
- Testimonial samples render with a subtle "Sample" tag ONLY in editor mode; live mode shows them as normal quotes (they were user-reviewed or accepted).
- Responsive: single fluid layout, mobile-first; desktop preview toggle (Task 02) just constrains width.

## Technical details

Files:

```
src/shared/site-render/SiteRenderer.tsx
src/shared/site-render/context.ts
src/shared/site-render/tokens.ts        // fontPair/radius maps
src/shared/site-render/sections/*.tsx   // 8 components
```

Rules:
- Pure presentational components: no fetching, no router use. Data in via props only.
- Services section renders exactly `svcCount` service_N_title/description pairs from content.
- Hero image slot uses object-fit cover with stored position (default center); logo slot 1:1.
- Buttons/links: CTA button links to `#contact` anchor of same page.
- No hardcoded user-visible strings except via the two placeholder/tag strings below (editor-only).

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `render.empty_field_hint` | `Empty — tap to fill` | `فارغ — اضغط للإضافة` |
| `render.sample_tag` | `Sample` | `نموذج` |
| `render.review_flag` | `AI suggested — review this` | `اقتراح ذكي — راجعه` |

## Dependencies

- `epics/04-preview-and-edit/01-site-render/MILESTONE.md`
- `epics/02-site-creation-flow/03-template-library/MILESTONE.md` (definitions)
- `epics/02-site-creation-flow/01-site-data-model/MILESTONE.md`

## Out of scope

- The editor page/chrome (Task 02), editing logic (Milestone 02), public routes (Epic 05).

## Acceptance criteria

- [ ] Rendering a generated bilingual site twice with locale `en` then `ar` produces identical STRUCTURE (same section order/count) but localized text and mirrored direction (RTL flips alignment and arrows).
- [ ] Changing `brandColor` prop visibly recolors buttons/accent without code changes; text on brand surfaces stays readable (auto black/white).
- [ ] A field manually emptied renders the dashed "Empty — tap to fill" hint inside an edit-mode provider and disappears entirely without it.
- [ ] With no images provided, every slot shows its `defaultAsset`.
- [ ] Renderer contains zero fetch/router calls (code inspection).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; lives in `shared/` because two features consume it; no new dependencies.
