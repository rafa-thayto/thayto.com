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

  const blogPostingStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': locale === 'pt' ? 'https://thayto.com' : 'https://thayto.com/en',
    url: locale === 'pt' ? 'https://thayto.com' : 'https://thayto.com/en',
    name: 'Rafael Thayto - Home',
    description: description,
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en-US',
    author: {
      '@type': 'Person',
      name: 'Rafael Thayto',
      url: 'https://thayto.com',
      jobTitle: 'Senior Software Engineer',
      description: description,
    },
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
          __html: JSON.stringify(blogPostingStructuredData),
        }}
      />

      <main className="max-w-4xl mx-auto bg-neutral-50 dark:bg-black py-4 px-4 sm:px-24">
        <HomeContent posts={posts} />
      </main>
    </Layout>
  )
}
