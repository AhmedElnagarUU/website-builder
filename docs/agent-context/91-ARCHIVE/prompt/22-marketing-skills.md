# Task: Create Social Media Marketing Skills

You are an expert AI coding agent responsible for creating a reusable set of skills inside the `skills/` folder.

Your goal is to create skills that enable another AI agent to act as a **social media marketing + visual content designer** for this project.

The resulting skills must allow the agent to create high-quality social media posts where:

1. The agent understands the product/project.
2. The agent understands the target audience and marketing objective.
3. The agent generates the marketing idea and content/copy.
4. The agent understands the visual identity of the existing product.
5. The agent creates the visual design of the post.
6. The visual post is implemented using **HTML and CSS**.
7. The resulting HTML/CSS can be opened in a browser and screenshotted directly for publishing on social media.

---

## Important: Understand the Project First

The social-media agent must NOT start by immediately writing a post.

Before creating anything, it must inspect the project to understand what the product actually is.

### Step 1 — Read the Requirements

Find and read the project's requirements document.

The requirements document is the source of truth for understanding:

* What the product is
* What problem it solves
* Who it is for
* Main features
* Product value proposition
* Important product capabilities
* User workflows
* Positioning
* Any constraints or important business context

Do NOT assume the product based only on filenames or folder names.

Do NOT treat the PRD as the only source of truth if the project uses a different requirements/specification document.

First identify the appropriate requirements document in the repository.

---

## Step 2 — Inspect the Landing Page

After understanding the product from the requirements, inspect the existing landing page and relevant UI files.

The purpose is to understand the product's visual identity.

Look for:

* Colors
* Typography
* Font sizes
* Spacing
* Border radius
* Shadows
* Gradients
* Background treatment
* Buttons
* Cards
* Icons
* Illustrations
* Product screenshots
* Overall visual style
* Brand personality
* Design patterns
* Existing components that can be reused or referenced

The landing page is especially important because the social media design should feel like it belongs to the same product.

Do not create a completely unrelated visual identity.

The social post can be more expressive and marketing-oriented than the landing page, but it should remain visually consistent with the product.

---

# Step 3 — Understand the Marketing Objective

Before designing the post, determine what the post is supposed to accomplish.

Possible objectives include:

* Product awareness
* Feature awareness
* Lead generation
* Conversion
* Product launch
* Announcement
* Educational content
* Problem awareness
* Showing a product capability
* Driving traffic to the landing page
* Building trust
* Demonstrating the product
* Engagement
* Explaining a concept
* Promoting a specific feature

If the user provides a specific objective, follow it.

If the user only provides a general post idea, infer a reasonable marketing objective from the project and the requested idea.

Do not create generic marketing content that could belong to any product.

The post should communicate something specific and valuable about THIS product.

---

# Step 4 — Develop the Post Concept

Before writing HTML/CSS, develop the marketing concept.

The agent should internally determine:

### Hook

What is the first thing the audience should notice?

The hook should be:

* Clear
* Short
* Relevant
* Attention-grabbing
* Easy to understand quickly

### Core Message

What is the single most important idea the audience should remember?

Avoid trying to communicate every product feature in one post.

### Supporting Content

Use only the amount of supporting information necessary to reinforce the core message.

### CTA

When appropriate, include a clear call to action.

Examples:

* Try it
* Learn more
* Start building
* Create your first page
* Explore the product
* Join the waitlist

Do not add a CTA just because every post supposedly needs one. The CTA should fit the objective.

---

# Step 5 — Create the Social Media Copy

Generate the actual copy that will appear inside the visual post.

The copy should be designed for visual consumption rather than written like a blog article.

Prefer:

* Short headlines
* Short supporting statements
* Strong hierarchy
* Minimal text
* Scannable information
* One clear message

Avoid:

* Long paragraphs
* Excessive text
* Generic motivational language
* Buzzword-heavy copy
* Unsubstantiated claims
* Fake statistics
* Fake testimonials
* Claims that are not supported by the project

The agent must never invent product capabilities.

Everything presented as a product capability must be supported by the requirements or actual implementation.

---

# Step 6 — Design the Visual Post

The agent must then translate the marketing concept into a professional visual design.

The design should be treated as a real social-media creative, not simply an HTML page.

Think like:

* A senior graphic designer
* A social media designer
* A product designer
* A marketing strategist

The design should have a strong visual hierarchy.

The viewer should understand the post in approximately 1–3 seconds.

Prioritize:

1. Hook
2. Visual focal point
3. Core message
4. Supporting information
5. Brand/product recognition
6. CTA when appropriate

---

# Step 7 — Implement the Design Using HTML and CSS

The actual social media creative must be implemented using HTML and CSS.

Create a self-contained page/component that can be opened in a browser and screenshotted.

Use:

