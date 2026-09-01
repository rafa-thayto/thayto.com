import { Layout } from '@/components'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Locale, locales } from '@/i18n/config'
import { SITE_URL } from '@/utils/constants'
import { getNotes } from '@/utils/notes'
import {
  SCHEMA_CONTEXT,
  TWITTER_CARD,
  PERSON_REF,
  toOgLocale,
  toAlternateOgLocale,
  toCanonicalUrl,
  toLanguageTag,
  alternateLanguages,
  breadcrumbSchema,
  JsonLd,
} from '@/utils/seo'
import { NotesIndex } from './notes-index'

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    return {}
  }

  const validLocale = locale as Locale
  const t = await getTranslations({ locale, namespace: 'metadata.notes' })
  const canonicalUrl = toCanonicalUrl(validLocale, '/notes')

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages('/notes'),
      types: { 'text/markdown': `${canonicalUrl}.md` },
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: t('title'),
      description: t('description'),
      locale: toOgLocale(validLocale),
      alternateLocale: toAlternateOgLocale(validLocale),
      siteName: 'Thayto.com',
    },
    twitter: TWITTER_CARD,
  }
}

export default async function NotesPage({ params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const validLocale = locale as Locale
  const t = await getTranslations({ locale, namespace: 'notes' })
  const tMeta = await getTranslations({ locale, namespace: 'metadata.notes' })
  const notes = getNotes(locale)
  const canonicalUrl = toCanonicalUrl(validLocale, '/notes')

  const collectionSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'CollectionPage' as const,
    '@id': canonicalUrl,
    url: canonicalUrl,
    name: t('label'),
    description: tMeta('description'),
    inLanguage: toLanguageTag(validLocale),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    author: PERSON_REF,
    breadcrumb: breadcrumbSchema(validLocale, [
      { name: 'Home', path: '/' },
      { name: t('label'), path: '/notes' },
    ]),
    hasPart: {
      '@type': 'ItemList',
      itemListElement: notes.map((note, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: toCanonicalUrl(validLocale, `/notes/${note.number}`),
        name: `${t('label')} #${note.number}`,
      })),
    },
  }

  return (
    <Layout>
      <JsonLd data={collectionSchema} />
      <h1 className="sr-only">{t('label')}</h1>
      <NotesIndex numbers={notes.map((note) => note.number)} />
    </Layout>
  )
}
