import { Layout } from '@/components'
import { Metadata } from 'next'
import { getPosts } from '@/utils/mdx'
import { SITE_URL } from '@/utils/constants'
import { BlogContent } from './blog-content'
import { Suspense } from 'react'

const description =
  'Aqui você encontra vários artigos sobre tecnologia e carreira.'

export const metadata: Metadata = {
  title: 'Rafael Thayto - Blog',
  description,
  alternates: {
    canonical: 'https://thayto.com/blog',
  },
  openGraph: {
    url: 'https://thayto.com/blog',
    title: 'Rafael Thayto - Blog',
    description,
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

export default async function Blog() {
  const posts = getPosts()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Rafael Thayto - Blog',
    url: 'https://thayto.com/blog',
    description:
      'Aqui você encontra vários artigos sobre tecnologia e carreira.',
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
      '@id': 'https://thayto.com/blog',
    },
    blogPost: posts.map(({ data }) => ({
      '@type': 'BlogPosting',
      headline: data.title,
      description: data.description,
      image: `${SITE_URL}/static/images/${data.image.src}`,
      datePublished: data.publishedTime,
      dateModified: data.modifiedTime,
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