* Semantic HTML
* Modern CSS
* CSS Grid/Flexbox
* CSS gradients where appropriate
* CSS shapes where useful
* Carefully controlled typography
* Responsive behavior where useful
* Reusable CSS classes
* Proper spacing
* Visual hierarchy

Do NOT create a generic website page.

This is a **social media graphic**.

The canvas should have an explicit social-media-friendly size/aspect ratio.

If the user specifies a platform or dimensions, follow those requirements.

If no platform is specified, choose a sensible standard format and document the chosen dimensions.

The design should work at the intended screenshot resolution.

---

# Step 8 — Make the HTML Screenshot-Ready

The final HTML/CSS must be optimized for screenshot capture.

Requirements:

* Fixed visual canvas
* No unnecessary browser-like UI
* No scrolling inside the creative
* No content accidentally overflowing the canvas
* No clipped text
* No broken layout
* No missing assets
* No tiny unreadable text
* Correct alignment
* Correct spacing
* Correct visual hierarchy

The result should look like a finished social media design when viewed in the browser.

Someone should be able to open the page, capture the designed canvas, and publish the resulting image.

---

# Step 9 — Use Existing Project Assets When Appropriate

When the project already contains:

* Logo
* Product screenshots
* Icons
* Illustrations
* Brand assets
* Fonts
* Images

prefer using those assets when they improve authenticity.

Do not unnecessarily recreate existing product assets.

However, do not blindly copy the landing page.

The goal is:

**Brand consistency + social-media-appropriate creativity.**

---

# Step 10 — Quality Review

Before considering the task complete, review the design as if you were the marketing designer approving it for publication.

Check:

### Marketing

* Is the value proposition clear?
* Is the hook strong?
* Is the post about the actual product?
* Is the message focused?
* Is the CTA appropriate?
* Would the target audience understand the value?

### Design

* Is there a clear visual hierarchy?
* Is the composition balanced?
* Is the focal point obvious?
* Is there enough whitespace?
* Are typography and spacing polished?
* Does it look professional?
* Does it match the product's visual identity?
* Does it look like a real social media creative rather than a normal website?

### Technical

* Does the HTML render correctly?
* Does the CSS render correctly?
* Is the canvas the intended size?
* Is anything clipped?
* Is anything overflowing?
* Are assets loaded correctly?
* Is the design screenshot-ready?

---

# Skill Architecture

Create the skills inside the repository's `skills/` folder.

Before creating files, inspect the existing `skills/` structure and follow its conventions.

Do not arbitrarily invent a completely different skill structure if the repository already has established conventions.

The skill system should be modular where useful.

For example, consider separating responsibilities such as:

* Product/brand understanding
* Social media strategy
* Content/copy creation
* Social media visual design
* HTML/CSS implementation
* Design quality review

However, avoid creating unnecessary skills.

The final structure should be simple enough for an AI agent to discover and use effectively.

---

# Agent Behavior

The resulting social-media agent should behave as an **end-to-end marketing creative agent**, not merely as an HTML generator.

When asked:

> "Create a social media post about feature X"

it should follow this general process:

```text
Understand request
       ↓
Read project requirements
       ↓
Understand product
       ↓
Inspect landing page / existing UI
       ↓
Understand brand identity
       ↓
Determine marketing objective
       ↓
Develop post concept
       ↓
Write social-media copy
       ↓
Design visual composition
       ↓
Implement design in HTML/CSS
       ↓
Review marketing quality
       ↓
Review visual quality
       ↓
Review screenshot readiness
       ↓
Deliver final creative
```

The agent should not skip the product-understanding and brand-understanding phases unless the user explicitly provides all necessary context.

---

# Important Design Philosophy

The most important principle is:

**Do not design first and figure out the message afterward.**

The workflow should be:

**Product → Audience → Marketing objective → Message → Creative concept → Visual design → HTML/CSS**

The visual design must support the marketing message.

Do not create visually impressive designs that communicate nothing.

Likewise, do not create correct marketing copy and place it into a boring generic HTML template.

The final result must combine:

**Marketing strategy + copywriting + visual design + frontend implementation.**

---

# Expected Output of the Skills

After implementing the skills, another AI agent should be able to receive a request such as:

> "Create an Instagram post announcing our AI website builder."

and independently:

1. Understand the product from the requirements.
2. Inspect the landing page.
3. Understand the product's visual identity.
4. Decide what the post should communicate.
5. Write the headline and supporting copy.
6. Design the composition.
7. Implement the post using HTML/CSS.
8. Produce a polished, screenshot-ready social media creative.

The skills should make this workflow repeatable for future social-media posts and future marketing requests.

Do not create a single hardcoded post.

Create **reusable skills/instructions** that can be applied to many different post ideas, features, campaigns, and social media platforms.
