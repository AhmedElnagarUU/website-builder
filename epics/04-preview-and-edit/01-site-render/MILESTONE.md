# Milestone 01 — Site Renderer & Editor Preview

## Goal

One rendering engine turns `{template definition + content + images + brandColor + locale}` into the finished website. The editor wraps it with light-edit affordances; Epic 05's public pages wrap it bare. There is exactly ONE renderer — never two divergent implementations.

## Tasks (execution order)

1. `01-template-renderer-engine.md` — `shared/site-render` engine + section components + style tokens.
2. `02-editor-preview-page.md` — `/[locale]/sites/[siteId]/editor` chrome around the renderer.

## Shared context — RENDERING CONTRACT

Binding for this milestone, Epic 05 public serving, and every future template.

### Props

```ts
export interface RenderedSiteProps {
  template: TemplateDefinition;
  locale: Locale;
  content: Record<string, ContentField>;   // prose fields FOR THIS LOCALE
  businessInfo: SiteBusinessInfo;          // verbatim facts render straight from here
  images: Record<string, SiteImage>;
  brandColor: string;
}
```

### Structure rules

1. Sections render in `template.sections` array order. NOTHING may reorder/add/remove them at runtime — the array is the layout law (product invariant).
2. Factual fields come from `businessInfo`: header/footer show `businessInfo.name`; contact section renders phone/email/location as `tel:`/`mailto:`/plain lines. Contact form submissions DO NOT EXIST in MVP (V1.1) — do not build a form.
3. Prose fields resolve from `content[fieldKey].value`; navigation labels are prose fields (`nav_home`…).
4. Empty optional field: editor mode shows a clearly-marked dashed placeholder block (localized "Empty — tap to fill"); live mode simply omits it. Required-empty cannot occur post-generation (engine fallbacks guarantee fill).
5. `reviewFlagged` fields get a small "AI suggested — review this" badge ONLY in editor mode (via context below).

### Edit-mode mechanism (keeps ONE renderer)

`shared/site-render` exposes `SiteEditModeContext` (`{ enabled: boolean; onRequestEdit(fieldKey): void }`). Editor provides it; live does not. Text nodes render through an internal `F` component that, when context.enabled, becomes a tappable target emitting `onRequestEdit(fieldKey)` — Epic 04 M02 attaches editors there. Image slots analogously emit `onRequestEdit(slotId)`.

### Style tokens (fixed mapping — no user exposure)

- `fontPair`: classic → serif display (Georgia stack) + sans body; modern → system-ui throughout; warm → rounded sans stack.
- `radius`: sharp → 0px; soft → 12px.
- Brand color applied via CSS variable `--brand`; text ON brand surfaces picks black/white automatically by relative luminance (≥4.5:1).
- RTL: direction inherited from `<html dir>`; ALL spacing uses logical utilities; arrow icons flip via `rtl:rotate-180`.

### Live-mode extras (built in Epic 05, supported here)

Language switcher slot reserved in header for bilingual live sites; editor replaces that slot with its own language tabs (outside the renderer).
