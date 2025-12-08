import { Layout } from '@/components'
import { Metadata } from 'next'
import { getPosts } from '@/utils/mdx'
import { getYearsOfProfessionalExperience } from '@/constants'
import { HomeContent } from './home-content'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata.home' })
  const years = getYearsOfProfessionalExperience()
  const description = t('description', { years })

  const canonicalUrl =
    locale === 'pt' ? 'https://thayto.com/' : 'https://thayto.com/en/'

  return {
    title: t('title'),
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        pt: 'https://thayto.com/',
        en: 'https://thayto.com/en/',
      },
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: t('title'),
      description,
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      alternateLocale: locale === 'pt' ? 'en_US' : 'pt_BR',
      images: [
        {
          url: 'https://thayto.com/static/images/seo-card-home.png',
          type: 'image/png',
        },
      ],
      siteName: 'Thayto.com',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@thayto',
      creator: '@thayto',
    },
  }
}

export default async function IndexPage({ params }: Props) {
  const { locale } = await params
  const posts = getPosts(locale)
  const years = getYearsOfProfessionalExperience()
  const t = await getTranslations({ locale, namespace: 'metadata.home' })
  const description = t('description', { years })

  // Enhanced Person Schema for LLM/AI discoverability
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://thayto.com/#person',
    name: 'Rafael Thayto',
    url: 'https://thayto.com',
    image: {
      '@type': 'ImageObject',
      url: 'https://thayto.com/static/images/profile.jpg',
      width: 460,
      height: 460,
      caption: 'Rafael Thayto Profile Picture',
    },
    jobTitle: 'Senior Software Engineer',
    description: description,
    sameAs: [
      'https://github.com/rafa-thayto',
      'https://linkedin.com/in/thayto',
      'https://x.com/thayto_dev',
    ],
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

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Brand'],
    '@id': 'https://thayto.com/#organization',
    name: 'Rafael Thayto',
    url: 'https://thayto.com',
    logo: 'https://thayto.com/static/images/profile.jpg',
    founder: { '@id': 'https://thayto.com/#person' },
    sameAs: [
      'https://github.com/rafa-thayto',
      'https://linkedin.com/in/thayto',
    ],
    description:
      locale === 'pt'
        ? 'Blog sobre desenvolvimento de software, TypeScript, Next.js e arquitetura'
        : 'Blog about software development, TypeScript, Next.js, and architecture',
  }

  const webPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': locale === 'pt' ? 'https://thayto.com' : 'https://thayto.com/en',
    url: locale === 'pt' ? 'https://thayto.com' : 'https://thayto.com/en',
    name: 'Rafael Thayto - Home',
    description: description,
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en-US',
    author: { '@id': 'https://thayto.com/#person' },
    image: {
      '@type': 'ImageObject',
      url: 'https://thayto.com/static/images/profile.jpg',
      width: 460,
      height: 460,
      caption: 'Rafael Thayto Profile Picture',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item:
            locale === 'pt' ? 'https://thayto.com' : 'https://thayto.com/en',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item:
            locale === 'pt'
              ? 'https://thayto.com/blog'
              : 'https://thayto.com/en/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'LinkTree',
          item:
            locale === 'pt'
              ? 'https://thayto.com/linktree'
              : 'https://thayto.com/en/linktree',
        },
      ],
    },
  }

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData),
        }}
      />

      <main className="max-w-4xl mx-auto bg-neutral-50 dark:bg-black py-4 px-4 sm:px-24">
        <HomeContent posts={posts} />
      </main>
    </Layout>
  )
}
