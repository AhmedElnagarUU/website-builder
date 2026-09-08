# Task: Reverse Engineer and Document the Project's Template Structure

You are working on an existing Website Builder project.

Your task is to **reverse engineer the existing codebase and document exactly how templates are structured, defined, registered, rendered, routed, and consumed by the application**.

You are NOT being asked to redesign the templates.

You are NOT being asked to improve the templates.

You are NOT being asked to change the engine.

Your only objective in this task is:

> Understand the existing Template System deeply enough that another developer or AI Agent can build a new template that is guaranteed to be compatible with the existing project.

The final output must be a documentation file named:

```text
DOC/TEMPLATE_STRUCTURE.md
```

If the project already has a different documentation convention, follow the existing convention while preserving the required filename/content.

---

# 1. Why This Document Exists

We are going to redesign the visual quality of the project's templates.

The existing templates do not have the visual quality we want, but the underlying template engine and renderer already work.

Before rebuilding the templates, we need to understand the exact structure that the existing system expects.

The purpose of this document is to answer:

> "If I build a completely new template from scratch, exactly what structure must I follow so that the existing Website Builder can render it without requiring changes to the engine?"

The document will later be used as a **technical contract/reference for building new templates**.

---

# 2. Critical Principle

Do not document what you THINK the template system should look like.

Document what the codebase ACTUALLY does.

Your source of truth is the repository.

You must trace the implementation through the code.

For every important behavior, determine:

* Where it is defined.
* What data it expects.
* What shape it expects.
* How it is consumed.
* What assumptions it makes.
* What is mandatory.
* What is optional.
* What happens when something is missing.
* How templates are discovered.
* How templates are selected.
* How templates are rendered.
* How pages are rendered.
* How assets are resolved.
* How navigation works.

Do not infer a contract simply because something "looks logical".

---

# 3. Start With Repository Discovery

Before writing the document, inspect the repository systematically.

First understand:

```text
Project
 ├── Template Definitions
 ├── Template Data
 ├── Template Registry
 ├── Template Components
 ├── Page Definitions
 ├── Renderer
 ├── Routing
 ├── Assets
 ├── Preview
 └── Template Selection UI
```

Locate the actual implementation for each of these areas.

Do not assume their directory names.

Use the repository's real structure.

---

# 4. Trace the Complete Template Lifecycle

You must trace the complete lifecycle of a template.

Document the flow from the moment the application knows that a template exists until the moment the template appears on the screen.

At minimum investigate:

```text
Template Definition
       ↓
Template Registration / Discovery
       ↓
Template Selection
       ↓
Template ID
       ↓
Template Lookup
       ↓
Template/Page Resolution
       ↓
Renderer
       ↓
Component Rendering
       ↓
Assets
       ↓
Final Website
```

If the actual architecture differs, document the actual architecture instead.

The goal is to understand the **real data flow**.

---

# 5. Identify the Template Contract

Determine the exact contract a template must satisfy.

Document:

* Required fields.
* Optional fields.
* Field types.
* IDs.
* Names.
* Slugs.
* Metadata.
* Pages.
* Components.
* Sections.
* Content.
* Assets.
* Navigation.
* Footer.
* Header.
* Theme information.
* Any other required structure.

For example, if the code expects something conceptually like:

```ts
{
  id: string,
  name: string,
  pages: [...],
  theme: {...}
}
```

document the ACTUAL structure from the code.

Do not use this example as a requirement.

Find the real structure.

---

# 6. Identify the Template Entry Point

Find the exact place where a template begins to exist in the system.

Determine whether templates are:

* Imported manually.
* Registered in an array.
* Discovered dynamically.
* Loaded from JSON.
* Loaded from a database.
* Defined as TypeScript objects.
* Defined as React components.
* Defined through a combination of these.

Document the exact mechanism.

Explain:

> "To add a new template, these are the files/definitions the system expects."

---

# 7. Template Registration

Determine exactly how the application knows about available templates.

Document:

* Registry location.
* Registration mechanism.
* Required identifiers.
* Import requirements.
* Naming conventions.
* How the template becomes visible in the template-selection UI.
* What happens if a template is not registered.
* Whether registration is static or dynamic.

Provide a concrete example based on the existing code.

---

# 8. Template Structure

Reverse engineer the internal structure of a template.

Determine whether a template is composed of:

```text
Template
 ├── Pages
 │    ├── Header
 │    ├── Sections
 │    └── Footer
```

or something else.

Document the actual structure.

For every level, explain:

* What it represents.
* Where it is defined.
* Its expected data shape.
* Required properties.
* Optional properties.
* How the renderer consumes it.

---

# 9. Page Structure

Determine exactly how pages are represented.

Document:

* Page ID.
* Page slug/path.
* Page name.
* Page type.
* Sections.
* Layout.
* Content.
* Metadata.
* Header.
* Footer.
* Navigation.
* Any other page-level properties.

Determine whether every page must contain:

* Header.
* Main content.
* Footer.

Or whether these are injected automatically by the renderer.

