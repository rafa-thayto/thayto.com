import { NextRequest, NextResponse } from 'next/server'
import {
  generateHomeMarkdown,
  generateBlogIndexMarkdown,
  generateBlogPostMarkdown,
  generateAboutMarkdown,
  generateBooksMarkdown,
  generateLinktreeMarkdown,
} from '@/utils/markdown-response'

const MARKDOWN_HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
}

function markdownResponse(content: string) {
  return new NextResponse(content, { headers: MARKDOWN_HEADERS })
}

export async function GET(request: NextRequest) {
  // Headers are set by middleware rewrite; search params work for direct API calls
  const pagePath =
    request.headers.get('x-markdown-path') ||
    request.nextUrl.searchParams.get('path') ||
    '/'
  const locale =
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
