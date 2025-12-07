# App Router Migration - Checkpoints

**Migration Start Date:** 2025-12-07
**Status:** Not Started

---

## Phase 1: Foundation ⬜ NOT STARTED

### 1.1 Root Layout
- [ ] Create `/src/app/layout.tsx`
  - [ ] Configure fonts (Poppins, Lora)
  - [ ] Add global metadata (robots, verification, favicons, RSS)
  - [ ] Set HTML structure (pt-BR lang, dark mode class)
  - [ ] Import PostHog provider
  - [ ] Import analytics scripts
  - [ ] Import global CSS files

### 1.2 Client Components for Analytics
- [ ] Create `/src/app/providers.tsx` (PostHog wrapper)
  - [ ] Mark with 'use client'
  - [ ] Initialize posthog with env vars
  - [ ] Export PostHogProvider component

- [ ] Create `/src/app/analytics.tsx` (Analytics scripts)
  - [ ] Mark with 'use client'
  - [ ] Add Microsoft Clarity script
  - [ ] Add Google Analytics script
  - [ ] Add Google Tag Manager script
  - [ ] Add GTM noscript fallback

### 1.3 Sitemap & Robots
- [ ] Create `/src/app/sitemap.ts`
  - [ ] Import getPosts() utility
  - [ ] Generate static pages entries
  - [ ] Generate blog posts entries
  - [ ] Return MetadataRoute.Sitemap format

- [ ] Create `/src/app/robots.ts`
  - [ ] Configure user agent rules
  - [ ] Add sitemap URL reference

**Phase 1 Validation:**
- [ ] Run `bun dev` and verify no errors
- [ ] Check `/sitemap.xml` generates correctly
- [ ] Check `/robots.txt` generates correctly

---

## Phase 2: Static Pages ⬜ NOT STARTED

### 2.1 Home Page
- [ ] Create `/src/app/page.tsx`
  - [ ] Add metadata export with SEO tags
  - [ ] Call getPosts() directly in server component
  - [ ] Add JSON-LD structured data (WebPage schema)
  - [ ] Implement page layout

- [ ] Create `/src/app/home-content.tsx` (client component)
  - [ ] Mark with 'use client'
  - [ ] Implement confetti animation logic
  - [ ] Implement hover effects for profile
  - [ ] Implement tooltip interactions

### 2.2 About Page
- [ ] Create `/src/app/about/page.tsx`
  - [ ] Add metadata export with SEO tags
  - [ ] Copy content from old about page
  - [ ] Verify getYearsOfProfessionalExperience() works

### 2.3 Linktree Page
- [ ] Create `/src/app/linktree/page.tsx`
  - [ ] Add metadata export with SEO tags
  - [ ] Set up page structure

- [ ] Create `/src/app/linktree/linktree-content.tsx` (client component)
  - [ ] Mark with 'use client'
  - [ ] Implement confetti animation
  - [ ] Implement profile hover effects
  - [ ] Add PostHog tracking for link clicks

**Phase 2 Validation:**
- [ ] Navigate to `/` and verify page renders
- [ ] Navigate to `/about` and verify page renders
- [ ] Navigate to `/linktree` and verify page renders
- [ ] Test confetti animations work
- [ ] Verify all SEO meta tags present (view source)

---

## Phase 3: Blog Pages ⬜ NOT STARTED

### 3.1 Blog Index Page
- [ ] Create `/src/app/blog/page.tsx`
  - [ ] Add metadata export with SEO tags
  - [ ] Call getPosts() directly in server component
  - [ ] Add JSON-LD structured data (Blog schema)
  - [ ] Set up page layout

- [ ] Create `/src/app/blog/blog-content.tsx` (client component)
  - [ ] Mark with 'use client'
  - [ ] Implement useSearchParams for tag filtering
  - [ ] Implement blog card grid
  - [ ] Add PostHog tracking for card clicks

### 3.2 Individual Blog Post Page
- [ ] Create `/src/app/blog/[slug]/page.tsx`
  - [ ] Implement generateStaticParams()
  - [ ] Implement generateMetadata()
  - [ ] Call getMdxSerializedPost() in server component
  - [ ] Add JSON-LD structured data (BlogPosting schema)
  - [ ] Render MDXRemote with custom components
  - [ ] Set up page layout

- [ ] Create `/src/app/blog/[slug]/blog-post-content.tsx` (client component)
  - [ ] Mark with 'use client'
  - [ ] Implement prev/next navigation with PostHog tracking
  - [ ] Implement back button with PostHog tracking

**Phase 3 Validation:**
- [ ] Navigate to `/blog` and verify listing renders
- [ ] Test tag filtering with query params
- [ ] Navigate to any blog post and verify it renders
- [ ] Verify MDX content renders correctly
- [ ] Verify code syntax highlighting works
- [ ] Verify MDX images load with blur placeholders
- [ ] Test prev/next post navigation
- [ ] Verify all SEO meta tags present (view source)
- [ ] Test JSON-LD structured data with Google Rich Results Test

---

## Phase 4: RSS & Configuration ⬜ NOT STARTED

