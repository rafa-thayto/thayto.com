import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, locales, type Locale } from '@/i18n/config'
import {
  generateHomeMarkdown,
  generateBlogIndexMarkdown,
  generateBlogPostMarkdown,
  generateAboutMarkdown,
  generateBooksMarkdown,
  generateHobbiesMarkdown,
  generateLinktreeMarkdown,
} from '@/utils/markdown-response'

const MARKDOWN_HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
}

function markdownResponse(content: string) {
  return new NextResponse(content, { headers: MARKDOWN_HEADERS })
}

// next.config.js rewrites preserve the ORIGINAL request URL in nextUrl
// (destination query params never reach searchParams), so /<page>.md
// requests carry their page and locale in the pathname itself.
function fromMdPathname(
  pathname: string,
): { path: string; locale: string } | null {
  if (!pathname.endsWith('.md')) return null
  const segments = pathname.replace(/\.md$/, '').split('/')
  const hasLocalePrefix =
    locales.includes(segments[1] as Locale) && segments[1] !== defaultLocale
  const rest = `/${segments.slice(hasLocalePrefix ? 2 : 1).join('/')}`
  return {
    path: rest === '/index' ? '/' : rest,
    locale: hasLocalePrefix ? segments[1] : defaultLocale,
  }
}

export async function GET(request: NextRequest) {
  const md = fromMdPathname(request.nextUrl.pathname)
  // Headers are set by middleware rewrite; search params work for direct API calls
  const pagePath =
    md?.path ||
    request.headers.get('x-markdown-path') ||
    request.nextUrl.searchParams.get('path') ||
    '/'
  const locale =
    md?.locale ||
    request.headers.get('x-markdown-locale') ||
    request.nextUrl.searchParams.get('locale') ||
    'pt'

  // Normalize path
  const normalizedPath = pagePath === '' ? '/' : pagePath

  try {
    // Home
    if (normalizedPath === '/') {
      return markdownResponse(generateHomeMarkdown(locale))
    }

    // Blog index
    if (normalizedPath === '/blog') {
      return markdownResponse(generateBlogIndexMarkdown(locale))
    }

    // Blog post
    const blogPostMatch = normalizedPath.match(/^\/blog\/([a-zA-Z0-9_-]+)$/)
    if (blogPostMatch) {
      const slug = blogPostMatch[1]
      const content = await generateBlogPostMarkdown(slug, locale)
      return markdownResponse(content)
    }

    // About
    if (normalizedPath === '/about') {
      return markdownResponse(generateAboutMarkdown(locale))
    }

    // Books
    if (normalizedPath === '/books') {
      return markdownResponse(generateBooksMarkdown(locale))
    }

    // Hobbies
    if (normalizedPath === '/hobbies') {
      return markdownResponse(generateHobbiesMarkdown(locale))
    }

    // Linktree
    if (normalizedPath === '/linktree') {
      return markdownResponse(generateLinktreeMarkdown())
    }

    return NextResponse.json(
      { error: 'No markdown representation available for this page' },
      { status: 404 },
    )
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      'code' in err &&
      (err as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }
    throw err
  }
}
