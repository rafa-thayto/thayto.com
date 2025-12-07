# Next.js Pages Router to App Router Migration Plan

## Overview

Migrate from Pages Router to App Router while preserving ALL SEO metadata, sitemap generation, and current functionality. Focus on simplicity (KISS principle).

## Key Strategy

1. **Replace next-sitemap with native Next.js sitemap** - App Router has built-in sitemap/robots support
2. **Replace next-seo with Metadata API** - App Router uses native metadata exports
3. **Convert getStaticProps/getStaticPaths to Server Components** - Direct data fetching
4. **Split client/server responsibilities** - Interactive features in client components
5. **Keep MDX rendering with next-mdx-remote** - No changes to MDX pipeline

## New Directory Structure

```
/src/app/
├── layout.tsx                # Root layout (replaces _app + _document)
├── providers.tsx             # PostHog client component
├── analytics.tsx             # Analytics scripts client component
├── page.tsx                  # Home page
├── about/page.tsx            # About page
├── linktree/page.tsx         # Linktree page
├── blog/
│   ├── page.tsx              # Blog listing
│   └── [slug]/page.tsx       # Individual blog posts
├── sitemap.ts                # Native sitemap generation
└── robots.ts                 # Native robots.txt generation
```

## Critical Files to Create

### 1. Root Layout (`/src/app/layout.tsx`)

Consolidates `_app.tsx` + `_document.tsx`:
- Move fonts (Poppins, Lora) configuration
- Global metadata (robots, verification, favicons, RSS link)
- Render HTML structure with pt-BR lang and dark mode class
- Import PostHog provider and analytics scripts
- Import global CSS files

**Key Pattern:**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://thayto.com'),
  robots: 'index follow',
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  alternates: {
    types: { 'application/rss+xml': 'https://thayto.com/rss.xml' }
  },
  icons: { ... },
  manifest: '/site.webmanifest',
}
```

### 2. Analytics Client Component (`/src/app/analytics.tsx`)

Extract all analytics scripts (GTM, GA, Clarity) from _app.tsx:
- Mark with 'use client'
- Use Script components with strategy="afterInteractive"
- Include GTM noscript iframe

### 3. PostHog Provider (`/src/app/providers.tsx`)

Wrap PostHog initialization:
- Mark with 'use client'
- Initialize posthog with env vars
- Export PostHogProvider wrapper component

### 4. Blog Post Page (`/src/app/blog/[slug]/page.tsx`)

**Most complex migration:**
- Replace `getStaticPaths` → `generateStaticParams()`
- Replace `getStaticProps` → direct async data fetching
- Replace `NextSeo` → `generateMetadata()` function
- Keep JSON-LD structured data (in component JSX)
- Keep MDXRemote rendering with custom components
- Extract PostHog tracking to client component wrapper

**Key Patterns:**
```typescript
// Static params generation
export async function generateStaticParams() {
  return postFilePaths.map((filePath) => ({
    slug: filePath.replace('.mdx', ''),
  }))
}

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const { frontMatter } = await getMdxSerializedPost(params.slug)
  return {
    title: `${frontMatter.title} - Rafael Thayto`,
    description: frontMatter.description,
    keywords: frontMatter.tags?.join(', '),
    openGraph: { ... },
    twitter: { ... },
    alternates: { canonical: `https://thayto.com/blog/${params.slug}` },
  }
}