### 4.1 RSS Generation Script
- [ ] Create `/src/utils/generate-rss-script.ts`
  - [ ] Import generateRssFeed utility
  - [ ] Add error handling
  - [ ] Add success logging

### 4.2 Package.json Updates
- [ ] Update build script to: `"build": "next build && bun run generate-rss"`
- [ ] Add generate-rss script: `"generate-rss": "bun run src/utils/generate-rss-script.ts"`
- [ ] Remove postbuild script
- [ ] Remove next-sitemap dependency

**Phase 4 Validation:**
- [ ] Run `bun run generate-rss` and verify RSS feed created
- [ ] Verify `/public/rss.xml` has correct content
- [ ] Run full build and verify RSS generated automatically

---

## Phase 5: Cleanup ⬜ NOT STARTED

### 5.1 Remove Old Files
- [ ] Remove `/src/pages/_app.tsx`
- [ ] Remove `/src/pages/_document.tsx`
- [ ] Remove `/src/pages/index.tsx`
- [ ] Remove `/src/pages/about.tsx`
- [ ] Remove `/src/pages/linktree.tsx`
- [ ] Remove `/src/pages/blog/index.tsx`
- [ ] Remove `/src/pages/blog/[slug].tsx`
- [ ] Remove `/src/pages/blog/new.tsx`
- [ ] Remove entire `/src/pages` directory
- [ ] Remove `next-sitemap.config.js`

### 5.2 Final Cleanup
- [ ] Run `bun install` to update lock file
- [ ] Remove any unused imports or dead code
- [ ] Update .gitignore if needed

**Phase 5 Validation:**
- [ ] Verify project structure is clean
- [ ] Run `bun lint` and fix any issues
- [ ] Run `bun check-types` and fix any type errors

---

## Phase 6: Final Validation & Testing ⬜ NOT STARTED

### 6.1 Build & Deploy Testing
- [ ] Run `bun build` successfully
- [ ] Run `bun start` and verify production build works
- [ ] Test all routes work in production mode

### 6.2 SEO Validation
Run through SEO checklist for each page:

**Home Page (/):**
- [ ] Title tag correct
- [ ] Meta description present
- [ ] Canonical URL correct
- [ ] OpenGraph tags complete
- [ ] Twitter card tags complete
- [ ] JSON-LD WebPage schema valid
- [ ] Favicon links present

**Blog Index (/blog):**
- [ ] Title tag correct
- [ ] Meta description present
- [ ] Canonical URL correct
- [ ] OpenGraph tags complete
- [ ] Twitter card tags complete
- [ ] JSON-LD Blog schema valid

**Blog Posts (/blog/[slug]):**
- [ ] Title tag correct (tested on 3+ posts)
- [ ] Meta description present
- [ ] Keywords meta tag present
- [ ] Canonical URL correct
- [ ] OpenGraph tags complete (including article metadata)
- [ ] Twitter card tags complete
- [ ] JSON-LD BlogPosting schema valid

**About Page (/about):**
- [ ] All SEO tags present and correct

**Linktree Page (/linktree):**
- [ ] All SEO tags present and correct

### 6.3 Analytics Testing
- [ ] PostHog events fire correctly (check dashboard)
- [ ] Google Analytics pageviews tracked (check real-time)
- [ ] Google Tag Manager events work
- [ ] Microsoft Clarity tracking active
- [ ] Vercel Analytics working

### 6.4 Functionality Testing
- [ ] Dark/light theme toggle works
- [ ] Theme persists on page refresh
- [ ] System theme preference detected
- [ ] Blog tag filtering works
- [ ] Blog post prev/next navigation works
- [ ] Confetti animations trigger on home page
- [ ] Confetti animations trigger on linktree page
- [ ] All images load with blur placeholders
- [ ] Code syntax highlighting works
- [ ] MDX heading anchor links work

### 6.5 Sitemap & RSS Verification
- [ ] Sitemap.xml accessible at `/sitemap.xml`
- [ ] Sitemap contains all expected URLs
- [ ] Sitemap format matches previous structure
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Robots.txt references sitemap correctly
- [ ] RSS feed accessible at `/rss.xml`
- [ ] RSS feed contains all blog posts
- [ ] RSS feed format correct

### 6.6 Performance Testing
- [ ] Run Lighthouse audit (target: 90+ all categories)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Total Blocking Time < 200ms
- [ ] Cumulative Layout Shift < 0.1

### 6.7 External Validation Tools
- [ ] Test with [OpenGraph Preview](https://www.opengraph.xyz/)
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verify structured data with Schema.org validator

---

## Migration Complete! 🎉

**Completion Date:** _TBD_

### Post-Migration Tasks
- [ ] Deploy to production
- [ ] Monitor analytics for any issues
- [ ] Monitor error logs for 24-48 hours
- [ ] Update documentation if needed
- [ ] Submit updated sitemap to Google Search Console

---

## Notes & Issues

_(Add any notes, blockers, or issues encountered during migration)_

---

## Rollback Plan

If critical issues occur:
1. Revert to last commit before migration
2. Run `bun install` to restore packages
3. Deploy previous version
4. Review migration issues before retry
