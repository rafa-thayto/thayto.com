import { Layout } from '@/components'
import { Metadata } from 'next'
import { getYearsOfProfessionalExperience } from '@/constants'
import { SITE_URL } from '@/utils/constants'
import { Locale } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'
import {
  TWITTER_CARD,
  toOgLocale,
  toAlternateOgLocale,
  toCanonicalUrl,
  alternateLanguages,
  profilePageSchema,
  JsonLd,
} from '@/utils/seo'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const validLocale = locale as Locale
  const t = await getTranslations({ locale, namespace: 'metadata.about' })
  const canonicalUrl = toCanonicalUrl(validLocale, '/about')

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages('/about'),
      types: { 'text/markdown': canonicalUrl },
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: t('title'),
      description: t('description'),
      locale: toOgLocale(validLocale),
      alternateLocale: toAlternateOgLocale(validLocale),
      images: [
        {
          url: `${SITE_URL}/static/images/seo-card-default.png`,
          type: 'image/png',
        },
      ],
      siteName: 'Thayto.com',
    },
    twitter: TWITTER_CARD,
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const validLocale = locale as Locale
  const t = await getTranslations({ locale, namespace: 'about' })
  const years = getYearsOfProfessionalExperience()

  const schema = profilePageSchema(validLocale, {
    path: '/about',
    name: 'Rafael Thayto - About',
    breadcrumbLabel: 'About',
  })

  return (
    <Layout>
      <JsonLd data={schema} />
      <main className="max-w-6xl mx-auto shadow bg-slate-50 dark:bg-black  py-6 px-4 sm:px-12 mt-6">
        <h1 className="text-xl text-slate-900 dark:text-white font-bold mt-4">
          {t('title')}
        </h1>

        <div className="mt-6">
          <p className="text-base font-serif text-slate-800 dark:text-gray-100">
            {t('bio.paragraph1', { years })}
          </p>
          <p className="text-base font-serif text-slate-800 dark:text-gray-100 mt-2">
            {t('bio.paragraph2')}
          </p>
        </div>

        <p className="text-xl font-serif text-slate-800 dark:text-gray-100 mt-10">
          {t('bio.inProgress')}
        </p>
      </main>
    </Layout>
  )
}
