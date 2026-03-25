import { Layout } from '@/components'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import booksData from '@/data/books.json'
import { Book } from '@/data/books.types'
import { Locale } from '@/i18n/config'
import { SITE_URL } from '@/utils/constants'
import {
  SCHEMA_CONTEXT,
  PERSON_REF,
  toCanonicalUrl,
  toOgLocale,
  alternateLanguages,
  JsonLd,
} from '@/utils/seo'
import { BooksContent } from './books-content'

type Props = {
  params: Promise<{ locale: string }>
}

// Static params for both locales
export function generateStaticParams() {
  return [{ locale: 'pt' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const validLocale = locale as Locale
  const t = await getTranslations({ locale, namespace: 'metadata.books' })
  const canonicalUrl = toCanonicalUrl(validLocale, '/books')

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages('/books'),
      types: { 'text/markdown': canonicalUrl },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: canonicalUrl,
      type: 'website',
      locale: toOgLocale(validLocale),
      siteName: 'Rafael Thayto',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  }
}

export default async function BooksPage({ params }: Props) {
  const { locale } = await params
  const validLocale = locale as Locale

  const books: Book[] = booksData as Book[]

  const structuredData = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'CollectionPage' as const,
    name: validLocale === 'pt' ? 'Livros' : 'Books',
    description:
      validLocale === 'pt'
        ? 'Minha pequena biblioteca pessoal'
        : 'My own little library',
    url: toCanonicalUrl(validLocale, '/books'),
    author: {
      '@type': 'Person' as const,
      name: 'Rafael Thayto',
      url: SITE_URL,
      ...PERSON_REF,
    },
    mainEntity: {
      '@type': 'ItemList' as const,
      numberOfItems: books.length,
      itemListElement: books.map((book, index) => ({
        '@type': 'ListItem' as const,
        position: index + 1,
        item: {
          '@type': 'Book' as const,
          name: validLocale === 'pt' ? book.title : book.englishTitle,
          author: {
            '@type': 'Person' as const,
            name: book.author,
          },
        },
      })),
    },
  }

  return (
    <Layout>
      <JsonLd data={structuredData} />
      <Suspense fallback={null}>
        <BooksContent books={books} locale={locale} />
      </Suspense>
    </Layout>
  )
}
