# Product & Brand Understanding (read first — mandatory)

Before creating anything, you must understand the product and its visual identity.
Do NOT start by writing a post. Do NOT assume the product from filenames or folder
names. Do NOT treat any single doc as the only source of truth without confirming it
against the actual shipped code.

---

## Step 1 — Read the requirements (source of truth)

Open and read `docs/01-overview/01-product-requirements.md` in full. It defines:

- What the product is: an **AI website builder** for non-technical small-business
  owners, freelancers, and local services.
- What problem it solves: design paralysis, content paralysis, and time-to-value are
  what block non-technical owners. Monomastic removes the decisions, not just adds AI.
- How it works: the user answers short business questions, picks a template, chooses
  language(s) (English, Arabic, or both), AI writes the whole site, they lightly edit,
  then publish at a system URL.
- Core product boundaries (invariants — do not contradict these in copy):
  - It is **not** a drag-and-drop / page builder. There is no canvas. Never describe it
    that way.
  - Users control content + a limited set of visual properties; templates control
    structure.
  - English and Arabic are first-class, RTL first-class; Arabic is not a translation skin.
  - Publishing and editing are separate actions; published content updates only on an
    explicit "update live" action.
  - Manually edited content is never silently overwritten by AI regeneration.

Confirm the product's real, current claims by reading the shipped landing page copy
(`src/messages/en.json` → `"landing"`) — e.g. "~10 min" to a site, "60–90 seconds" to
generate, hosted at `yourname.monomastic.site`, content exportable, edits can't break
the layout, EN+AR written together. Use these exact claims; never inflate them.

---

## Step 2 — Inspect the production landing page

Read the landing components under `src/features/landing/components/` (Hero, Features,
HowItWorks, Languages, Proof, FinalCta) and the landing messages in
`src/messages/en.json` and `src/messages/ar.json`. This is the shipped, real brand —
**prefer it over older scratch/spec files** (`prompt/*.md`, `docs/02-design/01-landing-design-spec.md`, and
`design-scratch/` are historical or alternative explorations and may describe a
different look that is no longer live).

Record what the brand looks and sounds like (see the reference below) so your social
post stays on-brand.

---

## The current Monomastic visual identity (reference)

Extracted from the production tokens (`src/app/globals.css`) and the landing UI.

### Palette

| Token | Hex | Role |
|-------|-----|------|
| `--mono-paper` | `#f5efdf` | Warm off-white background (never bright white) |
| `--mono-paper-2` | `#ebe3d0` | Cooler section/card surface |
| `--mono-ink` | `#2a2622` | Warm near-black primary text (never pure black) |
| `--mono-ink-2` | `#5c544a` | Secondary text/body |
| `--mono-ink-3` | `#8e8576` | Tertiary text/labels/captions |
| `--mono-red` | `#b23a48` | Primary accent — muted terracotta red (emphasis, numbers, marks) |
| `--mono-blue` | `#2d5ba8` | Ruled-line ink blue — secondary accent, wavy/underline details |
| `--mono-yellow` | `#e8b53c` | Signature sticky-note / tape yellow |
| `--mono-green` | `#4a6b3d` | Occasional secondary accent |
| `--mono-line` | `#b4c8e8` | Ruled notebook line blue |
| `--mono-rule` | `rgba(42,38,34,.2)` | Hairline borders/dividers |

Key traits:

- **Never pure black (`#000`) or pure white (`#fff`).** Warm paper + warm ink only.
- Signature shadow: hard offset `4px 4px 0` in a translucent ink (no blur) — gives a
  sticker/stationery feel.
- Border radius: small, ~`4px` (practical, not pill).
- Selection highlight and highlights use `--mono-yellow`.

### Typography

- **English display/handwritten:** a handwritten style face (Caveat) used for accent
  words, brand marks, sticky notes, and light-hearted emphasis — used with restraint.
- **Body:** a warm serif body face; **mono** face for labels/captions/step counters
  (uppercase, letterspaced).
- **Arabic:** swap to Arabic serif/sans faces. Headings/display use the **Arabic
  serif** — never the English handwritten face. `dir="rtl"` and right-aligned flow.

### Signature elements you can lean on

- Ruled notebook lines background texture + a thin vertical red margin line.
- Sticky notes and **tape tags** (translucent yellow tape, slight rotation `-2deg`).
- Wavy/underline emphasis (often blue wavy under a red word).
- Handwritten `★` / marks, and small labels like "note to self", "obs. №".
- Numbered labels ("step 01", "i / ii / iii"), dashed dividers, uppercase mono captions.
- Editorial copy voice: warm, personal, plain-language, a little self-aware — e.g.
  "— signed, monomastic", "— fin.", "your notebook", "sounds like you".

### Brand voice (how copy should read)

Warm, plain, confident-but-humble; speaks to a busy business owner who doesn't do
design. Short punchy lines, human metaphor, zero tech jargon ("component", "grid",
"breakpoint" are forbidden as user-facing terms). Name the person, the place, the
benefit — never the mechanism.

---

## Output of this stage

Before moving on, be able to state in one or two sentences each:

1. What Monomastic is and the problem it solves.
2. Who it is for.
3. Its real, citable capabilities (from requirements + live copy).
4. Its visual identity (colors, type, signature motifs, voice).

If you cannot state these confidently, re-read the sources above before designing.
Do not proceed on guesses.
