# Task: Plan and Implement a New "View Template" Experience

You are working on an existing Website Builder project.

The project contains a collection of website templates that users can browse before choosing one for their website.

Your job is to **analyze the existing project first**, understand how templates currently work, and then create a proper **Epic with milestones and implementation tasks** for redesigning the template preview experience.

Do not blindly implement the feature before understanding the current architecture and existing implementation.

---

## 1. Current Problem

The project currently has a "View Template" feature.

However, the current implementation is not the desired UX.

The existing behavior is approximately:

* The user clicks "View Template".
* A small window/modal-like preview opens inside the current page.
* The template is displayed inside this small preview area.
* The user does not get a realistic experience of browsing the actual website.

This implementation should be considered **obsolete**.

We do NOT want to improve or extend the current modal/small-window implementation.

Instead:

> Remove/replace the current View Template experience and build a proper full website template preview experience.

---

# 2. Desired User Experience

Each template card should have a clear:

**View Template**

button/action.

When the user clicks it:

* The template should open in a **new browser tab**.
* The new tab should behave like a real website preview.
* The user should be able to navigate through the template naturally.
* The user should be able to visit the different pages included in the template.
* Navigation between pages should work.
* Links/navigation elements inside the template should behave as expected for a preview.
* The experience should feel like the user is looking at an actual finished website rather than an image, SVG, modal, or miniature preview.

The purpose is to allow the user to answer:

> "If I choose this template, what will my website actually look and feel like?"

---

# 3. Template Preview Content

The preview must not be empty.

Every template should have predefined/demo content.

For example, depending on the template:

* Homepage
* About page
* Services page
* Contact page
* Other pages supported by the template

The pages should contain realistic placeholder/demo content so the user can experience the template as a complete website.

The demo content should be representative enough to demonstrate:

* Layout
* Typography
* Sections
* Images
* Navigation
* Page structure
* Responsive behavior
* Overall visual identity

The preview is primarily for **visual and UX evaluation**, not for editing.

---

# 4. Important: Do Not Use SVG as the Template Representation

The existing templates are currently represented/displayed using SVG/images or a similar visual representation.

That is not what we want for the new preview experience.

The template preview should represent the actual website structure/UI rather than simply displaying an SVG representation of the template.

The user should be interacting with an actual rendered website preview.

---

# 5. Template Thumbnail / Card Image

There is a separate requirement for how templates appear in the template-selection interface.

We eventually want each template to have a proper screenshot/thumbnail representing what the template looks like.

However, **real screenshots do not need to be created as part of this task.**

Instead, prepare the architecture so screenshots can be added later.

For each template, there should be a clear location/configuration where its preview screenshot can be placed.

For example, conceptually:

```text
public/
  templates/
    <template-id>/
      screenshot.png
```

The exact structure should be determined after inspecting the existing project architecture.

The important requirement is:

> The template card should load its screenshot from a predictable external/static location rather than having the screenshot hardcoded inside the component.

This allows us in the future to:

1. Create a screenshot of a template.
2. Put the screenshot inside the appropriate `public` location.
3. Reference that screenshot from the template configuration.
4. Have the template card automatically display it.

For now, create the infrastructure/placeholders necessary for this.

Do not spend this milestone creating all final screenshots.

---

# 6. Required Engineering Behavior

Before creating the implementation plan, inspect the existing project and determine:

* How templates are currently defined.
* Where template metadata lives.
* How template IDs are represented.
* How template pages are represented.
* How routing currently works.
* How the existing View Template functionality works.
* Where the existing SVG/template representation is generated.
* How the template cards are rendered.
* Whether templates already have reusable page components.
* Whether templates already have demo content.
* Whether the project uses static routes, dynamic routes, or another architecture.
* How assets are currently managed.
* Whether a preview route already exists.

Do not assume the architecture.

Use the existing project architecture whenever possible.

Avoid creating duplicate systems when the project already contains reusable infrastructure.

---

# 7. New Preview Architecture

Design a proper preview architecture around the concept of:

```text
Template Selection
        ↓
View Template
        ↓
New Browser Tab
        ↓
Template Preview Route
        ↓
Real Rendered Website
        ↓
Multiple Pages + Navigation
```

The preview should be isolated from the template-selection UI.

The template-selection page should remain responsible for browsing/selecting templates.

The preview route should be responsible for rendering the selected template as a complete website.

The exact routing architecture should be decided by inspecting the project.

For example, the final architecture may conceptually resemble:

```text
/templates
/templates/<template-id>/preview
/templates/<template-id>/preview/<page>
```

But **do not blindly use this exact structure**.

Choose the routing structure that best fits the existing application.

---

# 8. New Tab Requirement

The View Template action should open the preview in a **new browser tab**.

Do not open the preview inside:

* A modal
* A dialog
* A small embedded window
* A drawer
* An iframe-based miniature preview

The goal is a real browser-level website experience.

The user should be able to switch between the template-selection tab and the template-preview tab.

---

# 9. Responsive Experience

The preview should render the actual website responsively.

The user should be able to resize the browser and see the template respond naturally.

Do not build a fake screenshot-based responsive experience.

The preview should use the actual template UI/components.

---

# 10. Existing View Template Implementation

The existing View Template implementation should be treated as deprecated for this feature.

During implementation:

1. Locate the existing implementation.
2. Understand how it works.
3. Identify components/routes/state that exist only for the old preview.
4. Remove or replace obsolete code where appropriate.
5. Ensure there are no conflicting View Template implementations.
6. Ensure the new implementation becomes the single source of truth.

Do not keep the old modal preview around just in case.

