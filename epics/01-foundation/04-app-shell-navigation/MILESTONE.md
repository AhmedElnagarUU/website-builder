# Milestone 04 — App Shell & Language Switcher

## Goal

Every localized product page renders inside a consistent shell: navbar (app name, auth-aware actions, EN↔AR switcher) and minimal footer. Switching language preserves the current path and flips direction.

## Task (inline — single-task milestone)

See `01-navbar-language-switcher-shell.md`. This milestone IS that task file.

## Shared context

- The shell applies ONLY to app routes under `[locale]` — never to `/live/**` public sites (Epic 05) which render their own bare chrome.
- Target users are often on phones: the navbar must be usable at 375px width without horizontal scroll.
