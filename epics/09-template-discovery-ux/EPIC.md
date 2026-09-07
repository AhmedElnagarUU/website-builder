# Epic 09 — Template Discovery & Selection UX

## Purpose (one line)
Make choosing a template delightful and unambiguous: a browsable dashboard gallery of every template with real visual previews, a redesigned editor template picker in the project's visual style that shows the actual template when selecting, and a clearer image-upload popup.

## Why this epic matters
The template picker is currently a plain list of names — users cannot see what they're choosing, and "change template" feels confusing. A visual, styled gallery/preview is the difference between "the template selection looks like an afterthought" and "looks like a polished product." It directly supports the owner seeing and choosing a template variant with confidence.

## Scope boundaries
**In:**
- A dashboard page/gallery that lists ALL template variants with rendered **live previews** and metadata (name, category, style), letting the owner browse before choosing/creating.
- Redesign `ChangeTemplateControl` (the editor "change template" picker) to the project (monomastic) style, showing an actual rendered preview of each template on selection and confirming before applying.
- Redesign the image-upload popup (`ImageSlotEditor`) for clearer UX and better error surfaces (including surfacing S3/bucket upload failures gracefully).
- All new UI bilingual EN + AR, RTL-correct, using the monomastic design tokens.

**Out (handled elsewhere):**
- Multi-page template model, real default images, and design polish → Epic 08.
- S3 backend upload defect — deferred (this epic improves the popup *UX/error display* only, not the S3 plumbing).
- Analytics → Epic 10.

## Milestones (in order)
1. **01-dashboard-template-gallery** — a "Templates" view on the dashboard showing every template with previews and metadata.
2. **02-editor-template-picker-redesign** — redesign the change/choose-template control with visual previews in monomastic style.
3. **03-image-upload-popup-redesign** — clearer upload popup with staged preview and better errors.

## Cross-epic dependencies
- Depends on Epic 08 (multi-page + real images + design), so previews show the enhanced templates.
- Depends on Epic 07 (opaque bg, mobile previews) so preview thumbnails look right.
- Feeds into Epic 10 only in that a nicer gallery may later link to analytics — not required now.
