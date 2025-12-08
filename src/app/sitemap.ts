import { MetadataRoute } from 'next'
import { getPosts } from '@/utils/mdx'
import { defaultLocale } from '@/i18n/config'

// Helper function to build URLs based on locale
const buildUrl = (path: string, locale: string): string => {
  const prefix = locale === 'pt' ? '' : `${locale}/`
  return `https://thayto.com/${prefix}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  const staticPages = ['', 'blog', 'about', 'linktree']

  // Generate static pages (one entry per page with alternates)
  for (const page of staticPages) {
    const pageUrl = page === '' ? '' : `${page}`

    entries.push({
      url: buildUrl(pageUrl, 'pt'), // Default locale URL
      lastModified: new Date(),
      changeFrequency:
        page === '' ? 'weekly' : page === 'blog' ? 'weekly' : 'monthly',
      priority: page === '' ? 1.0 : page === 'blog' ? 0.9 : 0.8,
      alternates: {
        languages: {
          'x-default': buildUrl(pageUrl, 'pt'),
          pt: buildUrl(pageUrl, 'pt'),
          en: buildUrl(pageUrl, 'en'),
        },
      },
    })
  }

  // Fetch posts from both locales
  const ptPosts = getPosts('pt')
  const enPosts = getPosts('en')

  // Create a map of slug -> {pt: Post, en: Post}
  const postsBySlug = new Map<string, { pt?: any; en?: any }>()

  ptPosts.forEach((post) => {
    const slug = post.filePath.replace('.mdx', '')
    postsBySlug.set(slug, { pt: post })
  })

  enPosts.forEach((post) => {
    const slug = post.filePath.replace('.mdx', '')
    const existing = postsBySlug.get(slug)
    if (existing) {
      existing.en = post
    } else {
      postsBySlug.set(slug, { en: post })
    }
  })

  // Generate blog post URLs (one entry per post with alternates)
  for (const [slug, variants] of Array.from(postsBySlug.entries())) {
    const ptPost = variants.pt
    const enPost = variants.en

    // Use Portuguese version as default (or English if PT doesn't exist)
    const defaultPost = ptPost || enPost!

    // Build alternates object
    const languages: { [key: string]: string } = {}

    if (ptPost) {
      languages.pt = buildUrl(`blog/${slug}`, 'pt')
    }
    if (enPost) {
      languages.en = buildUrl(`blog/${slug}`, 'en')
    }

    // x-default points to pt if available, otherwise en
    languages['x-default'] = buildUrl(`blog/${slug}`, ptPost ? 'pt' : 'en')

    entries.push({
      url: buildUrl(`blog/${slug}`, ptPost ? 'pt' : 'en'),
      lastModified: new Date(defaultPost.data.modifiedTime),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages,
      },
    })
  }

  return entries
}
