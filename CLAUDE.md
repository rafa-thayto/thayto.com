# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog and portfolio website built with Next.js (Pages Router), TypeScript, and Tailwind CSS. The site features MDX-based blog posts in Portuguese and English, with analytics integration (PostHog, Google Analytics, GTM, Microsoft Clarity).

## Development Commands

### Running the project

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm check-types` - Run TypeScript type checking without emitting files

### Testing

- `pnpm test` - Run Jest tests
- `pnpm test:watch` - Run Jest in watch mode
- `pnpm test -- path/to/file.spec.tsx` - Run a single test file
- Test files use `.spec.tsx` naming convention

### Note on Package Manager

This project uses `pnpm` as the package manager (see `packageManager` field in package.json).

## Architecture & Key Patterns

### Blog System Architecture

The blog is powered by MDX files stored in the `/posts` directory. The system uses:

- **MDX Processing**: Uses `next-mdx-remote` for serializing MDX content with plugins:
  - `remark-gfm` for GitHub Flavored Markdown
  - `rehype-slug` and `rehype-autolink-headings` for auto-generated heading anchors
  - `rehype-prism` for syntax highlighting
- **Post Utilities** (`src/utils/mdx.ts`): Central location for MDX processing logic
  - `getPosts()` - Fetches all posts and sorts by date
  - `getMdxSerializedPost(slug)` - Serializes a single post for rendering
  - `getPreviousOrNextPostBySlug(slug, type)` - Gets adjacent posts for navigation

### Pages Structure (Next.js Pages Router)

- `/src/pages/index.tsx` - Home page with recent posts
- `/src/pages/blog/index.tsx` - Blog listing page
- `/src/pages/blog/[slug].tsx` - Individual blog post (dynamic route using MDX)
- `/src/pages/linktree.tsx` - Social links page
- `/src/pages/about.tsx` - About page

### Styling System

- Uses Tailwind CSS with custom typography plugin configuration
- Custom fonts: Poppins (sans) and Lora (serif) loaded via `next/font/google`
- Dark mode support via `darkMode: 'class'` in Tailwind config
- Extensive typography customization in `tailwind.config.js` for MDX content rendering

### Component Organization

Components follow a feature-based structure in `/src/components`:

- Each component has its own directory with index file
- `MDXImage.tsx` - Custom image component for MDX with Next.js Image optimization
- `CodeBlock` and `Pre` - Custom code rendering components
- `Layout` - Main layout wrapper
- `ui/` - Reusable UI components (shadcn/ui style)

### Analytics Integration

Multiple analytics providers are initialized in `_app.tsx`:

- PostHog (product analytics)
- Google Analytics (via gtag)
- Google Tag Manager
- Microsoft Clarity

All analytics IDs are configured via environment variables (see `.env.example`).

### Path Aliases

TypeScript and build tools use `@/*` to alias `src/*` (configured in `tsconfig.json` and `jest.config.js`).

### Content Security & SEO

- Security headers configured in `next.config.js` (HSTS, XSS protection, frame options, etc.)
- Structured data for SEO using JSON-LD schema
- `next-seo` for OpenGraph and Twitter Card metadata
- RSS feed generation via `next-sitemap` (runs on `postbuild`)
- Sitemap automatically generated after build

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

Custom MDX components are defined in `/src/pages/blog/[slug].tsx`:

- `pre` → Custom `Pre` component
- `code` → Custom `CodeBlock` component
- `img` / `Image` → Custom `MDXImage` component

### Extending Analytics

To add tracking events, use PostHog's `posthog.capture()` method (PostHog is initialized globally in `_app.tsx`).