This distinction is extremely important.

Do not assume.

Trace the code.

---

# 10. Sections

Determine exactly how sections are represented.

For each section, investigate:

* Section ID.
* Section type.
* Component type.
* Content.
* Layout.
* Styling.
* Props.
* Children.
* Data.
* Assets.

Determine whether sections are:

* React components.
* JSON objects.
* Configuration objects.
* Hardcoded JSX.
* A mixture.

Explain exactly how the renderer resolves a section into UI.

---

# 11. Components

Identify the components that can be used inside templates.

Determine:

* Which components are template-safe.
* Which components are reusable.
* Which components require specific props.
* Which components are mandatory.
* Which components are optional.
* Which components are used by the existing templates.

Create a useful component reference.

For example:

```text
Component
├── Name
├── Location
├── Purpose
├── Required props
├── Optional props
├── Expected children
└── Template usage
```

Only document components that are actually relevant to template construction.

---

# 12. Header

Reverse engineer how the Header works.

Determine:

* Where it is defined.
* How it is included.
* Whether it is page-specific or template-wide.
* Navigation structure.
* Logo handling.
* CTA handling.
* Mobile behavior.
* Required props/data.
* Styling dependencies.
* Routing behavior.

Most importantly:

> Determine whether a new template should implement its own Header or reuse an existing Header mechanism.

Document the actual answer.

---

# 13. Footer

Perform the same analysis for the Footer.

Determine:

* Where it is defined.
* How it is included.
* Whether it is template-specific.
* Required data.
* Navigation.
* Social links.
* Contact information.
* Copyright.
* Responsive behavior.

Document the actual contract.

---

# 14. Navigation and Routing

This is one of the most important parts of the analysis.

Trace how navigation between template pages works.

Determine:

* How pages are identified.
* How URLs are generated.
* How links are created.
* How the renderer resolves a requested page.
* Whether slugs are required.
* Whether routes are static or dynamic.
* How the homepage is identified.
* How missing pages are handled.

Document the exact requirements a new template must follow for its navigation to work.

---

# 15. Assets

Reverse engineer how template assets work.

Investigate:

* Images.
* SVGs.
* Icons.
* Fonts.
* Background images.
* Static assets.
* Public assets.
* Imported assets.
* Dynamic assets.

Determine:

* Where assets are stored.
* How assets are referenced.
* Whether paths are relative or absolute.
* Whether templates can have their own asset folder.
* How the renderer resolves assets.

Document the recommended/required structure for template assets based on the existing implementation.

---

# 16. Styling and Theme

Determine how template styling works.

Investigate:

* Tailwind classes.
* CSS modules.
* Global CSS.
* CSS variables.
* Theme objects.
* Inline styles.
* Component-level styles.
* Design tokens.
* Fonts.
* Colors.
* Spacing.

Determine whether templates are expected to define their own:

* Colors.
* Typography.
* Spacing.
* Border radius.
* Shadows.
* Theme variables.

Or whether these are controlled globally.

This distinction must be documented.

---

# 17. Responsive Behavior

Determine how the current template system handles responsive design.

Identify:

* Responsive breakpoints.
* Responsive components.
* Mobile navigation.
* Grid behavior.
* Container behavior.
* Image behavior.
* Typography behavior.

The purpose is not to judge whether the current templates are responsive enough.

The purpose is to understand:

> What mechanisms are available to a new template and what does the existing system expect?

---

# 18. Data Flow

Document the important data flow.

For example:

```text
Template ID
    ↓
Template Registry
    ↓
Template Object
    ↓
Page Lookup
    ↓
Page Structure
    ↓
Section Data
    ↓
Component
    ↓
Rendered HTML
```

Use the actual project architecture.

For every transition, explain:

* Input.
* Output.
* Transformation.
* Important assumptions.

---

# 19. Template Example

After reverse engineering the system, create a **canonical template structure example**.

This example should NOT be a visually beautiful template.

It should be a technically correct template skeleton.

For example, conceptually:

```text
Template
├── metadata
├── pages
│   ├── home
│   ├── about
│   ├── services
│   └── contact
├── components
├── assets
└── theme
```

But again:

**Do not use this structure unless the repository actually follows it.**

Build the example based on the actual implementation.

The purpose is to create something that another developer can use as a starting point.

---

# 20. "How to Build a New Template"

The final document must contain a practical section explaining:

> How do I build a completely new template for this project?

This should be an actionable procedure.

For example:

```text
1. Create template directory
2. Create template definition
3. Register template
4. Create required pages
5. Add sections
6. Add required components
7. Add assets
8. Configure navigation
9. Verify rendering
10. Verify all pages
```

But these steps must be based on the actual project.

Include the exact files/directories and relationships where possible.

---

# 21. "How to Replace an Existing Template"

Also document:

> How can we take a template, redesign it completely, and put it back into the project without breaking compatibility?

Explain:

* What must remain unchanged.
* What can be redesigned freely.
* What identifiers must be preserved.
* What contracts must remain intact.
* What files can be replaced.
* What registration must remain.
* What routes must remain.
* What data structures must remain compatible.