// Server Component
export default async function BlogPostPage({ params }) {
  const { frontMatter, mdxSource } = await getMdxSerializedPost(params.slug)
  // ... render MDX
}
```

### 5. Home Page (`/src/app/page.tsx`)

- Replace `getStaticProps` with direct `getPosts()` call
- Replace `NextSeo` with metadata export
- Extract interactive features (confetti, hover) to client component
- Keep JSON-LD structured data

### 6. Blog Index (`/src/app/blog/page.tsx`)

- Replace `getStaticProps` with direct `getPosts()` call
- Replace `NextSeo` with metadata export
- Extract search params filtering to client component
- Keep JSON-LD structured data
- Move RSS generation to build script

### 7. Native Sitemap (`/src/app/sitemap.ts`)

Replace next-sitemap package:
```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts()

  const blogPosts = posts.map((post) => ({
    url: `https://thayto.com${post.data.href}`,
    lastModified: new Date(post.data.modifiedTime),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const staticPages = [
    { url: 'https://thayto.com/', lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://thayto.com/blog', ... },
    { url: 'https://thayto.com/about', ... },
    { url: 'https://thayto.com/linktree', ... },
  ]

  return [...staticPages, ...blogPosts]
}
```

### 8. Native Robots (`/src/app/robots.ts`)

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://thayto.com/sitemap.xml',
  }
}
```

## RSS Feed Migration

**Current:** Generated in blog index getStaticProps
**New:** Build script approach

Update package.json:
```json
{
  "scripts": {
    "build": "next build && bun run generate-rss",
    "generate-rss": "bun run src/utils/generate-rss-script.ts"
  }
}
```

Create `/src/utils/generate-rss-script.ts`:
```typescript
import { generateRssFeed } from './generate-rss-feed'

generateRssFeed()
  .then(() => console.log('RSS feed generated'))
  .catch(console.error)
```

## Client/Server Component Boundaries

**Server Components (default):**
- All page.tsx files
- Data fetching, metadata generation
- JSON-LD structured data rendering

**Client Components ('use client'):**
- `/src/app/providers.tsx` - PostHog
- `/src/app/analytics.tsx` - Analytics scripts
- Interactive wrappers for confetti, hover effects
- Components using useSearchParams, useState, useEffect
- Components with PostHog tracking (onClick handlers)

**Pattern:** Extract interactive portions to `-content.tsx` files, keep page.tsx as Server Component.

## SEO Metadata Migration Pattern

**Before (Pages Router):**
```typescript
<NextSeo
  title="Page Title"
  description="..."
  canonical="https://..."
  openGraph={{...}}
  twitter={{...}}
/>
```

**After (App Router):**
```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: '...',
  alternates: { canonical: 'https://...' },
  openGraph: {...},
  twitter: {...},
}
```

For dynamic pages, use `generateMetadata()` function instead of export.

## JSON-LD Structured Data

Keep in component JSX (not in metadata):
```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
/>
```

## Configuration Changes

### Files to Remove:
- `/src/pages/` directory (entire)
- `next-sitemap.config.js`

### package.json Changes:
- Remove: `"postbuild": "next-sitemap"` script
- Remove: `next-sitemap` dependency
- Update: `"build"` script to include RSS generation

### Files to Keep (No Changes):
- `next.config.js` - App Router compatible as-is
- `tsconfig.json` - Works with App Router
- `/src/utils/mdx.ts` - Keep existing MDX utilities
- `/src/utils/generate-rss-feed.ts` - Keep RSS generation logic
- All components (CodeBlock, Pre, MDXImage, Layout, etc.)
- All styles (blog.css, globals.css, styles.css)

## Implementation Order

1. **Phase 1 - Foundation:**
   - Create `/src/app/layout.tsx`
   - Create `/src/app/providers.tsx`
   - Create `/src/app/analytics.tsx`
   - Create `/src/app/sitemap.ts`
   - Create `/src/app/robots.ts`

2. **Phase 2 - Static Pages:**
   - Create `/src/app/page.tsx` (home)
   - Create `/src/app/about/page.tsx`
   - Create `/src/app/linktree/page.tsx` (with client wrapper)

3. **Phase 3 - Blog:**
   - Create `/src/app/blog/page.tsx` (with client wrapper for search)
   - Create `/src/app/blog/[slug]/page.tsx` (with client wrapper for navigation)

4. **Phase 4 - RSS & Cleanup:**
   - Create `/src/utils/generate-rss-script.ts`
   - Update `package.json` scripts
   - Remove `next-sitemap` package
   - Remove `/src/pages` directory
   - Remove `next-sitemap.config.js`

5. **Phase 5 - Validation:**
   - Test build succeeds
   - Verify sitemap.xml generated
   - Verify robots.txt generated
   - Verify RSS feed generated
   - Check all SEO tags (OpenGraph, Twitter, canonical)
   - Verify structured data with Google Rich Results Test
   - Test analytics tracking
   - Test dark mode theme

## SEO Validation Checklist

For each page verify:
- ✅ `<title>` tag correct
- ✅ `<meta name="description">` present
- ✅ Canonical URL set
- ✅ OpenGraph tags (og:title, og:description, og:image, og:url, og:type)
- ✅ Twitter Card tags (twitter:card, twitter:site, twitter:creator, twitter:image)
- ✅ JSON-LD structured data valid
- ✅ Keywords meta (blog posts only)
- ✅ Favicon links present

**Tools:**
- [OpenGraph Preview](https://www.opengraph.xyz/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| SEO metadata loss | Use comprehensive checklist, compare before/after |
| Analytics breaks | Test PostHog events, verify GTM dataLayer |
| MDX rendering issues | Test all blog posts individually |
| Theme switching breaks | Test dark/light mode toggle, localStorage |
| Sitemap format changes | Compare old vs new sitemap.xml side-by-side |
| Client component boundaries | Keep Server Components as default, only mark 'use client' when necessary |

## Key Files Reference

**Critical files to understand:**
- `/src/pages/_app.tsx` - Analytics setup, fonts, providers
- `/src/pages/blog/[slug].tsx` - MDX rendering, SEO pattern
- `/src/utils/mdx.ts` - Post fetching and serialization
- `/src/components/Layout/Layout.tsx` - Theme handling (needs client wrapper)

**Total files to create:** ~15 new files
**Total files to remove:** ~7 old files + next-sitemap package

## Success Criteria

- ✅ All pages render correctly
- ✅ All SEO metadata preserved (compare with Pages Router)
- ✅ Sitemap.xml generated with all URLs
- ✅ Robots.txt generated
- ✅ RSS feed generated
- ✅ Analytics tracking works (PostHog, GA, GTM, Clarity)
- ✅ Dark mode theme toggle works
- ✅ Blog search/filter works
- ✅ Blog navigation (prev/next) works
- ✅ MDX code highlighting works
- ✅ Build completes successfully
- ✅ No console errors in browser
