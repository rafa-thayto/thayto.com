import { Footer, Header } from '@src/components'
import { POSTS_PATH } from '@src/constants'
import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import path from 'path'
import SyntaxHighlighter from 'react-syntax-highlighter'

const components = { SyntaxHighlighter, Header, Footer }

const PostPage = ({
  frontMatter: { title, description, tags, publishedTime, modifiedTime, image },
  slug,
  mdxSource,
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
    <div className="container">
      <article className="leading-6 px-4">
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
  },
  { slug?: string }
> = async ({ params }) => {
  const markdownWithMeta = fs.readFileSync(
    path.join(POSTS_PATH, `${params?.slug}.mdx`),
    'utf-8',
  )

  const { data: frontMatter, content } = matter(markdownWithMeta)
  const mdxSource = await serialize(content)

  return {
    props: {
      frontMatter,
      slug: params?.slug,
      mdxSource,
    },
  }
}

export default PostPage