This is particularly important because we will use this document to redesign templates visually later.

---

# 22. Immutable vs Flexible Parts

Create a clear distinction between:

## Must Stay Compatible

Things that a new template MUST follow because the engine depends on them.

Examples might include:

* Template ID.
* Page structure.
* Required fields.
* Component contracts.
* Route conventions.
* Registration mechanism.

Only include things confirmed by code.

## Can Be Redesigned

Things that can be changed freely while remaining compatible.

Potential examples:

* Layout.
* Typography.
* Colors.
* Section composition.
* Content.
* Images.
* Card designs.
* Visual hierarchy.

Again, verify this from the implementation.

This section is one of the most important outputs of the document.

---

# 23. Common Mistakes

Based on the codebase, identify mistakes that could cause a newly created template to fail.

Examples could include:

* Missing required fields.
* Invalid IDs.
* Incorrect page slugs.
* Unsupported components.
* Incorrect asset paths.
* Missing registration.
* Invalid section structure.
* Incorrect props.
* Broken navigation.

Do not invent mistakes.

Only document failure cases you can confirm from the code or strongly demonstrate through the implementation.

---

# 24. Validation Checklist

Create a checklist that can be used whenever a new template is created.

For example:

```text
Template Structure
[ ] Template has required metadata
[ ] Template is registered
[ ] Template ID is valid
[ ] Required pages exist
[ ] Page IDs/slugs are valid
[ ] Required components are present
[ ] Sections use supported structures
[ ] Assets resolve correctly
[ ] Navigation works
[ ] Header renders
[ ] Footer renders
[ ] Mobile rendering works
[ ] Template renders without errors
```

Customize this checklist according to the actual project.

---

# 25. Evidence and Confidence

For important architectural conclusions, distinguish between:

### Confirmed

Directly verified from source code.

### Inferred

Strongly suggested by how the code works but not explicitly defined.

### Unknown

Cannot be determined confidently from the current repository.

Do not hide uncertainty.

If something is unclear, document it as an open question instead of inventing an answer.

---

# 26. Source References

Whenever practical, reference the relevant repository files.

For example:

```text
Template Registry:
src/templates/index.ts

Template Renderer:
src/...

Page Resolver:
src/...

Template Components:
src/...
```

The goal is that a developer reading `TEMPLATE_STRUCTURE.md` can quickly navigate back to the source implementation.

Use actual paths from the repository.

---

# 27. Do Not Modify the Project

Unless explicitly required by the project's workflow, this task is documentation-only.

Do NOT:

* Redesign templates.
* Modify the renderer.
* Modify the engine.
* Refactor components.
* Change routing.
* Add new template functionality.
* Fix unrelated bugs.

Your output is the documentation file.

The purpose of this task is to create a reliable understanding of the current system BEFORE template redesign begins.

---

# 28. Final Document Structure

The final `DOC/TEMPLATE_STRUCTURE.md` should be organized approximately as:

```text
# Template Structure

## 1. Purpose

## 2. Template System Overview

## 3. Template Lifecycle

## 4. Template Architecture

## 5. Template Contract

## 6. Template Registration

## 7. Template Definition

## 8. Page Structure

## 9. Section Structure

## 10. Components

## 11. Header

## 12. Footer

## 13. Navigation & Routing

## 14. Assets

## 15. Styling & Theme

## 16. Responsive Behavior

## 17. Data Flow

## 18. Canonical Template Example

## 19. How to Build a New Template

## 20. How to Replace/Redesign an Existing Template

## 21. Immutable vs Flexible Parts

## 22. Common Failure Points

## 23. Validation Checklist

## 24. Known Limitations / Open Questions

## 25. Source Code Reference
```

You may change the structure if the repository investigation reveals a better organization.

---

# 29. Quality Standard

The final document must be useful to someone who has never seen this project before.

A developer should be able to read it and understand:

1. What a template is.
2. Where a template lives.
3. How the application discovers it.
4. How it is registered.
5. What its data structure looks like.
6. How pages are represented.
7. How sections are represented.
8. How components are resolved.
9. How navigation works.
10. How assets work.
11. What the renderer expects.
12. What must remain compatible.
13. What can be redesigned.
14. How to build a new template.
15. How to validate that template.
16. Where to look in the source code when something breaks.

The document should function as a **Template System Specification derived from the existing codebase**.

---

# 30. Final Rule

Do not optimize this task for producing a long document.

Optimize it for producing an **accurate document**.

A 20-page document full of assumptions is worse than a 5-page document that accurately describes the real system.

The most important principle is:

> **The codebase is the source of truth.**

Investigate first.

Trace the actual implementation.

Document what is confirmed.

Clearly mark assumptions.

Then produce:

```text
DOC/TEMPLATE_STRUCTURE.md
```

This document will become the technical foundation for the next phase, where we will redesign the visual quality of each template while preserving compatibility with the existing Template Engine and Renderer.
