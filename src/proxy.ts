import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { defaultLocale, locales, type Locale } from './i18n/config'

const intlMiddleware = createMiddleware(routing)

function detectLocale(pathname: string): {
  locale: Locale
  pathWithoutLocale: string
} {
  const segments = pathname.split('/')
  const firstSegment = segments[1]

  if (
    locales.includes(firstSegment as Locale) &&
    firstSegment !== defaultLocale
  ) {
    return {
      locale: firstSegment as Locale,
      pathWithoutLocale: segments.slice(2).join('/')
        ? `/${segments.slice(2).join('/')}`
        : '/',
    }
  }

  return { locale: defaultLocale, pathWithoutLocale: pathname }
}

export default function proxy(request: NextRequest) {
  const accept = request.headers.get('accept') || ''

  if (accept.includes('text/markdown')) {
    const { locale, pathWithoutLocale } = detectLocale(request.nextUrl.pathname)
    const url = request.nextUrl.clone()
    url.pathname = '/api/markdown'
    url.searchParams.set('path', pathWithoutLocale)
    url.searchParams.set('locale', locale)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-markdown-path', pathWithoutLocale)
    requestHeaders.set('x-markdown-locale', locale)
    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    })
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|socket\\.io|.*\\..*).*)'],
}
