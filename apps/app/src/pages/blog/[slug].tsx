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
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

const components = { SyntaxHighlighter, Header, Footer, a: CustomLink }

const PostPage = ({
  frontMatter: { title, description, tags, publishedTime, modifiedTime, image },
  slug,
  mdxSource,
  prevPost,
  nextPost,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <>
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
    <div className="container max-w-4xl">
      <article className="leading-6 px-4 ">
        <div className="mb-4">
          {image && (
            <div className="h-64 relative mb-4">
              <Image
                className="object-cover"
                layout="fill"
                src={image.src}
                alt={image.alt || title}
              />
            </div>
          )}
          <h1 className="text-2xl text-slate-900 font-bold">{title}</h1>
          <h2 className="text-xl text-slate-900 font-light">
            Last modify: <time dateTime={modifiedTime}>{modifiedTime}</time>
          </h2>
        </div>
        <MDXRemote {...mdxSource} components={components} />
        <div className="grid md:grid-cols-2 lg:-mx-24 mt-12">
          {prevPost && (
            <Link href={`/blog/${prevPost.slug}`}>
              <a className="py-8 px-10 text-center md:text-right first:rounded-t-lg md:first:rounded-tr-none md:first:rounded-l-lg last:rounded-r-lg first last:rounded-b-lg backdrop-blur-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition border border-gray-800 border-opacity-10 last:border-t md:border-r-0 md:last:border-r md:last:rounded-r-none flex flex-col">
                <p className="uppercase text-gray-500 mb-4">Anterior</p>
                <h4 className="text-xl text-gray-700 mb-6">{prevPost.title}</h4>
                <ArrowLeftIcon className="h-24 w-24 mx-auto md:mr-0 mt-auto" />
              </a>
            </Link>
          )}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`}>
              <a className="py-8 px-10 text-center md:text-left md:first:rounded-t-lg last:rounded-b-lg first:rounded-l-lg md:last:rounded-bl-none md:last:rounded-r-lg backdrop-blur-lg bg-white  bg-opacity-10 hover:bg-opacity-20 transition border border-gray-800 border-opacity-10  border-t-0 first:border-t first:rounded-t-lg md:border-t border-b-0 last:border-b flex flex-col">
                <p className="uppercase text-gray-500 mb-4">Próximo</p>
                <h4 className="text-xl text-gray-700 mb-6">{nextPost.title}</h4>
                <ArrowRightIcon className="h-24 w-24 mt-auto mx-auto md:ml-0" />
              </a>
            </Link>
          )}
        </div>
      </article>
      <section id="comments" className="border-t mt-4 pt-4">
        <h2 className="text-2xl text-slate-900 font-bold">Comentários</h2>
      </section>
    </div>
    <Footer />
  </>
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
      remarkPlugins: [remarkGfm, remarkParse, remarkRehype],
      rehypePlugins: [rehypePrism],
    },
    scope: frontMatter,
  })

  const postFilePaths = fs
    .readdirSync(POSTS_PATH)
    // Only include md(x) files
    .filter((path) => /\.mdx?$/.test(path))

  const sortPostsByDate = (posts) => {
    return posts.sort((a, b) => {
      const aDate = new Date(a.data.date).getTime()
      const bDate = new Date(b.data.date).getTime()
      return bDate - aDate
    })
  }

  const getPosts = () => {
    let posts = postFilePaths.map((filePath) => {
      const source = fs.readFileSync(path.join(POSTS_PATH, filePath))
      const { content, data } = matter(source)

      return {
        content,
        data,
        filePath,
      }
    })

    posts = sortPostsByDate(posts)

    return posts
  }

  const getPreviousPostBySlug = (slug) => {
    const posts = getPosts()
    const currentFileName = `${slug}.mdx`
    const currentPost = posts.find((post) => post.filePath === currentFileName)
    const currentPostIndex = posts.indexOf(currentPost)

    const post = posts[currentPostIndex + 1]
    // no prev post found
    if (!post) return null

    const previousPostSlug = post?.filePath.replace(/\.mdx?$/, '')

    return {
      title: post.data.title,
      slug: previousPostSlug,
    }
  }

  const getNextPostBySlug = (slug) => {
    const posts = getPosts()
    const currentFileName = `${slug}.mdx`
    const currentPost = posts.find((post) => post.filePath === currentFileName)
    const currentPostIndex = posts.indexOf(currentPost)

    const post = posts[currentPostIndex - 1]
    // no prev post found
    if (!post) return null

    const nextPostSlug = post?.filePath.replace(/\.mdx?$/, '')

    return {
      title: post.data.title,
      slug: nextPostSlug,
    }
  }

  const nextPost = getPreviousPostBySlug(params?.slug)
  const prevPost = getNextPostBySlug(params?.slug)

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
