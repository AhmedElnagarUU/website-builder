# Task Briefs — Sizing Input for Agent

Each task below is self-contained. For each one, the agent should assess scope/complexity and decide the output format itself:
- **Small/contained** → produce one scoped implementation prompt with a clear task name
- **Large/multi-part** → produce a full Epic (broken into milestones and tasks, following the existing repo structure: `EPIC.md` + numbered milestone subfolders, each with `MILESTONE.md` + numbered task files)

---

## Task 1: Template Preview (click to view)

**User story:** As a user, I can click a template and view it, so I can see what a site built from that template will look like before choosing it.

**Goal:** Let the user browse the available templates and open one to preview its full layout/design.

**Context:** Templates are fixed (no drag-and-drop, no free layout). This is a *selection* experience, not an editing one — the user is choosing which fixed template their website will use, not customizing it yet.

**Things the agent needs to decide/plan before implementing:**
- Where does the preview render — a modal, a dedicated route/page, or inline expansion in the template list?
- Does the preview show the template with real business content, placeholder/dummy content, or empty structure?
- Does the preview need to reflect the bilingual (EN/AR) toggle, or is preview always shown in one default language?
- Is this preview read-only, or does it also contain the "select this template" action to proceed?
- Does this depend on the JSON-driven template rendering work in Task 2 below, or can it ship against the current (pre-migration) template components?

**Likely size:** Small — probably a single scoped prompt (template list UI + preview view/modal + navigation), unless it's blocked on Task 2's renderer being ready first. If blocked, flag the dependency rather than duplicating renderer work here.

---

## Task 2: Migrate Template System to JSON-Driven Architecture

**Goal:** Replace hardcoded, component-based templates with a JSON-driven architecture: template structure as JSON, website content as JSON, and a generic renderer + section registry that maps section types to components.

**Context:** See the earlier detailed architecture prompt (JSON template structure / website data / section registry / renderer) already drafted for this — reuse that as the base explanation rather than re-deriving it.

**Things the agent needs to plan in addition to rendering (both currently open):**
- **Rendering:** confirm the section registry + generic renderer approach; define the TypeScript/zod schemas for `Template` and `WebsiteData`; decide how bilingual fields (`{ en, ar }`) flow through to each section component.
- **Saving:** decide where/how `WebsiteData` JSON is persisted per user website (which DB/collection, one document per site vs normalized fields), how template selection is stored (reference to `templateId` vs embedding the full template JSON), how AI-generated content gets written into this structure, and how edits (if any are allowed later) get saved back without breaking the fixed-template constraint.

**Likely size:** Large — touches template schema, all section components, the renderer, and persistence/data model. Should be broken into an Epic with milestones (e.g. schema + types → section registry/renderer → data persistence/save flow → migrate first template as proof of concept → migrate remaining templates), not a single prompt.