import { Layout, CodeBlock, Pre, MDXImage } from '@/components'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import {
  getMdxSerializedPost,
  getPreviousOrNextPostBySlug,
  getPosts,
  calculateWordCount,
} from '@/utils/mdx'
import { SITE_URL } from '@/utils/constants'
import { Locale, locales } from '@/i18n/config'
import { BlogPostNavigation } from './blog-post-navigation'
import remarkGfm from 'remark-gfm'
import remarkA11yEmoji from '@fec/remark-a11y-emoji'
import rehypeSlug from 'rehype-slug'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { h } from 'hastscript'
import {
  TWITTER_CARD,
  SCHEMA_CONTEXT,
  toOgLocale,
  toAlternateOgLocale,
  toCanonicalUrl,
  toLanguageTag,
  alternateLanguages,
  personSummary,
  personPublisher,
  breadcrumbSchema,
  JsonLd,
} from '@/utils/seo'

const components = {
  pre: (props: React.ComponentProps<typeof Pre>) => <Pre {...props} />,
  code: (props: React.ComponentProps<typeof CodeBlock>) => (
    <CodeBlock {...props} />
  ),
  img: (props: React.ComponentProps<typeof MDXImage>) => (
    <MDXImage {...props} />
  ),
  Image: (props: React.ComponentProps<typeof MDXImage>) => (
    <MDXImage {...props} />
  ),
}

const mdxOptions = {
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
  ] as NonNullable<
    NonNullable<Parameters<typeof MDXRemote>[0]['options']>['mdxOptions']
  >['rehypePlugins'],
}

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    getPosts(locale).map((post) => ({
      locale,
      slug: post.filePath.replace('.mdx', ''),
    })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const validLocale = locale as Locale
  const { frontMatter } = await getMdxSerializedPost(slug, locale)
  const { title, description, tags, image } = frontMatter

  const canonicalUrl = toCanonicalUrl(validLocale, `/blog/${slug}`)

  return {
    title: `${title} - Rafael Thayto`,
    description,
    keywords: tags?.join(', '),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages(`/blog/${slug}`),
      types: {
        'text/markdown': toCanonicalUrl(validLocale, `/blog/${slug}.md`),
      },
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description,
      locale: toOgLocale(validLocale),
      alternateLocale: toAlternateOgLocale(validLocale),
      images: [
        {
          url: `${SITE_URL}/static/images/${
            image?.src ?? 'seo-card-default.png'
          }`,
          width: 460,
          height: 460,
          alt: 'Blog Hero',
          type: image?.type ?? 'image/png',
        },
      ],
      siteName: 'Thayto',
      publishedTime: frontMatter.publishedTime,
      modifiedTime: frontMatter.modifiedTime,
      authors: ['Rafael Thayto'],
      tags,
    },
    twitter: {
      ...TWITTER_CARD,
      images: [`${SITE_URL}/static/images/${image?.src ?? 'profile.jpg'}`],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const validLocale = locale as Locale
  const { frontMatter, mdxSource } = await getMdxSerializedPost(slug, locale)
  const {
    title,
    description,
    tags,
    publishedTime,
    modifiedTime,
    image,
    keywords,
  } = frontMatter
  const prevPost = getPreviousOrNextPostBySlug(slug, 'previous', locale)
  const nextPost = getPreviousOrNextPostBySlug(slug, 'next', locale)

  const postUrl = toCanonicalUrl(validLocale, `/blog/${slug}`)
  const wordCount = calculateWordCount(mdxSource.toString())
  const readingTimeMinutes = Math.ceil(wordCount / 200)

  const blogPostingSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BlogPosting' as const,
    '@id': postUrl,
    url: postUrl,
    mainEntityOfPage: { '@type': 'WebPage' as const, '@id': postUrl },
    headline: title,
    description,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    inLanguage: toLanguageTag(validLocale),
    wordCount,
    timeRequired: `PT${readingTimeMinutes}M`,
    keywords: keywords?.join(', ') ?? tags?.join(', '),
    about: tags?.map((tag: string) => ({ '@type': 'Thing', name: tag })),
    educationalUse: 'learning',
    learningResourceType: 'tutorial',
    author: personSummary(validLocale),
    publisher: personPublisher(),
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/static/images/${image?.src ?? 'profile.jpg'}`,
      width: 1200,
      height: 630,
    },
    breadcrumb: breadcrumbSchema(validLocale, [
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: title, path: `/blog/${slug}` },
    ]),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.prose'],
    },
  }

  const dateFormatter = new Intl.DateTimeFormat(toLanguageTag(validLocale), {
    dateStyle: 'long',
  })

  return (
    <Layout>
      <JsonLd data={blogPostingSchema} />

      <div className="min-h-screen bg-slate-50 dark:bg-black">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <BlogPostNavigation
            prevPost={prevPost}
            nextPost={nextPost}
            title={title}
            position="top"
          />

          <article className="bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden">
            <header className="px-6 sm:px-8 lg:px-12 pt-4 sm:pt-8 lg:pt-12">
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
                  {dateFormatter.format(new Date(publishedTime))}
                </time>
                <span className="mx-2">•</span>
                <span>Rafael Thayto</span>
              </div>
            </header>

            {image && (
              <div className="px-6 sm:px-8 lg:px-12 mb-8 sm:mb-12">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
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
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-black dark:prose-blockquote:border-l-blue-400">
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
