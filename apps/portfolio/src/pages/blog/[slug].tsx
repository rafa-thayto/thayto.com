import { Footer } from '@src/components/Footer'
import { Header } from '@src/components/Header'
import { MyComponent } from '@src/components/MyComponent'
import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import path from 'path'
import SyntaxHighlighter from 'react-syntax-highlighter'

const components = { SyntaxHighlighter, MyComponent, Header, Footer }

const PostPage = ({
  frontMatter: { title, description, tags, publishedTime, modifiedTime, image },
  slug,
  mdxSource,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <>
    <NextSeo
      title={`${title} - Rafael Thayto`}
      description={description}
      canonical="https://thayto.com/blog"
      openGraph={{
        type: 'article',
        url: `https://thayto.com/blog/${slug}`,
        title: 'Rafael Thayto - Blog',
        description: "Rafael Thayto's Blog",
        article: {
          authors: ['Rafael Thayto'],
          tags,
          publishedTime,
          modifiedTime,
        },
        images: [
          {
            url: 'https://thayto.com/static/images/profile.jpeg',
            width: 460,
            height: 460,
            alt: 'Rafael Thayto Profile Picture',
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
    <article className="container mx-auto leading-6 px-4">
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
    <Footer />
  </>
)

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join('posts'))

  const paths = files.map(filename => ({
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
    path.join('posts', `${params?.slug}.mdx`),
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
