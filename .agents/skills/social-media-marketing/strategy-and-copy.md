# Strategy & Copy (after product/brand understanding)

Now decide what the post communicates and write its copy.

---

## Step 1 — Determine the marketing objective

If the user gave an objective, follow it. If they only gave an idea, infer a sensible
objective from the product and the request. Possible objectives:

- Product awareness · Feature/capability awareness · Product launch / announcement
- Lead generation · Driving traffic to the landing page · Educational / concept
- Problem awareness · Showing a specific capability · Building trust · Engagement
- Conversion

Pick exactly one primary objective and write it down. Let it drive everything that
follows. A post trying to do everything communicates nothing.

---

## Step 2 — Develop the post concept

### Hook
The first thing the audience notices. Clear, short, relevant, and attention-grabbing.
For Monomastic this could be the emotional tension the product relieves: "You need a
website. You don't want to build one." or a surprising truth from the product: "Your
Arabic site, written like a human wrote it." Keep it scannable in under ~1 second.

### Core message
The single most important idea the audience should remember. Do not try to compress
every feature into one post.

### Supporting content
Only what is needed to reinforce the core message. One or two supporting lines max.
For copy inside the visual, prefer short bullets or a single supportive sentence over
paragraphs.

### Call to action (only if the objective calls for it)
Fit the CTA to the objective, e.g. "Start free →", "See how it works", "Make yours",
"Try it". Products' live CTA is "Start free". Do not bolt on a CTA to every post.

---

## Step 3 — Write the social copy

Write copy for visual consumption, not a blog article:

- Short headline(s) · Strong hierarchy · Minimal text · Scannable · One clear message.
- No long paragraphs, no buzzword-stuffed lines, no unsubstantiated claims.

### Hard rules — never violate

- **Never invent product capabilities.** Every capability you mention must be
  supported by `DOC/PRD.md` or the live landing copy (`src/messages/en.json` →
  `"landing"`). Real, citable capabilities include:
  - AI writes the whole site after a short conversation about the business.
  - English and Arabic written together — a real RTL Arabic version, not a thin
    translation.
  - Looks and sounds like the owner; edit it like a Word doc.
  - Edits can't break the layout.
  - Hosted at `yourname.monomastic.site` (SSL, mobile, search basics); content stays
    yours / exportable, no lock-in.
  - Roughly ten minutes from conversation to a published site; generation in about
    a minute.
  - Regenerates but never silently overwrites your edits.
- **No fake statistics.** Do not invent "92%", "3×", etc. Use only real numbers from
  product copy, or drop numbers entirely.
- **No fake testimonials.** If you want a testimonial, present it clearly as sample
  content — never a fabricated real customer quote. Prefer no testimonial at all
  unless the request is to make one.
- **No fabricated facts** (years in business, awards, exact pricing, city-specific
  claims) unless supplied by the user.

### Bilingual (default: EN + AR)

Write each language as its own natural version:

- English: match the field-notebook voice — warm, plain, a hint of self-awareness.
- Arabic: natural, localized Arabic — adapt idiom and framing to an Arabic-speaking
  audience. Keep facts identical to the English; only phrasing/tone/framing differ.
  Never a mechanical translation.
- Flagship product messages to adapt (do not copy verbatim — make it fresh for the
  post): "A website, written by hand", "You answer, Monomastic writes", "English and
  Arabic. One brand, one voice", "edits that can't break it".

### Tone check
Would the target audience (busy small-business owners in the Gulf and beyond, mixed
EN/AR) understand the value in a second? Read it out loud. Cut anything that sounds
like marketing sludge or a slogan that could belong to any product.

---

## Output of this stage

Deliver a short written concept you'll design against:

1. Objective (one line)
2. Hook (one line)
3. Core message (one line)
4. Supporting content (≤2 short lines)
5. CTA / no CTA
6. The final short screen copy — English AND Arabic — ready to place into the visual

Keep this tight. The design next must serve this message.
