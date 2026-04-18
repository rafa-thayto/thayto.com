import { NextResponse } from 'next/server'

const AI_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'FacebookBot',
  'Bytespider',
  'Applebot-Extended',
  'cohere-ai',
  'Amazonbot',
  'Meta-ExternalAgent',
]

export async function GET() {
  const aiCrawlerBlocks = AI_CRAWLERS.map(
    (ua) => `User-agent: ${ua}\nAllow: /\nCrawl-delay: 2`,
  ).join('\n\n')

  const content = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /_next/',
    'Disallow: /static/temp/',
    'Content-Signal: ai-train=no, search=yes, ai-input=no',
    '',
    aiCrawlerBlocks,
    '',
    'Sitemap: https://thayto.com/sitemap.xml',
    'Host: https://thayto.com',
    '',
  ].join('\n')

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
