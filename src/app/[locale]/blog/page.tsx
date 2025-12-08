import { Layout } from '@/components'
import { Metadata } from 'next'
import { getPosts } from '@/utils/mdx'
import { SITE_URL } from '@/utils/constants'
import { BlogContent } from './blog-content'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata.blog' })

  const canonicalUrl =
    locale === 'pt' ? 'https://thayto.com/blog' : 'https://thayto.com/en/blog'

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        pt: 'https://thayto.com/blog',
        en: 'https://thayto.com/en/blog',
      },
    },
    openGraph: {
      url: canonicalUrl,
      title: t('title'),
      description: t('description'),
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      alternateLocale: locale === 'pt' ? 'en_US' : 'pt_BR',
      images: [
        {
          url: 'https://thayto.com/static/images/seo-card-blog.png',
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

export default async function Blog({ params }: Props) {
  const { locale } = await params
  const posts = getPosts(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.blog' })

  const blogUrl = locale === 'pt' ? '/blog' : '/en/blog'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t('title'),
    url: `${SITE_URL}${blogUrl}`,
    description: t('description'),
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en-US',
    publisher: {
      '@type': 'Person',
      name: 'Rafael Thayto',
      url: 'https://thayto.com',
      image: {
        '@type': 'ImageObject',
        url: 'https://thayto.com/static/images/profile.jpg',
        width: 460,
        height: 460,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${blogUrl}`,
    },
    blogPost: posts.map(({ data }) => ({
      '@type': 'BlogPosting',
      headline: data.title,
      description: data.description,
      image: `${SITE_URL}/static/images/${data.image.src}`,
      datePublished: data.publishedTime,
      dateModified: data.modifiedTime,
      inLanguage: locale === 'pt' ? 'pt-BR' : 'en-US',
      author: {
        '@type': 'Person',
        name: 'Rafael Thayto',
        jobTitle: 'Senior Software Engineer',
        url: `${SITE_URL}/static/images/profile.jpg`,
      },
      publisher: {
        '@type': 'Person',
        name: 'Rafael Thayto',
        jobTitle: 'Senior Software Engineer',
        url: `${SITE_URL}/static/images/profile.jpg`,
      },
      url: `${SITE_URL}${data.href}`,
    })),
  }

  const priorityPosts = posts.slice(0, 3)

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
