import { Layout } from '@/components'
import { Metadata } from 'next'
import { getPosts } from '@/utils/mdx'
import { getYearsOfProfessionalExperience } from '@/constants'
import { HomeContent } from './home-content'
import { getTranslations } from 'next-intl/server'
import { Locale, locales } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { SITE_URL } from '@/utils/constants'
import {
  SCHEMA_CONTEXT,
  TWITTER_CARD,
  SOCIAL_LINKS,
  PROFILE_IMAGE,
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
  const t = await getTranslations({ locale, namespace: 'metadata.home' })
  const years = getYearsOfProfessionalExperience()
  const description = t('description', { years })
  const canonicalUrl = toCanonicalUrl(validLocale, '/')

  return {
    title: t('title'),
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages('/'),
      types: { 'text/markdown': canonicalUrl },
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: t('title'),
      description,
      locale: toOgLocale(validLocale),
      alternateLocale: toAlternateOgLocale(validLocale),
      images: [
        {
          url: `${SITE_URL}/static/images/seo-card-home.png`,
          type: 'image/png',
        },
      ],
      siteName: 'Thayto.com',
    },
    twitter: TWITTER_CARD,
  }
}

export default async function IndexPage({ params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const validLocale = locale as Locale
  const posts = getPosts(locale)
  const years = getYearsOfProfessionalExperience()
  const t = await getTranslations({ locale, namespace: 'metadata.home' })
  const description = t('description', { years })
  const homeUrl = toCanonicalUrl(validLocale, '/')

  const personSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Person' as const,
    '@id': `${SITE_URL}/#person`,
    name: 'Rafael Thayto',
    url: SITE_URL,
    image: { ...PROFILE_IMAGE, caption: 'Rafael Thayto Profile Picture' },
    jobTitle: 'Senior Software Engineer',
    description,
    sameAs: [...SOCIAL_LINKS],
    knowsAbout: [
      'TypeScript',
      'Next.js',
      'React',
      'Node.js',
      'Microservices',
      'Software Architecture',
      'Full-Stack Development',
      'Web Performance',
      'PWA Development',
      'SEO',
    ],
    knowsLanguage: [
      { '@type': 'Language', name: 'Portuguese', alternateName: 'pt' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
  }

  const organizationSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': ['Organization', 'Brand'] as const,
    '@id': `${SITE_URL}/#organization`,
    name: 'Rafael Thayto',
    url: SITE_URL,
    logo: { ...PROFILE_IMAGE },
    founder: PERSON_REF,
    sameAs: [...SOCIAL_LINKS],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'professional inquiries',
      url: `${SITE_URL}/linktree`,
    },
    description:
      validLocale === 'pt'
        ? 'Blog sobre desenvolvimento de software, TypeScript, Next.js e arquitetura'
        : 'Blog about software development, TypeScript, Next.js, and architecture',
  }

  const webPageSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebPage' as const,
    '@id': homeUrl,
    url: homeUrl,
    name: 'Rafael Thayto - Home',
    description,
    inLanguage: toLanguageTag(validLocale),
    author: PERSON_REF,
    image: { ...PROFILE_IMAGE, caption: 'Rafael Thayto Profile Picture' },
    breadcrumb: breadcrumbSchema(validLocale, [{ name: 'Home', path: '/' }]),
  }

  return (
    <Layout>
      <JsonLd data={personSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={webPageSchema} />

      <main className="max-w-4xl mx-auto bg-neutral-50 dark:bg-black py-4 px-4 sm:px-24">
        <HomeContent posts={posts} />
      </main>
    </Layout>
  )
}
