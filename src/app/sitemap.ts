import { MetadataRoute } from 'next'
import { getPosts } from '@/utils/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts()

  const blogPosts = posts.map((post) => ({
    url: `https://thayto.com${post.data.href}`,
    lastModified: new Date(post.data.modifiedTime),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const staticPages = [
    {
      url: 'https://thayto.com/',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: 'https://thayto.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: 'https://thayto.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://thayto.com/linktree',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  return [...staticPages, ...blogPosts]
}
