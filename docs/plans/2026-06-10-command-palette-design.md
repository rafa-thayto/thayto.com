# Cmd+K Command Palette — Design

## Goal

Fast keyboard-first navigation across the site: pages, blog posts, theme
toggle, language switch, and external/social links.

## Stack choice

`cmdk` v1.1.1 (the library behind shadcn/ui Command). It bundles Radix Dialog,
giving focus trap, Escape handling, portal rendering, and dialog ARIA for
free. Alternatives considered: kbar (perpetual beta, heavier API) and
react-cmdk (less composable) — both rejected.

## Architecture

- `src/components/command-palette/command-palette.tsx` — client component
  rendering `Command.Dialog`. Receives `posts` (title, slug, tags) as props.
- Mounted once in `src/app/[locale]/layout.tsx` (server component), which
  computes the post list at build time via `getPosts(locale)` — no API route
  needed; `getPosts` is fs-based and server-only.
- `command-palette-trigger.tsx` — search button in the Header (mobile has no
  cmd+k). Decoupled from the palette via a custom `open-command-palette`
  window event, matching the existing `themeChange` event pattern.

## Behaviors

- `⌘K` / `Ctrl+K` toggles; guarded against inputs/textareas/contentEditable;
  `preventDefault()` stops the browser address-bar shortcut.
- Theme toggle replicates ThemeSwitcher logic: `dark` class + localStorage +
  `themeChange` event so the existing switcher stays in sync.
- Language switch uses `router.replace({ pathname, params }, { locale })`
  from `@/i18n/routing`.
- External links open in a new tab with `noopener,noreferrer`.
- All labels translated under the `commandPalette` namespace (pt/en).
- PostHog events: `command-palette-opened`, `-navigate`, `-external-link`,
  `-switch-locale`, `switch-theme`.

## Testing

`command-palette.spec.tsx` (Vitest + happy-dom): open/close via keyboard and
event, editable-target guard, group rendering, post navigation, trigger
dispatch. ResizeObserver/scrollIntoView stubbed (cmdk needs them).
