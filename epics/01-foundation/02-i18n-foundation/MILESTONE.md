# Milestone 02 — i18n Foundation (EN/AR + RTL)

## Goal

The entire localized app runs under `/en/...` and `/ar/...`, Arabic renders right-to-left correctly, and every string resolves through next-intl message catalogs.

## Tasks (execution order)

1. `01-next-intl-en-ar-rtl.md` — wire next-intl: locale routing, `<html lang/dir>`, seeded catalogs, RTL-safe base styles.

## Shared context

- Locales: `en` (default), `ar`. Locale-prefixed routes are mandatory (`/en/dashboard`, `/ar/dashboard`) — no cookie-only locale.
- `<html lang>` and `<html dir="rtl">` (Arabic) are set in `src/app/[locale]/layout.tsx`.
- Message catalogs live at `src/messages/en.json` and `src/messages/ar.json`. Namespaces are per-feature (`nav.*`, `auth.*`, …). Every future task adds keys to BOTH files.
- The language switcher component itself is built in Milestone 04; this milestone provides the routing/mechanism it will call.
