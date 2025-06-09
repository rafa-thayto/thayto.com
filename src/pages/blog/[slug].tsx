import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Layout, CodeBlock, Pre } from '@/components'
import { POSTS_PATH } from '@/constants'
import fs from 'fs'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import path from 'path'
import { getMdxSerializedPost, getPreviousOrNextPostBySlug } from '@/utils/mdx'
import { posthog } from 'posthog-js'
import { SITE_URL } from '@/utils/constants'

const components = {
  pre: (props: any) => <Pre {...props} />,
  code: (props: any) => <CodeBlock {...props} />,
}

const PostPage = ({
  frontMatter: { title, description, tags, publishedTime, modifiedTime, image },
  slug,
  mdxSource,
  prevPost,
  nextPost,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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
      <Head>
        <meta name="keywords" content={tags?.join(', ')} />
        <meta
          name="twitter:image"
          content={`https://thayto.com/static/images/${
            image?.src || 'profile.jpg'
          }`}
        />
        <script type="application/ld+json">
          {JSON.stringify(blogPostingStructuredData)}
        </script>
      </Head>
      <NextSeo
        title={`${title} - Rafael Thayto`}
        description={description}
        canonical={`https://thayto.com/blog/${slug}`}
        openGraph={{
          type: 'article',
          url: `https://thayto.com/blog/${slug}`,
          title,
          description,
          article: {
            authors: ['Rafael Thayto'],
            tags,
            publishedTime,
            modifiedTime,
          },
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
          site_name: 'Thayto',
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: '@thayto',
          handle: '@_thayto',
        }}
      />

      <div className="min-h-screen ">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="py-8">
            <Link
              href="/blog"
              onClick={() => {
                posthog.capture('blog-post-back-btn', {
                  title: title,
                })
              }}
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Voltar para o blog
            </Link>
          </nav>

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
                <MDXRemote {...mdxSource} components={components} />
              </div>
            </main>
          </article>

          {(prevPost || nextPost) && (
            <nav className="mt-12 mb-16">
              <div className="grid gap-6 md:grid-cols-2">
                {prevPost && (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                    onClick={() => {
                      posthog.capture('change-post-btn', {
                        href: `/blog/${prevPost.slug}`,
                        title: prevPost.title,
                      })
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <ArrowLeftIcon className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:-translate-x-1" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                          Artigo anterior
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {prevPost.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                )}

                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700 md:text-right"
                    onClick={() => {
                      posthog.capture('change-post-btn', {
                        href: `/blog/${nextPost.slug}`,
                        title: nextPost.title,
                      })
                    }}
                  >
                    <div className="flex items-start space-x-4 md:flex-row-reverse md:space-x-reverse">
                      <div className="flex-shrink-0">
                        <ArrowRightIcon className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                          Próximo artigo
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {nextPost.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join(POSTS_PATH))

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.mdx', ''),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  {
    frontMatter: Record<string, any>
    slug?: any
    mdxSource: MDXRemoteSerializeResult
    prevPost: any
    nextPost: any
  },
  { slug?: any }
> = async ({ params }) => {
  const { frontMatter, mdxSource } = await getMdxSerializedPost(params?.slug)
  const prevPost = getPreviousOrNextPostBySlug(params?.slug, 'previous')
  const nextPost = getPreviousOrNextPostBySlug(params?.slug, 'next')

  return {
    props: {
      frontMatter,
      slug: params?.slug,
      mdxSource,
      prevPost,
      nextPost,
    },
  }
}

export default PostPage
