import { Metadata } from 'next'
import { getPosts } from '@/utils/mdx'
import { Locale } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'
import { SITE_URL } from '@/utils/constants'
import {
  TWITTER_CARD,
  SCHEMA_CONTEXT,
  toOgLocale,
  toAlternateOgLocale,
  toCanonicalUrl,
  toLanguageTag,
  alternateLanguages,
  organizationPublisher,
  personSummary,
  breadcrumbSchema,
  JsonLd,
} from '@/utils/seo'
import { PostsCanvas } from './posts-canvas'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata.blog' })
  const validLocale = locale as Locale
  const canonicalUrl = toCanonicalUrl(validLocale, '/posts')

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages('/posts'),
    },
    openGraph: {
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

export default async function PostsPage({ params }: Props) {
  const { locale } = await params
  const validLocale = locale as Locale
  const posts = getPosts(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.blog' })
  const postsUrl = toCanonicalUrl(validLocale, '/posts')

  const postsData = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    href: post.data.href,
    publishedTime: new Date(post.data.publishedTime).toISOString(),
    tags: post.data.tags,
  }))

  // JSON-LD: Blog schema with all posts (critical for canvas-based pages)
  const blogAuthor = personSummary(validLocale)

  const structuredData = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'CollectionPage' as const,
    '@id': postsUrl,
    name: t('title'),
    url: postsUrl,
    description: t('description'),
    inLanguage: toLanguageTag(validLocale),
    publisher: organizationPublisher(),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postsUrl },
    mainEntity: {
      '@type': 'ItemList' as const,
      numberOfItems: posts.length,
      itemListElement: posts.map(({ data }, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          '@id': toCanonicalUrl(validLocale, data.href),
          headline: data.title,
          description: data.description,
          image: `${SITE_URL}/static/images/${data.image.src}`,
          datePublished: data.publishedTime,
          dateModified: data.modifiedTime,
          inLanguage: toLanguageTag(validLocale),
          author: blogAuthor,
          url: toCanonicalUrl(validLocale, data.href),
        },
      })),
    },
  }

  const breadcrumbData = {
    '@context': SCHEMA_CONTEXT,
    ...breadcrumbSchema(validLocale, [
      { name: 'Home', path: '/' },
      { name: 'Posts', path: '/posts' },
    ]),
  }

  return (
    <>
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbData} />
      <PostsCanvas posts={postsData} locale={locale} />
    </>
  )
}
