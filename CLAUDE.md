# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog and portfolio website built with Next.js (App Router), TypeScript, and Tailwind CSS. The site features MDX-based blog posts in Portuguese and English with full internationalization (i18n) support using next-intl. Analytics integration includes PostHog, Google Analytics, GTM, and Microsoft Clarity.

## Development Commands

### Running the project

- `bun dev` - Start development server
- `bun build` - Build for production (includes RSS feed generation)
- `bun generate-rss` - Generate RSS feed manually
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun check-types` - Run TypeScript type checking without emitting files

### Testing

- `bun test` - Run Jest tests
- `bun test:watch` - Run Jest in watch mode
- `bun test -- path/to/file.spec.tsx` - Run a single test file
- Test files use `.spec.tsx` naming convention

### E2E Testing

Cypress is available in devDependencies but no npm scripts are configured. Run directly with `bunx cypress open`.

### Note on Package Manager

This project uses `bun` as the package manager (see `packageManager` field in package.json). Bun is a fast all-in-one JavaScript runtime and package manager that is significantly faster than npm/pnpm/yarn.

## Architecture & Key Patterns

### Internationalization (i18n)

The site supports Portuguese (default) and English using **next-intl** with locale-based routing:

- **Configuration**:

  - `/src/i18n/config.ts` - Defines locales array `['pt', 'en']`
  - `/src/i18n/routing.ts` - Configures routing with `localePrefix: 'as-needed'`
    - Portuguese (default): No prefix in URL (e.g., `/blog`)
    - English: Uses `/en` prefix (e.g., `/en/blog`)
  - `/src/i18n/request.ts` - Server-side i18n configuration

- **Localized Blog Posts**:

  - Posts are organized by locale: `/posts/pt/` and `/posts/en/`
  - Each post uses the **same slug** in both locales for URL consistency
  - Example: `/posts/pt/my-post.mdx` and `/posts/en/my-post.mdx`

- **i18n-Aware Navigation**:

  - ALWAYS use hooks from `@/i18n/routing` instead of `next/navigation`:
    - `import { usePathname, useRouter, Link } from '@/i18n/routing'`
  - The `router.replace()` API supports locale switching:
    ```typescript
    router.replace({ pathname, params }, { locale: newLocale })
    ```

- **LanguageSwitcher Component** (`/src/components/language-switcher/`):

  - Client component with locale switching functionality
  - Features smooth animations (hover/active scale effects)
  - Used in: Footer, blog listing page, and individual blog post pages
  - Automatically syncs URL with selected locale

- **Translation Files**:
  - `/messages/pt.json` - Portuguese translations
  - `/messages/en.json` - English translations
  - Used with `useTranslations('namespace')` hook

### Blog System Architecture

The blog is powered by MDX files stored in the `/posts` directory, organized by locale (`/posts/pt/` and `/posts/en/`). The system uses:

- **MDX Processing**: Uses `next-mdx-remote` for serializing MDX content with plugins:
  - `remark-gfm` for GitHub Flavored Markdown
  - `rehype-slug` and `rehype-autolink-headings` for auto-generated heading anchors
  - `rehype-prism-plus` for syntax highlighting
- **Post Utilities** (`src/utils/mdx.ts`): Central location for MDX processing logic
  - `getPosts(locale)` - Fetches all posts for a specific locale and sorts by date
  - `getMdxSerializedPost(slug, locale)` - Serializes a single post for rendering
  - `getPreviousOrNextPostBySlug(slug, type, locale)` - Gets adjacent posts for navigation within the same locale

### App Structure (Next.js App Router)

All pages are organized under the `[locale]` dynamic segment for i18n support.

**Server Components (Default):**

- `/src/app/[locale]/page.tsx` - Home page with recent posts (async data fetching, locale-aware)
- `/src/app/[locale]/blog/page.tsx` - Blog listing page (locale-aware)
- `/src/app/[locale]/blog/[slug]/page.tsx` - Individual blog post (dynamic route using MDX with generateStaticParams, locale-aware)
- `/src/app/[locale]/linktree/page.tsx` - Social links page wrapper
- `/src/app/[locale]/about/page.tsx` - About page

**Client Components (Interactive):**

- `/src/app/[locale]/home-content.tsx` - Home page interactive features (confetti, hover effects)
- `/src/app/[locale]/blog/blog-content.tsx` - Blog search/filter with useSearchParams, includes LanguageSwitcher
- `/src/app/[locale]/blog/[slug]/blog-post-navigation.tsx` - Blog post navigation with PostHog tracking, includes LanguageSwitcher
- `/src/app/[locale]/linktree/linktree-content.tsx` - Linktree interactive features
- `/src/components/language-switcher/language-switcher.tsx` - Language switcher component (used in Footer, blog pages)

**Infrastructure:**

- `/src/app/layout.tsx` - Root layout with i18n provider (replaces \_app.tsx and \_document.tsx)
- `/src/app/[locale]/layout.tsx` - Locale-specific layout with next-intl configuration
- `/src/app/providers.tsx` - PostHog provider wrapper (client component)
- `/src/app/analytics.tsx` - Analytics scripts (GA, GTM, Clarity) as client component
- `/src/app/sitemap.ts` - Native sitemap generation (locale-aware)
- `/src/app/robots.ts` - Native robots.txt generation

### Styling System

- Uses Tailwind CSS with custom typography plugin configuration
- Custom fonts: Poppins (sans) and Lora (serif) loaded via `next/font/google`
- Dark mode support via `darkMode: 'class'` in Tailwind config
- Extensive typography customization in `tailwind.config.js` for MDX content rendering

### Component Organization

Components follow a feature-based structure in `/src/components`:

- Each component has its own directory with index file
- **Client Components** (marked with `'use client'`):
  - `MDXImage.tsx` - Custom image component for MDX with Next.js Image optimization
  - `CodeBlock` and `Pre` - Custom code rendering components with copy functionality
  - `Layout` - Main layout wrapper with theme handling
  - `Header` - Header with navigation
  - `BlogCard` - Blog card with PostHog tracking
  - `theme-switcher` - Theme toggle component
  - `language-switcher` - Language/locale switcher component with smooth animations
  - `Footer` - Footer with theme switcher and language switcher
- `ui/` - Reusable UI components (shadcn/ui style)

### Analytics Integration

Multiple analytics providers are integrated:

- **PostHog** - Initialized in `/src/app/providers.tsx` (client component)
- **Google Analytics** (via gtag) - Script in `/src/app/analytics.tsx`
- **Google Tag Manager** - Script in `/src/app/analytics.tsx`
- **Microsoft Clarity** - Script in `/src/app/analytics.tsx`
- **Vercel Analytics** - Imported in root layout

All analytics IDs are configured via environment variables (see `.env.example`).

Analytics scripts are loaded via client component to avoid blocking server rendering.

### Path Aliases

TypeScript and build tools use `@/*` to alias `src/*` (configured in `tsconfig.json` and `jest.config.js`).

### Content Security & SEO

- Security headers configured in `next.config.js` (HSTS, XSS protection, frame options, etc.)
- **Metadata API** - Native Next.js metadata for all pages (OpenGraph, Twitter Cards, canonical URLs)
- **Structured data** - JSON-LD schema embedded in pages for SEO
- **Native Sitemap** - Generated via `/src/app/sitemap.ts` (accessible at `/sitemap.xml`)
- **Native Robots.txt** - Generated via `/src/app/robots.ts` (accessible at `/robots.txt`)
- **RSS Feed** - Generated during build via `/src/utils/generate-rss-script.ts` (accessible at `/rss.xml`)

**Metadata Patterns:**

- Static pages use `export const metadata: Metadata = {...}`
- Dynamic pages use `export async function generateMetadata({ params }): Promise<Metadata> {...}`
- All metadata includes: title, description, canonical URL, OpenGraph, Twitter Cards

### Image Optimization

- Uses `@plaiceholder/next` for blur placeholder generation
- Custom utility for processing images in `/src/utils/images.ts`
- To create tiny blur placeholders: `ffmpeg -i <FILENAME>.<EXTENSION> -vf scale=20:-1 <FILENAME>-small.<EXTENSION>`

### Git Workflow

- Uses Husky for git hooks
- Commitizen for conventional commits (`cz-conventional-changelog`)
- Lint-staged runs ESLint and Prettier on staged files
- Commitlint enforces conventional commit messages

### Functional Programming

Uses `fp-ts` library for functional programming patterns (see `src/utils/mdx.ts` for examples with Option and Array utilities).

## Common Patterns

### Adding a New Blog Post

**For a new post in both locales:**

1. Create `.mdx` files in both locale directories with the **same slug**:

   - `/posts/pt/my-post-slug.mdx` (Portuguese version)
   - `/posts/en/my-post-slug.mdx` (English version)

2. Include frontmatter with:

   - `title`, `description`, `publishedTime`, `modifiedTime`, `tags`
   - `href` - Use the same slug for both locales (e.g., `/blog/my-post-slug`)
   - `image` object with `src`, `placeholder`, `type`
   - `reactionsLength`, `commentsLength`

3. The post will automatically appear on the blog index and home page (sorted by date) in the respective locale

**Translation Guidelines:**

- **Portuguese → English**: Translate from informal Brazilian Portuguese style to friendly professional English
- **English → Portuguese**: Translate from professional English to informal, conversational Brazilian Portuguese
  - Use informal expressions (e.g., "vamo nessa", "bglh", "tmj")
  - Use "você" instead of formal pronouns
  - Keep technical terms in English when commonly used in the Brazilian dev community
- Maintain the same slug across locales for URL consistency

### Working with MDX Components

Custom MDX components are defined in `/src/app/[locale]/blog/[slug]/page.tsx`:

- `pre` → Custom `Pre` component (client component with copy button)
- `code` → Custom `CodeBlock` component (client component)
- `img` / `Image` → Custom `MDXImage` component (client component with modal preview)

All custom MDX components are client components because they use React hooks for interactivity.

### Server vs Client Components

**When to use Server Components (default):**

- Pages that fetch data
- Static content rendering
- SEO metadata generation
- No React hooks or browser APIs

**When to use Client Components (`'use client'`):**

- Using React hooks (useState, useEffect, useRef, etc.)
- Using Next.js hooks (usePathname, useSearchParams, useRouter)
- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, window, document)
- Third-party libraries that require client-side rendering

**IMPORTANT for i18n:**

- When using navigation hooks in client components, **ALWAYS import from `@/i18n/routing`** instead of `next/navigation`:

  ```typescript
  // ✅ CORRECT - i18n-aware navigation
  import { usePathname, useRouter, Link } from '@/i18n/routing'

  // ❌ WRONG - will break locale switching
  import { usePathname, useRouter } from 'next/navigation'
  import Link from 'next/link'
  ```

- The i18n-aware hooks automatically handle locale prefixes and provide locale-switching capabilities
- Use `router.replace({ pathname, params }, { locale: newLocale })` for locale switching

### Using the LanguageSwitcher Component

The LanguageSwitcher component is already integrated in:

- Footer (`/src/components/Footer/Footer.tsx`)
- Blog listing page (`/src/app/[locale]/blog/blog-content.tsx`)
- Individual blog post pages (`/src/app/[locale]/blog/[slug]/blog-post-navigation.tsx`)

To add it to other pages:

```typescript
import { LanguageSwitcher } from '@/components/language-switcher'

// Then render it in your component
;<LanguageSwitcher />
```

The component is self-contained and requires no props.

### Common i18n Issues and Solutions

**Issue: Language switcher not working / locale not changing**

- **Cause**: Using navigation hooks from `next/navigation` instead of `@/i18n/routing`
- **Solution**: Always import `usePathname`, `useRouter`, and `Link` from `@/i18n/routing`:
  ```typescript
  import { usePathname, useRouter } from '@/i18n/routing'
  ```

**Issue: 500 error or route conflicts after adding i18n**

- **Cause**: Old non-localized routes (e.g., `/src/app/blog/`) conflicting with new localized routes (`/src/app/[locale]/blog/`)
- **Solution**: Remove all old route directories that don't include `[locale]` segment

**Issue: searchParams causing TypeScript errors**

- **Cause**: `searchParams` can be `null` in some contexts
- **Solution**: Always use optional chaining:
  ```typescript
  const search = searchParams?.get('tags')
  const params = new URLSearchParams(searchParams?.toString())
  ```

**Issue: Post not appearing in the correct locale**

- **Cause**: Post file placed in wrong directory or missing locale parameter in utility functions
- **Solution**: Ensure posts are in `/posts/pt/` or `/posts/en/` and utility functions receive the correct `locale` parameter

### Extending Analytics

To add tracking events, use PostHog's `posthog.capture()` method:

- PostHog is initialized in `/src/app/providers.tsx`
- Use in client components by importing: `import posthog from 'posthog-js'`
- Example: `posthog.capture('event-name', { property: 'value' })`
