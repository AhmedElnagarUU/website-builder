# Epic Task: Upgrade the Website Templates to a Modern Professional Standard

You are working on an existing Website Builder project.

The project's **template engine and rendering system are already working correctly**.

The current problem is not the rendering engine.

The problem is the **quality of the templates themselves**.

The existing templates technically work, but visually they look outdated, generic, and too similar to old-style/basic blog websites.

The goal of this Epic is to **redesign and significantly enhance the existing templates so they look like professional, modern, production-quality websites**.

---

# 1. Current State

The current system already has:

* A working template engine.
* A working rendering system.
* Template pages.
* Template structure.
* Template routing/rendering.
* The ability to render the existing templates.

The number of pages and the overall template structure can remain consistent with the current product requirements.

The problem is primarily the **visual design and content composition**.

Currently, the templates tend to:

* Look visually outdated.
* Feel like basic blog websites.
* Have weak visual hierarchy.
* Have overly simple sections.
* Lack professional spacing.
* Lack strong hero sections.
* Lack sophisticated content layouts.
* Have repetitive/simple card layouts.
* Feel like the same website with different text.
* Do not demonstrate the quality that our Website Builder should be capable of producing.

This needs to change.

---

# 2. Epic Objective

Transform the existing templates from:

> "Technically functional template pages"

into:

> "Modern, polished, professional websites that users would realistically want to use."

The templates should feel like they came from a professional web design system or a premium website template marketplace.

The user should be able to open a template preview and immediately think:

> "This looks like a real professional website."

Not:

> "This looks like a generated/basic HTML template."

---

# 3. Important Constraint: Do Not Rebuild the Engine

The template engine and renderer are already working.

Do NOT unnecessarily modify or rewrite:

* The rendering engine.
* The template engine.
* The core rendering architecture.
* Existing page-generation infrastructure.
* Existing routing infrastructure.

The primary objective is to improve the **templates built on top of the existing system**.

Only modify engine/rendering infrastructure if the current architecture genuinely prevents the desired template quality.

If such a limitation is discovered:

1. Document it.
2. Explain why it blocks the design.
3. Make the smallest architectural change necessary.

Avoid architectural rewrites.

---

# 4. Research Before Designing

Before changing the templates, perform design research.

Study modern professional websites and current website-template patterns.

Look at sources such as:

* Webflow templates
* Awwwards
* Framer templates
* Modern SaaS websites
* Modern agency websites
* Modern business websites
* Premium portfolio websites
* Modern startup websites

Do not copy any specific website.

Instead, identify **design patterns** that make modern websites feel professional.

Research areas should include:

* Header/navigation patterns
* Hero composition
* Typography hierarchy
* Section spacing
* Content width
* Grid systems
* Card layouts
* Image usage
* CTA patterns
* Testimonials
* Statistics
* Feature sections
* Services sections
* Portfolio/project sections
* FAQ sections
* Contact sections
* Footer structures
* Responsive behavior
* Visual rhythm
* Color systems
* Border radius
* Shadows
* Subtle gradients
* Decorative elements
* Micro-interactions where supported

The goal is not to make the templates trendy for the sake of being trendy.

The goal is to understand **why modern professional websites look professional** and translate those principles into our template system.

---

# 5. Design Principles

The redesigned templates should follow these principles.

## Visual Hierarchy

Every page should have a clear hierarchy:

1. Primary message
2. Supporting message
3. Primary CTA
4. Supporting content
5. Secondary actions

The user should understand the purpose of a section quickly.

---

## Whitespace

Avoid filling every available space.

Use intentional spacing between:

* Sections
* Headings
* Paragraphs
* Cards
* Images
* Buttons
* Content groups

Whitespace should make the page feel premium rather than empty.

Modern homepage guidance commonly emphasizes generous whitespace, clear CTA hierarchy, readable typography, and responsive behavior.

---

# 6. Section-Based Page Composition

Pages should be composed from meaningful sections.

A useful structural model is:

```text
Page
 ├── Header
 ├── Main
 │    ├── Hero
 │    ├── Content Section
 │    ├── Feature/Service Section
 │    ├── Social Proof
 │    ├── Supporting Content
 │    ├── CTA
 │    └── ...
 └── Footer
```

A section should generally follow a structure similar to:

```text
Section
 └── Container
      └── Content
```

This Section → Container → Content pattern is a common modern web layout foundation because it provides consistent width, alignment, spacing, and responsive behavior.

Do not make every section visually identical.

Sections should have different compositions while still belonging to the same design system.

---

# 7. Every Page Must Feel Like a Real Website Page

Each page should not simply be:

```text
Header
Title
Paragraph
Cards
Footer
```

That creates the feeling of a generated/basic website.

Instead, each page should have a deliberate visual composition.

For example:

### Home

Potential structure:

* Header
* Hero
* Trust/social proof
* Main value proposition
* Services/features
* Featured work
* Benefits/why choose us
* Statistics
* Testimonials
* FAQ
* CTA
* Footer

### About

Potential structure:

* Header
* Intro/hero
* Company story
* Mission/values
* Statistics
* Team
* Timeline/process
* Testimonials
* CTA
* Footer

### Services

Potential structure:

* Header
* Services hero
* Services overview
* Detailed service sections
* Benefits
* Process
* Case studies
* Testimonials
* FAQ
* CTA
* Footer

### Contact

Potential structure:

* Header
* Contact hero
* Contact information
* Contact form
* Location/business information
* FAQ
* Final CTA
* Footer

These are examples, not mandatory structures.

The agent should determine the appropriate composition based on the actual templates and business type.

---

# 8. Consistent Header and Footer

Every page belonging to the same template must feel like part of the same website.

The template should have:

* Consistent header.
* Consistent navigation.
* Consistent logo treatment.
* Consistent CTA.
* Consistent footer.
* Consistent typography.
* Consistent color system.
* Consistent spacing system.
* Consistent component styling.

Header and footer should be treated as reusable design-system components rather than separately designed pieces on every page.

Component-based systems are a common approach for maintaining consistency across headers, footers, cards, buttons, CTAs, and sections.

---

# 9. Content Quality

Do not only improve CSS.

The demo content is part of the design.

The content should look realistic and professional.

Avoid:

* "Lorem ipsum"
* "This is a paragraph"
* "Service 1"
* "Service 2"
* "Lorem text here"
* Repetitive placeholder sentences
* Generic meaningless headings

Instead, create believable demo content appropriate to the template's business category.

For example:

Instead of:

> "We provide high quality services."

Use realistic messaging that communicates:

* What the business does.
* Who it serves.
* Why it is different.
* What action the visitor should take.

The content should support the visual design rather than simply occupy space.

---

# 10. Visual Variety

The templates should not all look like variations of the same page.

However, do not introduce random visual styles.

Each template should have its own **design language**.

A template may be:

* Minimal and elegant.
* Bold and modern.
* Premium/luxury.
* Corporate.
* Creative.
* Editorial.
* Technology/SaaS-oriented.
* Professional services.
* Hospitality-oriented.
* Portfolio-oriented.

The exact styles should be determined based on the templates already present in the repository.

---

# 11. Modern UI Patterns

Where appropriate, consider patterns such as:

* Large editorial typography.
* Split hero layouts.
* Image + text compositions.
* Bento-style content grids.
* Asymmetric layouts.
* Feature grids.
* Number/stat sections.
* Testimonial cards.
* Logo/client strips.
* Project showcases.
* Case-study cards.
* Process timelines.
* Pricing cards where relevant.
* FAQ accordions where supported.
* Strong CTA banners.
* Image overlays.
* Subtle gradients.
* Soft borders.
* Rounded cards.
* Layered backgrounds.
* Visual separators.
* Subtle motion/hover states where the existing system supports them.

Do not add these patterns simply because they are fashionable.

Use them when they improve communication and hierarchy.

---

# 12. Typography

Typography should be treated as a major part of the design.

Define a clear hierarchy for:

* H1
* H2
* H3
* Body
* Small text
* Labels
* Buttons
* Navigation

The typography should create obvious differences between:

* Hero headline
* Section heading
* Supporting text
* Body copy
* Metadata

Avoid making every piece of text the same size and weight.

---

# 13. Responsive Design

The templates must remain professional across:

* Desktop
* Tablet
* Mobile

Do not simply stack everything vertically on mobile.

Think about:

* Navigation behavior
* Hero composition
* Image cropping
* Typography scaling
* Grid transformation
* Card stacking
* Section spacing
* Button sizing
* Content order
* Horizontal overflow
* Readability

Responsive behavior is part of the template design, not a separate afterthought.

---

# 14. Reusability

While redesigning the templates, identify repeated visual patterns.

If the same pattern appears multiple times, consider whether it should become a reusable component.

Potential reusable components include:

* Header
* Footer
* Button
* Section heading
* Feature card
* Service card
* Testimonial card
* Project card
* Stat card
* CTA section
* FAQ item
* Logo strip
* Breadcrumb
* Page hero

Do not create components for every tiny element.

Use componentization where it improves consistency and maintainability.

---

# 15. Preserve Template Engine Compatibility

Every redesigned template must continue to work with the existing template engine.

The Agent must verify that:

* Template registration still works.
* Template IDs remain valid.
* Pages render correctly.
* Existing renderer behavior is preserved.
* Dynamic content can still be inserted.
* Existing template data contracts are respected.
* No hardcoded assumptions break the template system.

The template is being redesigned **inside the existing product**, not as an isolated static website.

---

# 16. Epic Structure

Create an Epic for this work.

The Epic should represent the complete transformation of the existing template library into a modern professional template system.

The Epic should contain logical milestones.

The Agent must inspect the repository before deciding the final milestone structure.

A possible conceptual breakdown is:

### Milestone 1 — Template & Design Audit

Analyze the existing templates and identify:

* Visual problems
* Structural problems
* Missing sections
* Weak components
* Repetition
* Typography problems
* Spacing problems
* Responsive problems
* Content problems

Also perform external design research.

---

