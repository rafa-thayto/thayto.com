import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { CustomLink, Footer, Header, Layout } from '@src/components'
import { POSTS_PATH } from '@src/constants'
import fs from 'fs'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import path from 'path'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { rgbDataURL } from '@src/utils/blur'
import {
  getMdxSerializedPost,
  getPreviousOrNextPostBySlug,
} from '@src/utils/mdx'

const PostPage = ({
  frontMatter: { title, description, tags, publishedTime, modifiedTime, image },
  slug,
  mdxSource,
  prevPost,
  nextPost,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Layout>
    <Head>
      <meta name="keywords" content={tags?.join(', ')} />
      <meta
        name="twitter:image"
        content={`https://thayto.com/static/images/${
          image?.src || 'profile.jpg'
        }`}
      />
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
              image?.src || 'profile.jpg'
            }`,
            width: 460,
            height: 460,
            alt: 'Blog Hero',
            type: image?.type || 'image/jpeg',
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

    <div className="mx-auto max-w-5xl">
      <div className="p-10">
        <Link
          href="/blog"
          onClick={() => {
            window.umami.track('blog-post-back-btn', {
              title: prevPost.title,
            })
          }}
          className="flex justify-start"
        >
          <ArrowLeftIcon className="h-6 w-6 text-black dark:text-white" />
          <span className="ml-2 font-medium text-black dark:text-white">
            Voltar para overview
          </span>
        </Link>
      </div>
      <article className="leading-6 pb-12 shadow bg-slate-50 dark:bg-gray-800">
        <header className="mb-4">
          <div className="px-4 sm:px-12 py-10">
            <h1 className="text-2xl text-slate-900 dark:text-white font-bold">
              {title}
            </h1>
            <h2 className="text-base text-slate-600 dark:text-slate-400 font-semibold mt-2">
              <time dateTime={publishedTime}>
                {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'long',
                  timeStyle: 'long',
                }).format(new Date(publishedTime))}
              </time>
            </h2>
          </div>
          {image && (
            <div className="mb-4">
              <Image
                className="object-cover max-h-96"
                width={1000}
                height={420}
                blurDataURL={rgbDataURL(131, 72, 250)}
                placeholder="blur"
                style={{ height: 'auto', width: '100%' }}
                sizes="100vw"
                src={`/static/images/${image.src}`}
                alt={image.alt || title}
              />
            </div>
          )}
        </header>

        <main className="px-4 sm:px-12">
          <article className="prose dark:prose-invert max-w-4xl">
            <MDXRemote {...mdxSource} />
          </article>
        </main>
      </article>

      <div className="grid md:grid-cols-2 lg:-mx-24 mt-6">
        {prevPost && (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="py-8 px-10 text-center md:text-right first:rounded-t-lg md:first:rounded-tr-none md:first:rounded-l-lg last:rounded-r-lg first last:rounded-b-lg backdrop-blur-lg bg-slate-50 bg-opacity-100 dark:bg-opacity-10 hover:bg-opacity-30 dark:hover:bg-opacity-20 transition border border-gray-800 border-opacity-10 last:border-t md:border-r-0 md:last:border-r md:last:rounded-r-none flex flex-col"
            onClick={() => {
              window.umami.track('change-post-btn', {
                href: `/blog/${prevPost.slug}`,
                title: prevPost.title,
              })
            }}
          >
            <p className="uppercase text-gray-500 dark:text-white mb-4">
              Anterior
            </p>
            <h4 className="text-2xl text-gray-700 dark:text-gray-200 mb-6">
              {prevPost.title}
            </h4>
            <ArrowLeftIcon className="h-6 w-6 text-indigo-500 mx-auto md:mr-0 mt-auto" />
          </Link>
        )}
        {nextPost && (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="py-8 px-10 text-center md:text-left md:first:rounded-t-lg last:rounded-b-lg first:rounded-l-lg md:last:rounded-bl-none md:last:rounded-r-lg backdrop-blur-lg bg-slate-50  bg-opacity-100 dark:bg-opacity-10 hover:bg-opacity-30 dark:hover:bg-opacity-20 transition border border-gray-800 border-opacity-10 border-t-0 first:border-t first:rounded-t-lg md:border-t border-b-0 last:border-b flex flex-col"
            onClick={() => {
              window.umami.track('change-post-btn', {
                href: `/blog/${nextPost.slug}`,
                title: nextPost.title,
              })
            }}
          >
            <p className="uppercase text-gray-500 dark:text-white mb-4">
              Próximo
            </p>
            <h4 className="text-2xl text-gray-700 dark:text-gray-200 mb-6">
              {nextPost.title}
            </h4>
            <ArrowRightIcon className="h-6 w-6 text-indigo-500 mt-auto mx-auto md:ml-0" />
          </Link>
        )}
      </div>

      <section id="comments" className="px-4 sm:px-12 border-t mt-6 pt-4">
        <h2 className="text-2xl text-slate-900 dark:text-white font-bold">
          Comentários
        </h2>
        <p className="uppercase text-slate-700 dark:text-slate-400 mt-4">
          In progress... 🧱
        </p>
      </section>
    </div>
  </Layout>
)

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
