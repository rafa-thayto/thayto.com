import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/utils/constants'
import { SCHEMA_CONTEXT, JsonLd } from '@/utils/seo'
import { getPosts } from '@/utils/mdx'
import { CommandPalette } from '@/components/command-palette'
import { PosthogLocaleRegister } from '@/components/posthog-locale-register'
import { getBooks } from './books/books-data'

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  // Reject unknown locales, then opt this segment into static rendering:
  // setRequestLocale lets next-intl resolve the locale from the route param at
  // build time instead of reading request headers (which forces dynamic).
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  const messages = await getMessages()

  // Lightweight post metadata for the cmd+k palette — computed at build time
  // (getPosts is fs-based and server-only), serialized as props to the client.
  const palettePosts = getPosts(locale).map((post) => ({
    title: post.data.title,
    slug: post.filePath.replace(/\.mdx?$/, ''),
    tags: post.data.tags ?? [],
  }))

  // Lightweight book metadata for the cmd+k palette. getBooks() is the same
  // 24h-cached server read the /books page uses, so this adds no per-request DB
  // cost. Title is resolved to the active locale up front.
  const paletteBooks = (await getBooks()).map((book) => ({
    id: book.id,
    title: locale === 'pt' ? book.title : book.englishTitle,
    author: book.author,
    amazonUrl: book.amazonUrl,
  }))

  const websiteSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite' as const,
    '@id': `${SITE_URL}/#website`,
    name: 'Rafael Thayto',
    url: SITE_URL,
    inLanguage: ['pt-BR', 'en-US'],
    potentialAction: {
      '@type': 'SearchAction' as const,
      target: `${SITE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <JsonLd data={websiteSchema} />
      <PosthogLocaleRegister locale={locale} />
      <CommandPalette posts={palettePosts} books={paletteBooks} />
      {children}
    </NextIntlClientProvider>
  )
}
