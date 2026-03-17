import { Layout } from '@/components'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import booksData from '@/data/books.json'
import { Book } from '@/data/books.types'
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
  const t = await getTranslations({ locale, namespace: 'metadata.books' })

  const canonicalUrl =
    locale === 'pt' ? 'https://thayto.com/books' : 'https://thayto.com/en/books'

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        pt: 'https://thayto.com/books',
        en: 'https://thayto.com/en/books',
      },
      types: {
        'text/markdown': canonicalUrl,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: canonicalUrl,
      type: 'website',
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
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

  const books: Book[] = booksData as Book[]

  // Safe: JSON-LD structured data with controlled content for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: locale === 'pt' ? 'Livros' : 'Books',
    description:
      locale === 'pt'
        ? 'Minha pequena biblioteca pessoal'
        : 'My own little library',
    url:
      locale === 'pt'
        ? 'https://thayto.com/books'
        : 'https://thayto.com/en/books',
    author: {
      '@type': 'Person',
      name: 'Rafael Thayto',
      url: 'https://thayto.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: books.length,
      itemListElement: books.map((book, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Book',
          name: locale === 'pt' ? book.title : book.englishTitle,
          author: {
            '@type': 'Person',
            name: book.author,
          },
        },
      })),
    },
  }

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Suspense fallback={null}>
        <BooksContent books={books} locale={locale} />
      </Suspense>
    </Layout>
  )
}
