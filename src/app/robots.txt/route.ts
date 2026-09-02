import { NextResponse } from 'next/server'
import { SITE_URL } from '@/utils/constants'

// Every AI crawler does one of three jobs: search indexing, on-demand user
// fetch, or model training. Search and user-fetch bots are the citation
// pipeline for ChatGPT search, Claude, Perplexity, Copilot and Gemini, so they
// are listed explicitly and never blocked. Training bots are allowed too:
// the site opts in to everything (see the Content-Signal line below).
const SEARCH_AND_USER_BOTS = [
  'Googlebot',
  'Bingbot',
  'Applebot',
  'DuckDuckBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Amazonbot',
]

const TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Meta-ExternalAgent',
  'FacebookBot',
  'Bytespider',
  'cohere-ai',
]

// A crawler that matches a named group ignores the "*" group entirely, so
// every named group repeats the same rules (including the Content-Signal
// consent) instead of inheriting them.
// /_next/ is deliberately NOT disallowed: it holds the JS, CSS and optimized
// images Googlebot needs to render pages, and blocking it hurts indexing.
const RULES = [
  'Allow: /',
  'Disallow: /api/',
  'Content-Signal: ai-train=yes, search=yes, ai-input=yes',
]

const group = (userAgents: string[]) =>
  [...userAgents.map((ua) => `User-agent: ${ua}`), ...RULES].join('\n')

export async function GET() {
  const content = [
    '# Search engines and AI answer engines (citation pipeline)',
    group(SEARCH_AND_USER_BOTS),
    '',
    '# AI training crawlers (allowed by policy)',
    group(TRAINING_BOTS),
    '',
    '# Everyone else',
    group(['*']),
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
