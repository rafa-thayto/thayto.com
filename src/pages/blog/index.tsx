import { BlogCard, IconsGroup, Layout } from '@/components'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'
import { getPosts, Post } from '@/utils/mdx'
import { useSearchParams } from 'next/navigation'
import { generateRssFeed } from '@/utils/generate-rss-feed'
import { SITE_URL } from '@/utils/constants'
import Head from 'next/head'

const Blog = ({ posts: p }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const searchParams = useSearchParams()
  const search = searchParams.get('tags') || searchParams.get('tag')
  const tags = search?.split(',')
  const posts = p.filter((post) =>
    !tags?.length ? true : post.data.tags.some((t) => tags.includes(t)),
  )
  const description =
    'Aqui você encontra vários artigos sobre tecnologia e carreira.'

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
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        {priorityPosts.map((post, index) =>
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
      </Head>
      <NextSeo
        title="Rafael Thayto - Blog"
        description={description}
        canonical="https://thayto.com/blog"
        openGraph={{
          url: 'https://thayto.com/blog',
          title: 'Rafael Thayto - Blog',
          description,
          images: [
            {
              url: 'https://thayto.com/static/images/seo-card-blog.png',
              type: 'image/png',
            },
          ],
          site_name: 'Thayto.com',
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: '@thayto',
          handle: '@thayto',
        }}
      />

      <main className="sm:px-2 mt-8">
        <div className="px-4 sm:px-2 mb-8 max-w-3xl mx-auto flex flex-col gap-2">
          <h1 className="text-4xl text-slate-900 dark:text-white font-bold m-4 text-center">
            Blog
          </h1>
          <p className="text-base text-slate-900 dark:text-slate-400 mb-4 font-light text-center">
            É aqui onde você encontra tudo que gostaria de saber, o que sabe e
            até o que nem sabia que queria saber! :D
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {posts?.map((post, index) => (
            <article
              key={post.data.title}
              className="w-full sm:max-w-sm lg:max-w-md"
            >
              <BlogCard
                id={post.data.id}
                title={post.data.title}
                description={post.data.description}
                tags={post.data.tags}
                publishedTime={post.data.publishedTime}
                image={
                  post.data.image && {
                    src: `/static/images/${post.data.image.src}`,
                    alt: post.data.image.alt || 'Card Hero',
                    blurDataURL: post.data.image.placeholder
                      ? `/static/images/${post.data.image.placeholder}`
                      : post.data.image.base64,
                  }
                }
                href={post.data.href}
                reactionsLength={post.data.reactionsLength}
                commentsLength={post.data.commentsLength}
                priority={index < 3}
              />
            </article>
          ))}
        </div>

        <div className="flex justify-center my-6">
          <IconsGroup />
        </div>
      </main>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<{
  posts: Post[]
}> = async () => {
  await generateRssFeed()
  const posts = getPosts()

  return {
    props: {
      posts: posts,
    },
  }
}

export default Blog
