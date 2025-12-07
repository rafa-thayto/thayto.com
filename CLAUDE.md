# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog and portfolio website built with Next.js (App Router), TypeScript, and Tailwind CSS. The site features MDX-based blog posts in Portuguese and English, with analytics integration (PostHog, Google Analytics, GTM, Microsoft Clarity).

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

### Blog System Architecture

The blog is powered by MDX files stored in the `/posts` directory. The system uses:

- **MDX Processing**: Uses `next-mdx-remote` for serializing MDX content with plugins:
  - `remark-gfm` for GitHub Flavored Markdown
  - `rehype-slug` and `rehype-autolink-headings` for auto-generated heading anchors
  - `rehype-prism-plus` for syntax highlighting
- **Post Utilities** (`src/utils/mdx.ts`): Central location for MDX processing logic
  - `getPosts()` - Fetches all posts and sorts by date
  - `getMdxSerializedPost(slug)` - Serializes a single post for rendering
  - `getPreviousOrNextPostBySlug(slug, type)` - Gets adjacent posts for navigation

### App Structure (Next.js App Router)

**Server Components (Default):**
- `/src/app/page.tsx` - Home page with recent posts (async data fetching)
- `/src/app/blog/page.tsx` - Blog listing page
- `/src/app/blog/[slug]/page.tsx` - Individual blog post (dynamic route using MDX with generateStaticParams)
- `/src/app/linktree/page.tsx` - Social links page wrapper
- `/src/app/about/page.tsx` - About page

**Client Components (Interactive):**
- `/src/app/home-content.tsx` - Home page interactive features (confetti, hover effects)
- `/src/app/blog/blog-content.tsx` - Blog search/filter with useSearchParams
- `/src/app/blog/[slug]/blog-post-navigation.tsx` - Blog post navigation with PostHog tracking
- `/src/app/linktree/linktree-content.tsx` - Linktree interactive features

**Infrastructure:**
- `/src/app/layout.tsx` - Root layout (replaces _app.tsx and _document.tsx)
- `/src/app/providers.tsx` - PostHog provider wrapper (client component)
- `/src/app/analytics.tsx` - Analytics scripts (GA, GTM, Clarity) as client component
- `/src/app/sitemap.ts` - Native sitemap generation
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

1. Create a new `.mdx` file in `/posts` directory
2. Include frontmatter with: `title`, `description`, `publishedTime`, `modifiedTime`, `tags`, `href`, `image` object (with `src`, `placeholder`, `type`), `reactionsLength`, `commentsLength`
3. The post will automatically appear on the blog index and home page (sorted by date)

### Working with MDX Components

Custom MDX components are defined in `/src/app/blog/[slug]/page.tsx`:

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

### Extending Analytics

To add tracking events, use PostHog's `posthog.capture()` method:
- PostHog is initialized in `/src/app/providers.tsx`
- Use in client components by importing: `import posthog from 'posthog-js'`
- Example: `posthog.capture('event-name', { property: 'value' })`
