# Blog Globe View (InfiniteMenu) — Design

**Date:** 2026-07-01
**Status:** Approved

## Goal

Add an icon toggle on `/blog` that switches the post list between the existing
`BlogCard` list view and a WebGL "globe" view powered by the React Bits
`InfiniteMenu` component. Each blog post becomes an item on the interactive
sphere.

## Decisions (confirmed with user)

- **Default view:** List (globe is opt-in). Keeps crawlable content server-rendered.
- **Toggle UI:** A single icon button in the existing top row (next to
  Index link / LanguageSwitcher) that flips between a list icon and a globe icon.
- **Item click:** Open the post in a new tab. Achieved by passing an **absolute**
  URL as the item `link` so the component's built-in `startsWith('http')` →
  `window.open(link, '_blank')` path fires. No handler changes needed.
- **Persistence:** None. View resets to `list` on every visit (`useState`).
- **Loading:** Lazy — the component chunk (incl. `gl-matrix`) is only fetched
  when the user first switches to globe view.

## Components

### 1. `src/components/infinite-menu/`

- `infinite-menu.tsx` — React Bits `InfiniteMenu` source ported to a
  `'use client'` TypeScript component. WebGL2 + gl-matrix internals kept verbatim;
  only the public surface is typed (`items: MenuItem[]`, `scale?: number`).
  Add an animation-loop teardown: cancel the `requestAnimationFrame` loop on
  unmount so toggling back to list stops GPU work.
- `infinite-menu.css` — provided styles, imported by the component.
- `index.ts` — default re-export.

### 2. `gl-matrix` dependency

- Add `gl-matrix` to `package.json` dependencies (install via `bun add gl-matrix`).

### 3. `blog-content.tsx` (existing client component)

- Lazy import:
  ```ts
  const InfiniteMenu = dynamic(() => import('@/components/infinite-menu'), {
    ssr: false,
    loading: () => <GlobeSkeleton />,
  })
  ```
- View state: `const [view, setView] = useState<'list' | 'globe'>('list')`.
- Icon toggle button in the top row (`lucide-react` icons — already a dep).
- Map filtered `posts` → `items`:
  ```ts
  {
    image: `/static/images/${post.data.image.src}`,
    link:  `${SITE_URL}${post.data.href}`,
    title: post.data.title,
    description: post.data.description,
  }
  ```
  Posts without `data.image` are filtered out of the globe (WebGL requires a texture).
- `view === 'list'` → existing `BlogCard` map, unchanged.
- `view === 'globe'` → a `position: relative` container (~70vh) holding
  `<InfiniteMenu items={items} />`.

## Data flow

`page.tsx` (server) → `getPosts(locale)` → `<BlogContent posts>` (client)
→ tag filter (`?tags=`) → either `BlogCard` list or `items` → `InfiniteMenu`.

Tag filtering applies to both views because it filters `posts` upstream of the
view branch.

## Non-regression

- `page.tsx` stays fully server-rendered; the `BlogCard` list is always the
  default DOM content, so SEO/SSR is unaffected.
- The globe (WebGL + rAF loop + gl-matrix chunk) is mounted only on demand and
  torn down on unmount.

## Out of scope (YAGNI)

- Persisting the view choice.
- Globe view for the home page or other post listings.
- Custom overlay/title styling beyond the component's provided CSS.
