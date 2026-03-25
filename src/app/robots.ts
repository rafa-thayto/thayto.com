import { MetadataRoute } from 'next'

const AI_CRAWLERS = [
  'GPTBot',
  ['ClaudeBot', 'anthropic-ai'],
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'FacebookBot',
  'Bytespider',
  'Applebot-Extended',
  'cohere-ai',
  'Amazonbot',
  'Meta-ExternalAgent',
] as const

const aiCrawlerRules = AI_CRAWLERS.map((userAgent) => ({
  userAgent: userAgent as string | string[],
  allow: '/' as const,
  crawlDelay: 2,
}))

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/temp/'],
      },
      ...aiCrawlerRules,
    ],
    sitemap: 'https://thayto.com/sitemap.xml',
    host: 'https://thayto.com',
  }
}