If existing code can be safely reused, reuse it.

If it exists specifically to support the old UX and is no longer needed, remove it.

---

# 11. Screenshot Infrastructure

Create a clean abstraction for template screenshots.

The template data/configuration should ideally contain something conceptually similar to:

```ts
{
  id: "...",
  name: "...",
  screenshot: "..."
}
```

The exact schema must be determined from the existing project.

Avoid hardcoding screenshot paths inside UI components.

The UI should consume the screenshot information from the template definition/configuration.

This will make it easy to add screenshots later without modifying the template-card component.

---

# 12. Epic Requirement

Create an Epic for this feature.

The Epic should clearly communicate that the objective is:

> Replace the existing small/modal View Template experience with a full website preview opened in a new browser tab, allowing users to browse a complete rendered template with demo content and multiple pages, while preparing scalable screenshot infrastructure for template cards.

The Epic should have a clear, sequential structure.

---

# 13. Milestone Planning

You are responsible for deciding how the work should be divided into milestones after inspecting the project.

Do not create arbitrary milestones.

Each milestone should represent a meaningful engineering stage.

A possible conceptual breakdown could include:

### Milestone: Discovery & Architecture

Understand the existing template system, routing, current preview implementation, SVG representation, and asset structure.

### Milestone: Preview Foundation

Create the architecture/routes required to render a template as a real website preview.

### Milestone: Multi-Page Navigation

Make template pages navigable and ensure demo content exists across the supported pages.

### Milestone: Template Selection Integration

Replace the existing View Template behavior with the new new-tab experience.

### Milestone: Screenshot Infrastructure

Prepare the template screenshot/thumbnail architecture without requiring final screenshots yet.

### Milestone: Cleanup & Validation

Remove obsolete preview implementation and validate the complete user journey.

However, these are only examples.

**You must inspect the project and determine the correct milestone structure yourself.**

---

# 14. Task Quality Requirements

Every task created under the Epic should be:

* Specific
* Implementable
* Verifiable
* Small enough to understand
* Clearly related to the Epic
* Ordered according to dependencies

Avoid vague tasks such as:

> "Improve template preview."

Instead create tasks that clearly explain:

* What needs to change.
* Where/what area is affected.
* Why the change is required.
* What behavior is expected.
* How completion can be verified.

---

# 15. Acceptance Criteria

The Epic should ultimately satisfy these outcomes:

### Template Selection

* Every applicable template has a "View Template" action.
* The action is clearly visible and usable.

### Preview Opening

* Clicking "View Template" opens a new browser tab.
* The old modal/small-window preview is no longer used.

### Full Website

* The new tab renders the actual template UI.
* The preview is not merely an SVG/image.
* The user can scroll through the website naturally.

### Pages

* The template contains predefined/demo content.
* Multiple template pages can be accessed.
* Navigation between supported pages works.

### Realistic Experience

* The preview looks and behaves like a real website.
* Layout, typography, sections, navigation, and content are rendered through the actual application/template components.

### Screenshot Infrastructure

* Template cards have a defined screenshot source/location.
* Screenshot paths are configurable through template data/configuration.
* Final screenshots can be added later without rewriting the template-card architecture.

### Cleanup

* The obsolete View Template implementation is removed or fully replaced.
* There is no duplicate/conflicting preview mechanism.
* No unnecessary SVG-based template preview remains where the new preview is intended to replace it.

---

# 16. Important Constraints

Do not:

* Build another modal preview.
* Keep the new preview inside the template-selection page.
* Use an SVG as the primary representation of the website preview.
* Create final template screenshots during this task unless they are required to validate the infrastructure.
* Hardcode screenshot paths inside reusable UI components.
* Introduce a second template system if one already exists.
* Rewrite unrelated parts of the project.
* Change the existing product behavior outside the scope of this Epic.

Prefer:

* Existing architecture
* Existing template components
* Existing routing conventions
* Existing design system
* Existing asset conventions
* Reusable abstractions
* Minimal architectural changes

---

# 17. Agent Responsibilities

You are not being asked to blindly execute the implementation.

Your first responsibility is to **understand the repository**.

Then:

1. Analyze the current implementation.
2. Identify the architectural impact.
3. Determine what needs to be reused.
4. Determine what needs to be removed.
5. Design the target architecture.
6. Create the Epic.
7. Divide it into logical milestones.
8. Create ordered implementation tasks under those milestones.
9. Define acceptance criteria.
10. Identify dependencies and risks.
11. Identify any assumptions that need confirmation.
12. Only then proceed with implementation if the project's workflow requires implementation after planning.

The Epic and milestones should be based on the **actual repository**, not assumptions.

---

# 18. Definition of Done

Consider the Epic complete only when:

* The old View Template UX has been replaced.
* View Template opens the selected template in a new browser tab.
* The preview renders the actual website.
* The template contains realistic demo content.
* Multiple pages can be browsed.
* Navigation works.
* The preview is responsive.
* Template screenshots have a scalable/configurable location.
* The screenshot infrastructure works with future files placed under `public`.
* The implementation follows the existing project architecture.
* Obsolete code has been cleaned up.
* No unnecessary unrelated changes were introduced.

---

## Final Instruction

Treat this as a **product + architecture + implementation-planning task**, not simply a UI task.

Do not decide the solution based only on the visible "View Template" button.

Trace the feature through the entire system:

**Template Data → Template Card → View Template Action → Routing → Preview Rendering → Pages → Navigation → Assets → Screenshot Infrastructure**

Then create the Epic and milestones that properly represent the work required to deliver the feature.
