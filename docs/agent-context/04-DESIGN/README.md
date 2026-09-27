# 04 — DESIGN (binding design source)

| File | What it is |
|---|---|
| `01-landing-design-spec.md` | The locked landing-page design spec (the Loom / "orange→red" direction) |

**Status caveat, carried over from the old docs index:** this spec is **legacy**. It is superseded by
the Variant-14 "Monomastic" notebook design that actually ships —
`design/landingPage/variant-14/`, implemented in `src/features/landing/` and the tokens in
`src/app/globals.css`. Its per-template palette/typography authority moved to Epic 14's
`epics/14-template-modern-redesign/01-design-audit/newmodern-design-source.md`, with the visual
references in `newmodern/`.

Read this when working on the landing page *and* only after checking which direction is current —
do not treat it as the live design system.

## Live design surfaces (code, not docs)

- `src/app/globals.css` — Tailwind v4 + design tokens + the RTL-safety rule
- `src/features/landing/` — landing sections
- `src/features/templates/catalog.ts` — per-template theme axis (source of truth for template look)
- `src/shared/ui/fonts.ts` — **self-hosted** faces (`next/font/local`, 109 bundled `.woff2`);
  `next/font/google` is banned because it fails with `ETIMEDOUT` on this network
