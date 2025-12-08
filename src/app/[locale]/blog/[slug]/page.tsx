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
import { BlogPostNavigation } from './blog-post-navigation'
import remarkGfm from 'remark-gfm'
import remarkA11yEmoji from '@fec/remark-a11y-emoji'
import rehypeSlug from 'rehype-slug'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { h } from 'hastscript'
import { locales } from '@/i18n/config'

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
  const { frontMatter } = await getMdxSerializedPost(slug, locale)
  const { title, description, tags, image } = frontMatter

  const canonicalUrl =
    locale === 'pt'
      ? `https://thayto.com/blog/${slug}`
      : `https://thayto.com/en/blog/${slug}`

  return {
    title: `${title} - Rafael Thayto`,
    description,
    keywords: tags?.join(', '),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        pt: `https://thayto.com/blog/${slug}`,
        en: `https://thayto.com/en/blog/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description,
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      alternateLocale: locale === 'pt' ? 'en_US' : 'pt_BR',
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
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
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

  const blogUrl = locale === 'pt' ? `/blog/${slug}` : `/en/blog/${slug}`

  // Calculate word count for LLM SEO
  const content = mdxSource.toString()
  const wordCount = calculateWordCount(content)
  const readingTimeMinutes = Math.ceil(wordCount / 200)

  // Enhanced BlogPosting Schema for LLM/AI discoverability
  const blogPostingStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}${blogUrl}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${blogUrl}`,
    },
    headline: title,
    description: description,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en-US',
    // NEW: Word count and reading time (critical for LLMs)
    wordCount: wordCount,
    timeRequired: `PT${readingTimeMinutes}M`,
    // NEW: Keywords (use frontmatter keywords or fallback to tags)
    keywords: keywords?.join(', ') || tags?.join(', '),
    // NEW: Article topics
    about: tags?.map((tag: string) => ({
      '@type': 'Thing',
      name: tag,
    })),
    // NEW: Educational context
    educationalUse: 'learning',
    learningResourceType: 'tutorial',
    // ENHANCED: Author with full details
    author: {
      '@type': 'Person',
      '@id': 'https://thayto.com/#person',
      name: 'Rafael Thayto',
      url: `${SITE_URL}${locale === 'en' ? '/en' : ''}/about`,
      jobTitle: 'Senior Software Engineer',
      sameAs: [
        'https://github.com/rafa-thayto',
        'https://linkedin.com/in/thayto',
      ],
    },
    // ENHANCED: Publisher
    publisher: {
      '@type': 'Person',
      '@id': 'https://thayto.com/#person',
      name: 'Rafael Thayto',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/static/images/profile.jpg`,
        width: 460,
        height: 460,
      },
    },
    // Enhanced image
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/static/images/${image?.src || 'profile.jpg'}`,
      width: 1200,
      height: 630,
    },
    // NEW: Breadcrumb
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}${locale === 'en' ? '/en' : ''}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${SITE_URL}${locale === 'en' ? '/en' : ''}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: title,
          item: `${SITE_URL}${blogUrl}`,
        },
      ],
    },
    // NEW: Speakable sections for voice assistants
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.prose'],
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
                  {new Intl.DateTimeFormat(
                    locale === 'pt' ? 'pt-BR' : 'en-US',
                    {
                      dateStyle: 'long',
                    },
                  ).format(new Date(publishedTime))}
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
