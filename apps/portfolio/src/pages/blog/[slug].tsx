import { Footer } from '@src/components/Footer'
import { Header } from '@src/components/Header'
import { MyComponent } from '@src/components/MyComponent'
import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { NextSeo } from 'next-seo'
import path from 'path'
import SyntaxHighlighter from 'react-syntax-highlighter'

const components = { SyntaxHighlighter, MyComponent, Header, Footer }

const PostPage = ({
  frontMatter: { title, description, date, tags, publishedTime, modifiedTime },
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
            url: 'http://thayto.com/static/images/profile.jpeg',
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
    <div className="">
      <h1>{title}</h1>
      <h1>{date}</h1>
      <MDXRemote {...mdxSource} components={components} />
    </div>
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
