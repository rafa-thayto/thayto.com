import { Layout, CodeBlock, Pre, MDXImage } from '@/components'
import { POSTS_PATH } from '@/constants'
import fs from 'fs'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import path from 'path'
import { getMdxSerializedPost, getPreviousOrNextPostBySlug } from '@/utils/mdx'
import { SITE_URL } from '@/utils/constants'
import { BlogPostNavigation } from './blog-post-navigation'
import remarkGfm from 'remark-gfm'
import remarkA11yEmoji from '@fec/remark-a11y-emoji'
import rehypeSlug from 'rehype-slug'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { h } from 'hastscript'

const components = {
  pre: (props: any) => <Pre {...props} />,
  code: (props: any) => <CodeBlock {...props} />,
  img: (props: any) => <MDXImage {...props} />,
  Image: (props: any) => <MDXImage {...props} />,
}

const mdxOptions: any = {
  remarkPlugins: [remarkGfm, remarkA11yEmoji],
  rehypePlugins: [
    rehypeSlug,
    rehypePrismPlus,
    [
      rehypeAutolinkHeadings,
      {
        behavior: 'prepend',
        properties: {
          ariaLabel: 'Link to this section',
          classname: ['no-underline'],
        },
        content: h('span.text-indigo-500', '# '),
      },
    ],
  ],
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(POSTS_PATH))

  return files.map((filename) => ({
    slug: filename.replace('.mdx', ''),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { frontMatter } = await getMdxSerializedPost(slug)
  const { title, description, tags, image } = frontMatter

  return {
    title: `${title} - Rafael Thayto`,
    description,
    keywords: tags?.join(', '),
    alternates: {
      canonical: `https://thayto.com/blog/${slug}`,
    },
    openGraph: {
      type: 'article',
      url: `https://thayto.com/blog/${slug}`,
      title,
      description,
      images: [
        {
          url: `https://thayto.com/static/images/${
            image?.src || 'seo-card-default.png'
          }`,
          width: 460,
          height: 460,
          alt: 'Blog Hero',
          type: image?.type || 'image/png',
        },
      ],
      siteName: 'Thayto',
      publishedTime: frontMatter.publishedTime,
      modifiedTime: frontMatter.modifiedTime,
      authors: ['Rafael Thayto'],
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@thayto',
      creator: '@_thayto',
      images: [
        `https://thayto.com/static/images/${image?.src || 'profile.jpg'}`,
      ],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { frontMatter, mdxSource } = await getMdxSerializedPost(slug)
  const { title, description, tags, publishedTime, modifiedTime, image } =
    frontMatter
  const prevPost = getPreviousOrNextPostBySlug(slug, 'previous')
  const nextPost = getPreviousOrNextPostBySlug(slug, 'next')

  const blogPostingStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
    headline: title,
    description: description,
    datePublished: publishedTime,
    dateModified: modifiedTime,
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
    image: `${SITE_URL}/static/images/${image?.src || 'profile.jpg'}`,
  }

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingStructuredData),
        }}
      />

      <div className="min-h-screen ">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <BlogPostNavigation
            prevPost={prevPost}
            nextPost={nextPost}
            title={title}
            position="top"
          />

          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <header className="px-6 sm:px-8 lg:px-12 pt-8 sm:pt-12 lg:pt-16">
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                {title}
              </h1>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-8 sm:mb-12">
                <time dateTime={publishedTime} className="font-medium">
                  {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'long',
                  }).format(new Date(publishedTime))}
                </time>
                <span className="mx-2">•</span>
                <span>Rafael Thayto</span>
              </div>
            </header>

            {image && (
              <div className="px-6 sm:px-8 lg:px-12 mb-8 sm:mb-12">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    className="object-cover"
                    fill
                    blurDataURL={
                      image.placeholder
                        ? `/static/images/${image.placeholder}`
                        : image.base64
                    }
                    placeholder="blur"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    src={`/static/images/${image.src}`}
                    alt={image.alt || title}
                    priority
                  />
                </div>
              </div>
            )}

            <main className="px-6 sm:px-8 lg:px-12 pb-8 sm:pb-12 lg:pb-16">
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-gray-800 dark:prose-blockquote:border-l-blue-400">
                <MDXRemote
                  source={mdxSource}
                  components={components}
                  options={{ mdxOptions }}
                />
              </div>
            </main>
          </article>

          <BlogPostNavigation
            prevPost={prevPost}
            nextPost={nextPost}
            title={title}
            position="bottom"
          />
        </div>
      </div>
    </Layout>
  )
}