### Milestone 2 — Design System Foundation

Establish or improve the visual foundations required by the templates:

* Typography
* Colors
* Spacing
* Containers
* Buttons
* Cards
* Borders
* Radius
* Shadows
* Common components
* Section patterns

Do not create a completely new design system if one already exists.

Enhance the existing one when possible.

---

### Milestone 3 — Homepage Redesign

Transform the homepage into a polished professional landing experience.

Focus on:

* Hero
* Navigation
* Content hierarchy
* Sections
* Social proof
* Services/features
* Projects/content
* CTA
* Footer

---

### Milestone 4 — Internal Page Redesign

Upgrade the remaining pages.

Each page should have its own meaningful composition while remaining visually consistent with the template.

---

### Milestone 5 — Content & Demo Data

Replace weak placeholder content with realistic demo content appropriate to each template.

---

### Milestone 6 — Responsive & Visual Polish

Validate:

* Desktop
* Tablet
* Mobile

Then fix:

* Spacing
* Alignment
* Typography
* Overflow
* Image behavior
* Navigation
* Cards
* CTA
* Section transitions

---

### Milestone 7 — Final Template Quality Review

Compare the finished templates against the original state.

Review:

* Professionalism
* Visual hierarchy
* Consistency
* Content quality
* Responsiveness
* Reusability
* Template-engine compatibility

Again, these milestone names are examples.

**You must inspect the actual project and decide the final milestone structure yourself.**

---

# 17. Do Not Make Every Template Identical

One of the biggest risks is solving the current problem by creating one beautiful design and applying it to every template.

Do NOT do that.

The goal is:

```text
Same Quality
        +
Different Design Languages
        +
Same Technical Engine
```

not:

```text
Same Design
×
Every Template
```

Each template should feel intentionally designed.

---

# 18. Quality Bar

Use the following question throughout the work:

> "If this template were shown to a real customer as a premium website template, would they believe it is professionally designed?"

If the answer is no, continue improving it.

The final template should not feel like:

* A prototype.
* A developer demo.
* A generated HTML page.
* A basic blog.
* A collection of cards.
* A wireframe.
* A placeholder website.

It should feel like:

* A real business website.
* A premium template.
* A professionally designed product.
* A coherent brand experience.

---

# 19. Acceptance Criteria

The Epic is successful when:

### Visual Quality

* Templates look modern and professional.
* The old/basic-blog appearance is eliminated.
* Typography has clear hierarchy.
* Spacing feels intentional.
* Sections have strong composition.
* CTAs are visually clear.
* Pages have strong visual rhythm.

### Page Quality

* Every page has a meaningful layout.
* Every page has the correct header/footer.
* Sections are appropriate for the page's purpose.
* Pages do not feel like duplicated layouts with different text.

### Content

* Demo content is realistic.
* No obvious placeholder text remains.
* Content supports the visual hierarchy.

### Responsive

* Templates work correctly on desktop.
* Templates work correctly on tablet.
* Templates work correctly on mobile.
* No horizontal overflow or broken layouts exists.

### Architecture

* Existing rendering engine continues to work.
* Existing template engine continues to work.
* Existing template data contracts remain compatible.
* Reusable patterns are extracted where appropriate.
* No unnecessary architectural rewrite occurs.

### Overall Experience

A user opening a template preview should perceive it as a **real, polished, production-quality website**, not merely a technical demonstration of the template engine.

---

# 20. Agent Workflow

Follow this workflow:

## Phase 1 — Understand

Inspect the repository.

Understand:

* Template architecture
* Renderer
* Existing components
* Existing pages
* Existing design system
* Existing CSS/Tailwind system
* Existing assets
* Existing template data
* Existing demo content

Do not modify anything yet.

---

## Phase 2 — Research

Research modern website design patterns.

Use reputable design/template sources and inspect real examples.

Extract principles rather than copying designs.

---

## Phase 3 — Audit

Evaluate every existing template.

Identify:

* What is good.
* What is outdated.
* What should be preserved.
* What should be redesigned.
* What should become reusable.
* What is missing.

---

## Phase 4 — Plan

Create the Epic.

Create:

* Milestones
* Tasks
* Dependencies
* Acceptance criteria
* Risks
* Design decisions

---

## Phase 5 — Implement

Implement milestone by milestone.

Do not redesign everything blindly in one massive change.

After each major milestone:

* Run the project.
* Render the affected templates.
* Validate the result.
* Fix regressions.

---

## Phase 6 — Review

Perform a final visual and technical review.

Compare:

**Before → After**

The final result must represent a substantial quality improvement.

---

# Final Instruction

This Epic is fundamentally a **Template Quality & Design Upgrade**, not an engine rewrite.

The existing engine and renderer are valuable infrastructure and should be preserved.

Your job is to take the existing templates and transform them into a **professional template library** through:

**Research → Audit → Design System → Page Composition → Content → Responsive Design → Visual Polish → Validation**

Do not settle for simply making the existing pages "prettier."

Redesign the visual experience intentionally so the templates can serve as convincing examples of what the Website Builder is capable of producing.
