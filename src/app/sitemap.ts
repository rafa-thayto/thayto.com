import { MetadataRoute } from 'next'
import { getPosts } from '@/utils/mdx'
import { getNotes } from '@/utils/notes'
import { defaultLocale } from '@/i18n/config'

// Helper function to build URLs based on locale
const buildUrl = (path: string, locale: string): string => {
  const prefix = locale === 'pt' ? '' : `${locale}/`
  return `https://thayto.com/${prefix}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  const staticPages = ['', 'blog', 'notes', 'books', 'linktree', 'hobbies']

  // Generate static pages: one entry per page per locale, so English URLs
  // are discoverable as their own <loc>, not only inside alternates.
  for (const page of staticPages) {
    const pageUrl = page === '' ? '' : `${page}`
    const alternates = {
      languages: {
        'x-default': buildUrl(pageUrl, 'pt'),
        pt: buildUrl(pageUrl, 'pt'),
        en: buildUrl(pageUrl, 'en'),
      },
    }

    for (const locale of ['pt', 'en']) {
      entries.push({
        url: buildUrl(pageUrl, locale),
        lastModified: new Date(),
        changeFrequency:
          page === '' ? 'weekly' : page === 'blog' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === 'blog' ? 0.9 : 0.8,
        alternates,
      })
    }
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

  // Notes share numbers across locales, so every number gets both alternates
  const ptNotes = getNotes('pt')
  const enNumbers = new Set(getNotes('en').map((note) => note.number))

  for (const note of ptNotes) {
    const notePath = `notes/${note.number}`
    const languages: { [key: string]: string } = {
      'x-default': buildUrl(notePath, 'pt'),
      pt: buildUrl(notePath, 'pt'),
    }
    if (enNumbers.has(note.number)) {
      languages.en = buildUrl(notePath, 'en')
    }

    for (const locale of Object.keys(languages).filter(
      (key) => key !== 'x-default',
    )) {
      entries.push({
        url: buildUrl(notePath, locale),
        lastModified: new Date(note.modifiedTime),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages },
      })
    }
  }

  return entries
}
