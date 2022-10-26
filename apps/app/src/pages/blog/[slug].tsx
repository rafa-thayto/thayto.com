import remarkA11yEmoji from '@fec/remark-a11y-emoji'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import rehypePrism from '@mapbox/rehype-prism'
import { CustomLink, Footer, Header } from '@src/components'
import { POSTS_PATH } from '@src/constants'
import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import path from 'path'
import SyntaxHighlighter from 'react-syntax-highlighter'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { getNextPostBySlug, getPreviousPostBySlug } from 'utils/mdx'

const components = { SyntaxHighlighter, Header, Footer, a: CustomLink }

const PostPage = ({
  frontMatter: { title, description, tags, publishedTime, modifiedTime, image },
  slug,
  mdxSource,
  prevPost,
  nextPost,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <div className="bg-gray-100">
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
            url: `https://thayto.com${
              image ? image.src : '/static/images/profile.jpeg'
            }`,
            width: 460,
            height: 460,
            alt: 'blog hero',
            type: 'image/jpeg',
          },
        ],
        site_name: 'Thayto',
      }}
      twitter={{
        cardType: 'summary_large_image',
        site: '@thayto',
        handle: '@thayto',
      }}
    />
    <Header />

    <div className="mx-auto max-w-5xl">
      <article className="leading-6 pb-12 border mt-4 bg-slate-50">
        <header className="mb-4">
          {image && (
            <div className="mb-4">
              <Image
                className="object-cover"
                layout="responsive"
                width={1000}
                height={420}
                style={{ height: 'auto', width: '100%' }}
                sizes="100vw"
                src={image.src}
                alt={image.alt || title}
              />
            </div>
          )}
          <div className="px-4 sm:px-12 mt-6">
            <h1 className="text-2xl text-slate-900 font-bold">{title}</h1>
            <h2 className="text-xl text-slate-600 font-light mt-2">
              <time dateTime={publishedTime}>
                {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'long',
                  timeStyle: 'long',
                }).format(new Date(publishedTime))}
              </time>
            </h2>
          </div>
        </header>

        <main className="px-4 sm:px-12">
          <article className="prose max-w-4xl">
            <MDXRemote {...mdxSource} components={components} />
          </article>
        </main>
      </article>

      <div className="grid md:grid-cols-2 lg:-mx-24 mt-6">
        {prevPost && (
          <Link href={`/blog/${prevPost.slug}`}>
            <a className="py-8 px-10 text-center md:text-right first:rounded-t-lg md:first:rounded-tr-none md:first:rounded-l-lg last:rounded-r-lg first last:rounded-b-lg backdrop-blur-lg bg-slate-50 bg-opacity-60 hover:bg-opacity-30 transition border border-gray-800 border-opacity-10 last:border-t md:border-r-0 md:last:border-r md:last:rounded-r-none flex flex-col">
              <p className="uppercase text-gray-500 mb-4">Anterior</p>
              <h4 className="text-2xl text-gray-700 mb-6">{prevPost.title}</h4>
              <ArrowLeftIcon className="h-6 w-6 text-indigo-500 mx-auto md:mr-0 mt-auto" />
            </a>
          </Link>
        )}
        {nextPost && (
          <Link href={`/blog/${nextPost.slug}`}>
            <a className="py-8 px-10 text-center md:text-left md:first:rounded-t-lg last:rounded-b-lg first:rounded-l-lg md:last:rounded-bl-none md:last:rounded-r-lg backdrop-blur-lg bg-slate-50  bg-opacity-60 hover:bg-opacity-30 transition border border-gray-800 border-opacity-10  border-t-0 first:border-t first:rounded-t-lg md:border-t border-b-0 last:border-b flex flex-col">
              <p className="uppercase text-gray-500 mb-4">Próximo</p>
              <h4 className="text-2xl text-gray-700 mb-6">{nextPost.title}</h4>
              <ArrowRightIcon className="h-6 w-6 text-indigo-500 mt-auto mx-auto md:ml-0" />
            </a>
          </Link>
        )}
      </div>
      <section id="comments" className="px-4 sm:px-12 border-t mt-6 pt-4">
        <h2 className="text-2xl text-slate-900 font-bold">Comentários</h2>
        <p className="uppercase text-slate-700 mt-4">In progress... 🧱</p>
      </section>
    </div>
    <Footer />
  </div>
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
    slug?: string
    mdxSource: MDXRemoteSerializeResult
    prevPost: any
    nextPost: any
  },
  { slug?: string }
> = async ({ params }) => {
  const markdownWithMeta = fs.readFileSync(
    path.join(POSTS_PATH, `${params?.slug}.mdx`),
    'utf-8',
  )

  const { data: frontMatter, content } = matter(markdownWithMeta)
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkA11yEmoji, remarkParse, remarkRehype],
      rehypePlugins: [
        rehypeSlug,
        rehypePrism,
        rehypeAutolinkHeadings,
        rehypeStringify,
      ],
    },
    scope: frontMatter,
  })

  const prevPost = getPreviousPostBySlug(params?.slug)
  const nextPost = getNextPostBySlug(params?.slug)

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
