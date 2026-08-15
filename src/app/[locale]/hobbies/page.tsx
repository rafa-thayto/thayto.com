import { Layout } from '@/components'
import { Metadata } from 'next'
import { SITE_URL } from '@/utils/constants'
import { Locale, locales } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
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

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    return {}
  }

  const validLocale = locale as Locale
  const t = await getTranslations({ locale, namespace: 'metadata.hobbies' })
  const canonicalUrl = toCanonicalUrl(validLocale, '/hobbies')

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages('/hobbies'),
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

export default async function HobbiesPage({ params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const validLocale = locale as Locale
  const t = await getTranslations({ locale, namespace: 'hobbies' })
  const tMeta = await getTranslations({ locale, namespace: 'metadata.hobbies' })
  const canonicalUrl = toCanonicalUrl(validLocale, '/hobbies')

  const webPageSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebPage' as const,
    '@id': canonicalUrl,
    url: canonicalUrl,
    name: 'Rafael Thayto - Hobbies',
    description: tMeta('description'),
    inLanguage: toLanguageTag(validLocale),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    author: PERSON_REF,
    breadcrumb: breadcrumbSchema(validLocale, [
      { name: 'Home', path: '/' },
      { name: 'Hobbies', path: '/hobbies' },
    ]),
  }

  return (
    <Layout>
      <JsonLd data={webPageSchema} />

      <main className="max-w-4xl mx-auto bg-neutral-50 dark:bg-black py-4 px-4 sm:px-24">
        <h1 className="text-2xl text-gray-900 dark:text-white font-bold mt-2">
          {t('title')}
        </h1>

        <section className="text-sm leading-normal font-normal font-sans mt-6 flex flex-col gap-4 text-gray-700 dark:text-gray-200">
          <p>{t('paragraph1')}</p>
          <p>{t('paragraph2')}</p>
        </section>
      </main>
    </Layout>
  )
}
