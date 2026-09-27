# Product Requirements Document
## AI-Powered One-Minute Website Builder
*MVP Definition — v1.0*

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision](#3-product-vision)
4. [Goals](#4-goals)
5. [Non-Goals](#5-non-goals)
6. [Target Users](#6-target-users)
7. [Core User Journey](#7-core-user-journey)
8. [Functional Requirements](#8-functional-requirements)
9. [Screen-by-Screen Requirements](#9-screen-by-screen-requirements)
10. [AI Requirements](#10-ai-requirements)
11. [Template Requirements](#11-template-requirements)
12. [Editing Requirements](#12-editing-requirements)
13. [Language Requirements](#13-language-requirements)
14. [Image Requirements](#14-image-requirements)
15. [Publishing Requirements](#15-publishing-requirements)
16. [Dashboard Requirements](#16-dashboard-requirements)
17. [Edge Cases & Error Handling](#17-edge-cases--error-handling)
18. [MVP Scope](#18-mvp-scope)
19. [Acceptance Criteria](#19-acceptance-criteria)
20. [Product Rules / Invariants](#20-product-rules--invariants)

---

## 1. Product Overview

This product is an AI-powered website creation tool that lets a non-technical business owner go from "I need a website" to a live, professional website by answering a short set of business questions — not by designing a page. The user selects a ready-made template, describes their business in plain language, optionally uploads images, and the system generates complete website copy and assembles it into a finished site. The user reviews, makes light edits, chooses a language configuration, and publishes.

The product is deliberately not a page builder. There is no canvas, no drag-and-drop, no section library, and no layout engine exposed to the user. Every template has a fixed, professionally designed structure; the product's job is to fill that structure with the right content, in the right language, as fast as possible.

The product solves a content and decision-making problem, not a tooling problem. Existing website builders (Wix, Squarespace, Elementor) already solve "how do I place elements on a page" — and in doing so create a different problem: too many decisions for a user who does not know what a good website looks like. This product removes those decisions entirely.

## 2. Problem Statement

Non-technical business owners need a professional web presence but face three compounding barriers with existing tools:

- **Design paralysis** — traditional builders expose hundreds of layout, spacing, and typography controls that a non-designer cannot use confidently, leading to abandoned or unfinished sites.
- **Content paralysis** — even once a layout exists, the user must write headlines, service descriptions, and about-us copy from scratch, which is often the actual blocker.
- **Time-to-value** — the gap between "I decided I need a website" and "my website is live" is typically hours to days, during which motivation and momentum are lost.

None of this is solved by adding more AI features to a traditional builder — an AI copywriting panel bolted onto a drag-and-drop canvas still leaves the user with a canvas. The problem requires removing the canvas, not augmenting it.

## 3. Product Vision

> "A user should be able to create and publish a professional business website in approximately one minute, without learning web design, without drag-and-drop editing, and without making complex design decisions."

The product succeeds when a user feels the website was created for them, based on what they told the product about their business — not when the user feels they successfully operated a design tool.

**Vision pillars**

- Templates, not canvases — every visual decision is pre-made by the template.
- AI does the writing — the user provides facts, the product provides prose.
- Business language, not design language — no "components," "breakpoints," or "grids" in the UI.
- Language is a user choice — English, Arabic, or both, decided by the user, not the product.
- Speed is a feature — every screen is evaluated against "does this add friction to getting to a published site."

## 4. Goals

Measurable product goals for the MVP:

- A new user with no design or technical background can produce a complete, published, professional-looking website without writing any original website copy themselves.
- Median time from starting business-info input to reaching a previewable, fully-populated website is under 3 minutes for a single-language site (the "approximately one minute" vision describes the core generation step; see Section 7 for the full, honest timing breakdown).
- At least 90% of AI-generated sections require no manual rewrite before a user is willing to publish (measured by edit-rate on generated fields).
- A user can produce a bilingual (English + Arabic) site without providing separate instructions for each language — one input, two generated outputs.
- Zero instances in the MVP UI of layout/design terminology ("component," "section container," "grid," "breakpoint") being the primary label for a user-facing control.

## 5. Non-Goals

The following are explicitly out of scope for this product, permanently or for the MVP as noted. Several of these are common in traditional website builders; they are excluded on purpose because they conflict with the product vision, not because they were overlooked.

- Drag-and-drop page building, free-form section placement, or arbitrary section creation — permanently out of scope; this is the core product boundary (see Section 20).
- Pixel-level design control, custom typography systems, or a design-token/theme editor — permanently out of scope.
- Multi-page site architecture beyond the template's fixed page(s) in MVP — a template may define more than one page (e.g. Home + Contact), but the user cannot add, remove, or reorder pages.
- Custom domain connection, DNS management, and advanced hosting configuration — out of scope for MVP; sites publish to a system-provided subdomain (see Section 15). Custom domains are V1.1.
- E-commerce / cart / checkout functionality — out of scope; a template may showcase products for informational display only.
- Team collaboration, multi-user editing, or role-based permissions on a single website — out of scope for MVP (single owner per site).
- SEO configuration tooling (meta tag editors, sitemap controls, structured data editors) beyond sensible AI-generated defaults — out of scope for MVP.
- Account/authentication UX design — this PRD assumes a standard account exists (email/password or equivalent) but does not specify its flow; it is not counted in the product's speed goals.
- Analytics dashboards, A/B testing, or form-submission management beyond a basic contact notification — out of scope for MVP.

## 6. Target Users

**Primary user**

A non-technical small-business owner, solo professional, freelancer, or local business operator who needs a credible website presence but has no web design, HTML/CSS, or website-builder experience, and does not want to acquire any.

**Characteristics**

- Knows their business (services, customers, location) far better than they know what "a good website" looks like.
- Measures success as "do I have a working link I can share/put on my business card," not "did I build something impressive."
- Has low tolerance for tools that require a learning curve before producing a result.
- May need the site in Arabic, English, or both, depending on their customer base — language is a business decision for them, not a preference.
- Likely accessing the product on a phone or a basic laptop; not assumed to be comfortable with multi-panel desktop software.

**Explicit non-target users (for MVP)**

- Agencies or freelancers building sites on behalf of many clients with brand-specific design systems.
- Businesses requiring e-commerce, bookings, or complex multi-page architecture.
- Users who specifically want granular design control (these users are better served by traditional builders, and the product should not try to win them).

## 7. Core User Journey

Ideal flow: **Business Information → Template Selection → Language Choice → AI Generation → Preview & Light Edit → Publish.**

> **Assumption/Decision:** Business information is collected before template selection, reversing the order implied by the brief's example flow. Business info is language- and template-agnostic, so collecting it first lets the product recommend templates that fit the business type (Section 11) instead of asking the user to judge design fit themselves — which would reintroduce a design decision the product is meant to remove.

| Step | What the user does / sees | What the system does |
|---|---|---|
| **1. Business Information** | User answers a short guided form: business name, business type/category, what the business does (free text), target customers, services/products offered, location, contact information, and optional unique selling points / additional notes. | System uses category to pre-filter the template gallery in the next step. Nothing is generated yet. |
| **2. Template Selection** | User is shown 3–6 templates pre-filtered by business category, each with a static preview image and a one-line description. User can browse all templates if none of the suggested ones fit. | Selecting a template locks in its fixed structure; business info collected in Step 1 is not lost or re-asked. |
| **3. Language Choice** | User picks English only, Arabic only, or English + Arabic. | This determines how many content variants AI will generate in Step 4. Default selection is pre-set based on the business location provided in Step 1 (see Section 13) but is always user-changeable. |
| **4. AI Generation** | A single progress screen ("Writing your website…") with no further input required. | System generates content for every text field defined by the chosen template, in every chosen language, from the Step 1 answers. Typical generation time: under 20 seconds for one language, under 35 seconds for both. |
| **5. Preview & Light Edit** | User sees the fully assembled website in a real preview (not a mockup) and can tap any text block to edit it, replace any image, or adjust the brand color. | Changes save automatically. If bilingual, a language switcher lets the user preview/edit each version independently. |
| **6. Publish** | One "Publish" action. | Site becomes live at a system-provided URL; user is shown the link and basic share options. |

**Honest timing note**

The "approximately one minute" vision is best understood as the AI generation step (Step 4) plus a fast, low-friction path through Steps 1–3 — not literally the full journey including human review in Step 5. Step 1 alone (a real person typing real business information) reasonably takes 1–3 minutes. The product goal is that no step other than Step 1 requires meaningful time or thought, and Step 5 is reviewing, not building.

## 8. Functional Requirements

**8.1 Business Information Intake**

- The system must collect: business name, business category, description of what the business does, target customers, services/products, location, contact information (at minimum phone or email), and optionally: unique selling points, additional free-text notes.
- Only business name and business category are required to proceed; all other fields may be left blank (see Section 10 for how AI handles missing fields).
- The system must allow the user to return to and edit business information after generation without discarding already-generated content (see Section 17, edge cases).

**8.2 Template Selection**

- The system must present a curated, category-matched subset of templates by default, with an option to view the full template library.
- Each template must show a static preview representative of its real generated appearance (not generic placeholder Lorem Ipsum in the thumbnail).
- The system must support changing templates after generation, subject to the content-preservation rules in Section 11.

**8.3 Language Configuration**

- The system must let the user choose English only, Arabic only, or both, at site-creation time and change it later.
- The system must never generate a second language the user did not request.
- The system must generate localized (not literally translated) content for Arabic when cultural/business norms differ (see Section 13).

**8.4 AI Content Generation**

- The system must generate content for every text field defined by the selected template, using only the business information provided plus general knowledge of the stated business category.
- The system must support regenerating a single field or single section without affecting other sections' content.
- The system must support a full-website regeneration that reuses the same business information.

**8.5 Editing**

- The system must allow inline text editing of any AI-generated field, image replacement for any image slot defined by the template, and selection of a brand/accent color from a constrained palette or a color picker limited to safe combinations (see Section 12).
- The system must not allow moving, deleting, duplicating, or adding template sections.

**8.6 Publishing**

- The system must publish the site to a unique, system-generated URL on request.
- The system must allow republishing after edits, and allow unpublishing without deleting the underlying site.

**8.7 Dashboard**

- The system must let a user see all their websites, each site's status (draft/published), open the editor, publish/unpublish, and delete a site.

## 9. Screen-by-Screen Requirements

### 9.1 Business Information Screen

| Aspect | Definition |
|---|---|
| Purpose | Collect the facts AI needs to write the site; the only screen requiring real user effort. |
| User sees | A short, single-column guided form grouped into: About your business, Who you serve, How to reach you — not a long undifferentiated form. |
| User actions | Type free-text and short-field answers; optionally skip non-required fields; proceed to template selection. |
| System behavior | Auto-saves as the user types; pre-fills business category options via a searchable list rather than free text, to keep category matching reliable for Section 11. |
| Validation | Business name and category are required to proceed; all other fields are optional. |
| Empty states | N/A (first screen). |
| Error states | Inline validation only for the two required fields; no blocking errors for optional fields. |
| Success states | "Continue" becomes active once required fields are filled. |
| Navigation | Forward to Template Selection. No backward navigation needed (nothing precedes it). |
| Important UX rules | No design or layout questions appear on this screen. Every question is phrased as a normal business question (see Section 13's example: "Main button" not "CTA component"). |

### 9.2 Template Selection Screen

| Aspect | Definition |
|---|---|
| Purpose | Let the user pick the visual identity and structure for their site without evaluating design tradeoffs. |
| User sees | A grid of template preview cards, category-matched templates shown first, each labeled with a plain name (e.g. "Classic Services") and one description line. |
| User actions | Tap a template to select it; optionally tap "See all templates" to browse beyond the matched set. |
| System behavior | Ranks templates by fit to the business category entered in Step 1; if no strong match exists, shows a general-purpose default set with no error shown to the user. |
| Validation | Exactly one template must be selected to proceed. |
| Empty states | N/A — the system always has a default set to show. |
| Error states | If template previews fail to load, show a text-only fallback list rather than blocking selection. |
| Success states | Selected template is visually marked; "Continue" activates. |
| Navigation | Back to Business Information (non-destructive); forward to Language Choice. |
| Important UX rules | Never describe templates using layout terminology ("3-column grid"); describe them by business fit ("Good for service businesses with a booking focus"). |

### 9.3 Language Choice Screen

| Aspect | Definition |
|---|---|
| Purpose | Let the user decide which language version(s) of the site to generate. |
| User sees | Three clearly equal options: English only, Arabic only, English + Arabic, with a one-line explanation of what "both" means (a language switcher on the live site). |
| User actions | Select one option. |
| System behavior | Pre-selects a default based on the location provided in Step 1 (see Section 13) but never auto-advances without explicit user confirmation. |
| Validation | One option must be selected. |
| Empty states | N/A. |
| Error states | None expected; this is a single choice with no failure mode. |
| Success states | Selection is confirmed and visually marked. |
| Navigation | Back to Template Selection; forward to AI Generation. |
| Important UX rules | All three options are presented as equally valid; none is visually implied as the 'real' or default path. |

### 9.4 AI Generation Screen

| Aspect | Definition |
|---|---|
| Purpose | Show visible progress while the system writes the website; prevent the user from feeling stuck. |
| User sees | A single progress indicator with rotating status messages (e.g. "Writing your homepage…", "Adding your services…"). |
| User actions | None required; user waits. |
| System behavior | Generates all required fields for the selected template and language(s); on completion, auto-advances to Preview. |
| Validation | N/A. |
| Empty states | N/A. |
| Error states | If generation fails or times out, show a retry action and preserve all Step 1–3 inputs (see Section 17). |
| Success states | Auto-transition to Preview & Edit once content is ready. |
| Navigation | No manual navigation; system-driven. |
| Important UX rules | No technical error detail (e.g. API errors) is ever shown to the user. |

### 9.5 Preview & Edit Screen

| Aspect | Definition |
|---|---|
| Purpose | Let the user see the real, finished-looking website and make light adjustments before publishing. |
| User sees | A rendered, real preview of the website (desktop and mobile view toggle), with tappable text and image areas. |
| User actions | Tap text to edit inline; tap an image to replace it; open a small color control to change brand/accent color; switch language tab if bilingual; regenerate a specific section; publish. |
| System behavior | Saves edits automatically and continuously; keeps each language's content independently editable; re-renders preview immediately on any change. |
| Validation | Required business-critical fields (e.g. contact info) are flagged if left empty, but do not block publishing. |
| Empty states | Any field the user leaves blank (with no AI-generated fallback available) shows a clearly-marked placeholder, not blank/broken layout. |
| Error states | If an image upload or a regeneration request fails, the previous content remains in place and an inline retry is offered. |
| Success states | A visible "Saved" indicator confirms edits are persisted before the user leaves the screen. |
| Navigation | Back to Language Choice is allowed but flagged if it would remove already-generated content (see Section 17); forward action is Publish. |
| Important UX rules | The editor never exposes structural controls (no move/delete/add-section options anywhere on this screen). |

### 9.6 Publish Screen / Action

| Aspect | Definition |
|---|---|
| Purpose | Make the website live and give the user something to share. |
| User sees | A confirmation of the site's URL and simple share actions (copy link) once published. |
| User actions | Confirm publish; copy/share the link; return to dashboard. |
| System behavior | Generates the live version of the site at a stable URL; subsequent edits require an explicit "Update live site" action rather than publishing instantly (see Section 15). |
| Validation | None beyond what Preview already enforces. |
| Empty states | N/A. |
| Error states | If publishing fails, the site remains in its last-known state (draft or previously-published) and the user is told to retry. |
| Success states | Clear "Your website is live" confirmation with the URL. |
| Navigation | Forward to Dashboard. |
| Important UX rules | Publishing must never silently fail; the user always ends the action knowing whether the site is live. |

### 9.7 Dashboard Screen

| Aspect | Definition |
|---|---|
| Purpose | Give the user a single place to manage all their websites. |
| User sees | A list/grid of the user's websites, each with a thumbnail, name, status (Draft / Published), and last-updated time. |
| User actions | Create a new website; open a website to edit; publish/unpublish; delete a website. |
| System behavior | Reflects real-time status of each site; deletion requires explicit confirmation. |
| Validation | N/A. |
| Empty states | First-time users see a single prominent "Create your website" action and no list. |
| Error states | If a site fails to load its status, show it as "Status unavailable" rather than guessing. |
| Success states | Actions (publish/unpublish/delete) show immediate confirmation. |
| Navigation | Entry point to the whole product; links out to the editor for each site. |
| Important UX rules | No design/build actions live on the dashboard itself — it is a management screen, not an editing surface. |

## 10. AI Requirements

**10.1 Inputs AI receives**

- All fields from Business Information (Section 8.1), whatever the user filled in.
- The selected template's field list (which sections/fields exist and their purpose, e.g. "short hero headline, max 8 words").
- The selected language(s).
- For section-level regeneration: the content already generated/confirmed for other sections, so tone and facts stay consistent across the site (see 10.5).

**10.2 What AI generates vs. what is fixed**

- AI generates: headlines, descriptions, about-us copy, service/product descriptions, feature/benefit lists, testimonial placeholders (clearly marked as sample content, never fabricated as real customer quotes), FAQ content, contact-section copy, and footer text.
- AI never generates or alters: contact details, business name, or any factual field the user explicitly typed — these are inserted verbatim, not rewritten.

**10.3 Editability**

Every AI-generated text field is user-editable in Preview & Edit (Section 9.5). There is no AI-generated content that is locked from editing.

**10.4 Missing information**

- If a non-required field is left blank, AI generates plausible, generic-but-relevant content appropriate to the stated business category, and the field is visually marked as "AI suggested — review this" in Preview so the user knows to check it.
- AI must not invent specific, checkable facts (e.g. years in business, exact pricing, awards, certifications) when the user did not provide them; generic qualitative language (e.g. "experienced local team") is used instead of fabricated specifics.
- If business name or category (the two required fields) are missing, generation cannot start — this is prevented at the Business Information screen, not handled downstream.

**10.5 Regeneration**

- Full-site regeneration re-runs generation for every field using the same business information, and asks for confirmation before discarding manually edited content.
- Section-level regeneration replaces only the targeted section's fields; it must reuse the business information and the currently confirmed content of other sections as context, to avoid contradicting facts or shifting tone.
- Manually edited fields are never silently overwritten by a later full or section regeneration without explicit user confirmation.

**10.6 English and Arabic generation**

- For a bilingual site, AI generates each language as its own localized version from the same business information — not a literal translation of the English output (see Section 13.4).
- Editing one language's content never changes the other language's content.

**10.7 Content/template mismatch handling**

- If generated content does not fit a field's constraints (e.g. a headline exceeds the template's word limit for that slot), the system must automatically request a shorter regeneration for that field before showing it to the user — the user should never see visibly broken/overflowing text in Preview.
- If AI cannot produce suitable content for a field after retries, the field falls back to a clearly-marked, easily-editable generic placeholder rather than blocking the rest of generation.

## 11. Template Requirements

**11.1 What a template defines**

- A fixed visual identity (typography choices, spacing, imagery style) not exposed as user-editable settings.
- A fixed page structure and section order (e.g. Header, Hero, Services, About, Benefits, Testimonials, CTA, Contact, Footer).
- A fixed list of content fields per section, each with a defined purpose and constraint (e.g. "Hero headline, one short sentence").
- A defined, limited set of customization points: which colors are adjustable, which images are replaceable, and nothing else.
- A pre-built RTL (right-to-left) layout variant for Arabic (see 11.5) — not a generic mirrored/flipped rendering of the LTR layout.

**11.2 Template selection and categories**

- Templates are grouped by business category (e.g. Services, Restaurant/Food, Retail/Product, Professional/Personal Brand, Portfolio).
- Category match is based on the business category field from Business Information; the match narrows the shown set but never fully hides other templates.

**11.3 Template preview**

Previews must reflect realistic generated content for that template's category, not generic Lorem Ipsum, so the user is choosing based on how their type of business will actually look.

**11.4 Changing templates after content exists**

> **Assumption/Decision:** Business content is modeled as semantic fields (e.g. "business_name," "service_1_title," "about_body") independent of any single template's layout, not as slots owned by a specific template. This is what makes template switching possible without full data loss, and should be treated as a data-model requirement, not just a UI behavior.

- When a user switches templates after content exists, any field that exists in both templates keeps its content.
- Any field required by the new template that has no equivalent in the old one is generated fresh (not left blank) using the original business information.
- Any content tied only to a field the new template does not have is retained in the background (not deleted) in case the user switches back, but is not shown or used.
- The user is shown a brief, plain-language notice before confirming a template switch ("Some content will be rewritten to fit the new design"), not a technical diff.

**11.5 RTL handling at the template level**

- Every template offered for Arabic must have a designed RTL variant: mirrored navigation and layout direction, right-aligned text flow, and any directional iconography (arrows, forward/back cues) flipped appropriately.
- RTL is not implemented as a generic automatic mirror of the English layout; it is validated per template as part of that template being enabled for Arabic. A template not yet validated for RTL is not offered when Arabic is selected.

## 12. Editing Requirements

**12.1 Content customization (freely editable)**

- Text in any generated field
- Images in any defined image slot, including logo and hero image
- Business/contact information shown on the site
- Which services/products/testimonials appear, within the template's fixed count of slots

**12.2 Controlled visual customization (limited options)**

- Brand/accent color, chosen from either a curated palette or a color picker constrained to combinations that meet contrast/readability requirements against the template's fixed layout.
- Logo and hero image replacement (content customization, listed here because of its strong visual impact).

**12.3 Template structure (not editable by the user)**

- Section order and presence
- Number of sections
- Layout/grid behavior, spacing, typography system
- Responsive behavior

**12.4 Saving and leaving**

- All edits save automatically; there is no explicit "save" action required from the user.
- If a user leaves the editor mid-session, all saved edits persist and the site remains in its last edited (unpublished, if not yet published) state on return.

## 13. Language Requirements

**13.1 Selection**

Language is chosen explicitly by the user at site creation (Screen 9.3: English only / Arabic only / English + Arabic) and can be changed later from site settings. The system pre-selects a suggested default based on the business location provided in Step 1, but the user must confirm — the system never assumes.

**13.2 Switching between languages (bilingual sites)**

- On the live published site, visitors switch language via a visible toggle in the site header; both languages live at one URL (e.g. a language segment or query parameter), not on separate published sites.
- In the editor, the content owner switches between an "Editing: English" and "Editing: Arabic" view via a clearly labeled tab; the currently edited language is always visible on screen.

**13.3 AI generation per language**

Covered in Section 10.6: each language is generated as its own localized version from the shared business information, not translated from the other language.

**13.4 Avoiding translation-only Arabic content**

- Where cultural or business norms differ (e.g. typical customer greetings, date/number formatting conventions, locally relevant service framing), AI generates Arabic content appropriate to an Arabic-speaking audience rather than a literal rendering of the English text.
- Facts (business name, services, contact info) remain identical across languages; only phrasing, tone, and framing are localized.

**13.5 Independent editing per language**

Editing content in one language never modifies or regenerates content in the other language. Each language's fields are stored and edited independently once generated.

**13.6 RTL at the product level**

Arabic content is presented right-to-left across the entire site experience for that language, per the template-level requirement in Section 11.5. This includes navigation order, text alignment, and directional icons — not text direction alone.

**13.7 Navigation and content behavior across languages**

- Navigation menu items are generated/localized per language, not just the body copy.
- If a template has more than one page, page structure (which pages exist) is identical across languages — only content and direction differ.

## 14. Image Requirements

**14.1 Upload**

- The user can upload images for each image slot the template defines (typically: logo, hero image, and a small number of gallery/service images).
- Supported formats: JPG, PNG, WebP. Unsupported formats are rejected with a plain-language message naming a supported format, not a technical error.

**14.2 Replacement**

Any previously uploaded or AI/template-default image can be replaced at any time from the same tap-to-edit interaction used for text (Section 9.5); replacement is immediate in preview.

**14.3 Validation and quality**

- Images below a minimum resolution threshold for their slot are accepted but flagged with a plain-language warning ("This image may look blurry when enlarged") rather than rejected — the user's own photo is respected as their choice.
- Images are automatically cropped/fitted to the slot's required aspect ratio; the user is shown the crop and can reposition it, but cannot resize the slot itself.

**14.4 No image provided**

If a slot is left empty, the template's professionally-designed default/placeholder image for that category is used, so the site never ships with a visibly broken or empty image area.

## 15. Publishing Requirements

**15.1 Generation vs. publishing**

Website generation (AI writing the content) and publishing (making the site publicly reachable) are separate steps. A generated site is immediately previewable but not publicly reachable until the user explicitly publishes it.

**15.2 Publish action**

- Publishing is a single explicit action from Preview & Edit or the Dashboard.
- On first publish, the system assigns a stable, unique URL on a system-provided subdomain (e.g. businessname.platform.app). Custom domain connection is V1.1 (Section 18).

**15.3 Updating a published site**

- After first publish, further edits are saved as draft changes and require an explicit "Update live site" action to go live — edits do not silently push to the public site.
- The user is always able to see whether the live site matches their latest edits (a simple "You have unpublished changes" indicator).

**15.4 Unpublishing**

Unpublishing takes the site offline (URL returns a not-found/parked state) without deleting the site's content; it can be republished at any time.

**15.5 Publishing failure**

If publishing fails, the site remains in its last successful state (either still live on the previous version, or still unpublished) and the user is told to retry; the system never leaves a site in a partially-published state.

## 16. Dashboard Requirements

The dashboard is a management surface only; it contains no editing or design controls.

**Minimum dashboard capabilities**

- View all of the user's websites with status (Draft / Published), a thumbnail, and last-updated time.
- Start creating a new website (entry point to the Core User Journey, Section 7).
- Open a website into Preview & Edit.
- Publish / unpublish a website.
- View and change a website's language configuration (redirects into the appropriate part of the editor rather than duplicating that logic on the dashboard).
- Access basic website settings (site name/URL slug, contact info shown on the public site).
- Delete a website, with explicit confirmation.

## 17. Edge Cases & Error Handling

| Edge case | Expected product behavior |
|---|---|
| User provides insufficient business information | Generation proceeds using only business name and category (the two required fields); all other fields get plausible generic content, clearly flagged for review in Preview (Section 10.4). |
| User uploads no image | Template default/placeholder image for that category is used (Section 14.4); never a broken/empty image area. |
| User uploads a poor-quality (low-resolution) image | Image is accepted with a plain-language quality warning; the user's choice is respected (Section 14.3). |
| User uploads an unsupported file type | Upload is rejected immediately with a message naming supported formats; no partial upload state. |
| AI generates unsuitable content | User can regenerate the specific field/section (Section 10.5) or edit it manually; unsuitable content is never a dead end. |
| AI generates content that does not fit the template (overflow, truncation) | System auto-retries generation against the field's length constraint before showing it to the user (Section 10.7); user never sees broken layout. |
| User changes language configuration after generating the website | Adding a language generates that language fresh from existing business information; removing a language hides but does not delete that language's content, in case it is re-added (mirrors template-switch behavior in Section 11.4). |
| User removes one language from a bilingual site | The site becomes single-language on next publish; the removed language's content is retained in the background, not deleted, and the language toggle disappears from the live site. |
| User adds a second language later | System generates the new language from the same business information and current content of the existing language for tone consistency; existing language is untouched. |
| User changes templates after generating content | Handled per Section 11.4: shared fields persist, new required fields are freshly generated, orphaned content is retained but hidden, user sees a plain-language notice before confirming. |
| User edits AI-generated content manually | Edit is saved as-is and is protected from being silently overwritten by later full/section regeneration (Section 10.5). |
| User regenerates only one section | Only that section's fields change; other sections and their manual edits are untouched (Section 10.5). |
| User abandons website creation halfway through | All progress (business info, template, language, any generated content) is saved automatically; the site appears in the Dashboard as a Draft. |
| User returns to an unfinished website | Returns to exactly where they left off in the flow (e.g. still on Template Selection, or already in Preview & Edit), never forced to restart. |
| Publishing fails | Site remains in its last valid state (live previous version, or unpublished); user is told to retry (Section 15.5). |
| Website generation fails (AI error/timeout) | All Business Information / Template / Language selections are preserved; user is offered a retry from the Generation screen without re-entering any information (Section 9.4). |

## 18. MVP Scope

**18.1 MVP / V1 — required to validate the core proposition**

- Business Information intake (Section 9.1)
- Category-matched Template Selection from an initial library (target: 8–12 templates across 4–5 categories)
- Language choice: English only, Arabic only, English + Arabic, with RTL-validated templates for Arabic
- Full-site AI generation from business information, in the chosen language(s)
- Preview & Edit: inline text edit, image replace, brand color change, per-language editing
- Section-level and full-site regeneration
- Publish / unpublish to a system subdomain, with a separate "update live site" step after first publish
- Dashboard: list sites, status, open/edit, publish/unpublish, delete
- Core edge-case handling from Section 17 (missing info, no image, generation/publish failure, abandon/resume)

**18.2 V1.1 / Near-term**

- Custom domain connection
- Expanded template library and additional business categories
- Basic SEO defaults exposed as simple settings (page title, short description)
- Contact-form submissions surfaced in the Dashboard (beyond a plain email notification)
- Saved/reusable business information for users creating a second site

**18.3 Future**

- Team/collaborator access to a single site
- Additional languages beyond English/Arabic
- Lightweight analytics (visits, contact form conversions)
- E-commerce/product-catalog capability
- Multi-page architecture with user-controlled page addition (would require re-evaluating the core "no structural control" rule and should be scoped carefully if ever pursued)

## 19. Acceptance Criteria

| Requirement area | Acceptance criterion |
|---|---|
| Business info → generation | Given only business name and category are filled in, when the user proceeds through Template and Language selection, then a fully populated website is generated with no blocking errors. |
| Template matching | Given a business category, when the user reaches Template Selection, then at least 3 templates matched to that category are shown before any unrelated templates. |
| Language choice respected | Given the user selects "English only," when generation completes, then no Arabic content or Arabic UI is generated or shown for that site. |
| Bilingual independence | Given a bilingual site, when the user edits a field in the English version, then the corresponding Arabic field is unchanged. |
| RTL correctness | Given a template offered in Arabic, when the site is viewed in Arabic, then navigation order, text alignment, and directional icons are mirrored, not just text direction. |
| Section regeneration isolation | Given a user regenerates the Services section only, when regeneration completes, then all other sections' content (including prior manual edits) is unchanged. |
| No fabricated facts | Given the user left "years in business" and similar factual fields blank, when content is generated, then no specific fabricated number or claim appears in the output. |
| Template switch preserves shared content | Given a site with generated content, when the user switches to a new template that shares fields with the old one (e.g. business name, about text), then that shared content appears unchanged in the new template. |
| No layout overflow | Given any generated text field, when displayed in Preview, then it fits its slot's defined constraints without visual truncation or overflow. |
| Draft persistence | Given a user leaves the flow at any step, when they return, then all previously entered information and generated content is present and they resume at the same step. |
| Publish/live separation | Given a user edits a field after first publish, when they do not tap "Update live site," then the public site continues showing the previously published version. |
| Publish failure safety | Given a publish action fails, when the user checks the site, then it is either fully in its previous live state or fully unpublished — never partially updated. |
| No structural editing surface exists | Given any screen in the editor, when reviewed, then no control exists to add, remove, reorder, or duplicate a template section. |

## 20. Product Rules / Invariants

These rules must never be violated by any future feature addition, regardless of user or business demand. A feature request that requires breaking one of these rules is, by definition, a different product.

- The product is not a drag-and-drop builder, and never will expose a canvas, free section placement, or arbitrary section creation.
- Templates control structure; users control content and a limited set of visual properties only.
- Users choose English, Arabic, or both — the product never forces a language configuration on them.
- AI does the writing; the product never requires a user to produce original website copy from a blank field to complete setup.
- Customization is intentionally limited; every new customization option must be justified against the risk of becoming a design decision the target user cannot confidently make.
- The primary experience optimizes for speed to a finished result over flexibility of the result.
- No screen uses web-design or engineering terminology ("component," "breakpoint," "grid," "design token") as a user-facing label.
- Arabic is never treated as a translation layer over English; it is generated and laid out (RTL) as its own first-class version of the site.
- A user's manually edited content is never silently overwritten by AI regeneration or a template switch without explicit confirmation.
- Publishing and editing are separate actions; a saved edit never becomes publicly visible without an explicit publish/update step.

---

*End of document.*