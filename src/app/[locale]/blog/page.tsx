import { Layout } from '@/components'
import { Metadata } from 'next'
import { getPosts } from '@/utils/mdx'
import { SITE_URL } from '@/utils/constants'
import { Locale } from '@/i18n/config'
import { BlogContent } from './blog-content'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import {
  TWITTER_CARD,
  SCHEMA_CONTEXT,
  toOgLocale,
  toAlternateOgLocale,
  toCanonicalUrl,
  toLanguageTag,
  alternateLanguages,
  personPublisher,
  breadcrumbSchema,
  JsonLd,
} from '@/utils/seo'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata.blog' })
  const validLocale = locale as Locale
  const canonicalUrl = toCanonicalUrl(validLocale, '/blog')

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages('/blog'),
      types: { 'text/markdown': canonicalUrl },
    },
    openGraph: {
      url: canonicalUrl,
      title: t('title'),
      description: t('description'),
      locale: toOgLocale(validLocale),
      alternateLocale: toAlternateOgLocale(validLocale),
      images: [
        {
          url: `${SITE_URL}/static/images/seo-card-blog.png`,
          type: 'image/png',
        },
      ],
      siteName: 'Thayto.com',
    },
    twitter: TWITTER_CARD,
  }
}

export default async function Blog({ params }: Props) {
  const { locale } = await params
  const validLocale = locale as Locale
  const posts = getPosts(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.blog' })
  const blogUrl = toCanonicalUrl(validLocale, '/blog')

  const blogAuthor = {
    '@type': 'Person' as const,
    name: 'Rafael Thayto',
    jobTitle: 'Senior Software Engineer',
    url: SITE_URL,
  }

  const structuredData = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Blog' as const,
    name: t('title'),
    url: blogUrl,
    description: t('description'),
    inLanguage: toLanguageTag(validLocale),
    publisher: personPublisher(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': blogUrl },
    blogPost: posts.map(({ data }) => ({
      '@type': 'BlogPosting',
      headline: data.title,
      description: data.description,
      image: `${SITE_URL}/static/images/${data.image.src}`,
      datePublished: data.publishedTime,
      dateModified: data.modifiedTime,
      inLanguage: toLanguageTag(validLocale),
      author: blogAuthor,
      publisher: blogAuthor,
      url: `${SITE_URL}${data.href}`,
    })),
  }

  const breadcrumbData = {
    '@context': SCHEMA_CONTEXT,
    ...breadcrumbSchema(validLocale, [
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
    ]),
  }

  const priorityPosts = posts.slice(0, 3)

  return (
    <Layout>
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbData} />
      {priorityPosts.map((post) =>
        post.data.image ? (
          <link
            key={`preload-${post.data.id}`}
            rel="preload"
            as="image"
            href={`/static/images/${post.data.image.src}`}
            crossOrigin="anonymous"
          />
        ) : null,
      )}

      <main className="sm:px-2 mt-8">
        <Suspense fallback={null}>
          <BlogContent posts={posts} />
        </Suspense>
      </main>
    </Layout>
  )
}
