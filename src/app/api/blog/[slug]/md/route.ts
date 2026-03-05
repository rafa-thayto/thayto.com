import { getPostsPath } from '@/constants'
import { defaultLocale, locales, type Locale } from '@/i18n/config'
import { promises as fs } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1]
  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }
  return defaultLocale
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const locale = getLocaleFromPath(request.nextUrl.pathname)

  const postsPath = getPostsPath(locale)
  const filePath = path.join(postsPath, `${slug}.mdx`)

  try {
    const content = await fs.readFile(filePath, 'utf-8')

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `inline; filename="${slug}.md"`,
      },
    })
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      'code' in err &&
      (err as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    throw err
  }
}
