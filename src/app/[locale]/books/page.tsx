import { Layout } from '@/components'
import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'
import { Locale } from '@/i18n/config'
import { SITE_URL } from '@/utils/constants'
import {
  SCHEMA_CONTEXT,
  PERSON_REF,
  toCanonicalUrl,
  toOgLocale,
  toAlternateOgLocale,
  toLanguageTag,
  alternateLanguages,
  breadcrumbSchema,
  JsonLd,
} from '@/utils/seo'
import { BooksContent } from './books-content'
import { getBooks } from './books-data'

type Props = {
  params: Promise<{ locale: string }>
}

// Statically render both locales at build time and regenerate (ISR) at most
// once every 24h, so library/DB updates surface within a day without querying
// the database on every request.
export const revalidate = 86400 // 24 hours, in seconds

// Static params for both locales
export function generateStaticParams() {
  return [{ locale: 'pt' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const validLocale = locale as Locale
  setRequestLocale(validLocale)
  const t = await getTranslations({ locale, namespace: 'metadata.books' })
  const canonicalUrl = toCanonicalUrl(validLocale, '/books')

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages('/books'),
      types: { 'text/markdown': `${canonicalUrl}.md` },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: canonicalUrl,
      type: 'website',
      locale: toOgLocale(validLocale),
      alternateLocale: toAlternateOgLocale(validLocale),
      siteName: 'Rafael Thayto',
      images: [
        {
          url: `${SITE_URL}/static/images/seo-card-default.png`,
          width: 1290,
          height: 675,
          alt: t('title'),
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`${SITE_URL}/static/images/seo-card-default.png`],
    },
  }
}

export default async function BooksPage({ params }: Props) {
  const { locale } = await params
  const validLocale = locale as Locale
  setRequestLocale(validLocale)

  const books = await getBooks()

  const pageName = validLocale === 'pt' ? 'Livros' : 'Books'

  const structuredData = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'CollectionPage' as const,
    '@id': toCanonicalUrl(validLocale, '/books'),
    name: pageName,
    description:
      validLocale === 'pt'
        ? 'Minha pequena biblioteca pessoal'
        : 'My own little library',
    url: toCanonicalUrl(validLocale, '/books'),
    inLanguage: toLanguageTag(validLocale),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    breadcrumb: breadcrumbSchema(validLocale, [
      { name: 'Home', path: '/' },
      { name: pageName, path: '/books' },
    ]),
    author: {
      '@type': 'Person' as const,
      name: 'Rafael Thayto',
      url: toCanonicalUrl(validLocale, '/about'),
      ...PERSON_REF,
    },
    mainEntity: {
      '@type': 'ItemList' as const,
      numberOfItems: books.length,
      itemListElement: books.map((book, index) => {
        const bookName = validLocale === 'pt' ? book.title : book.englishTitle
        const alternateName =
          validLocale === 'pt' ? book.englishTitle : book.title
        const bookUrl =
          book.amazonUrl ||
          `${toCanonicalUrl(validLocale, '/books')}#book-${book.id}`

        const review =
          book.stars !== undefined
            ? {
                review: {
                  '@type': 'Review' as const,
                  reviewRating: {
                    '@type': 'Rating' as const,
                    ratingValue: Math.min(5, Math.max(1, book.stars)),
                    bestRating: 5,
                    worstRating: 1,
                  },
                  author: {
                    '@type': 'Person' as const,
                    name: 'Rafael Thayto',
                    url: toCanonicalUrl(validLocale, '/about'),
                  },
                },
              }
            : {}

        return {
          '@type': 'ListItem' as const,
          position: index + 1,
          item: {
            '@type': 'Book' as const,
            '@id': `${SITE_URL}/#book-${book.id}`,
            name: bookName,
            ...(alternateName && alternateName !== bookName
              ? { alternateName }
              : {}),
            author: {
              '@type': 'Person' as const,
              name: book.author,
            },
            ...(book.coverUrl ? { image: book.coverUrl } : {}),
            url: bookUrl,
            // inLanguage describes the edition Rafael read, so it is intrinsic
            // to the book — a distinct PT title means the PT edition. It must
            // not depend on which locale is rendering the page.
            inLanguage: book.title !== book.englishTitle ? 'pt-BR' : 'en',
            ...review,
          },
        }
      }),
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
