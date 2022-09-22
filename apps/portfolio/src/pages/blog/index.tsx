import { Footer } from '@src/components/Footer'
import { Header } from '@src/components/Header'
import { IconsGroup } from '@src/components/IconsGroup'
import { BlogCard } from '@thayto/ui'
import fs from 'fs'
import matter from 'gray-matter'
import { nanoid } from 'nanoid'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'
import path from 'path'

const Blog = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <>
    <NextSeo
      title="Rafael Thayto - Blog"
      description="Aqui você encontra vários artigos sobre tecnologia e carreira."
      canonical="https://thayto.com/blog"
      openGraph={{
        url: 'https://thayto.com/blog',
        title: 'Rafael Thayto - Blog',
        description: "Rafael Thayto's Blog",
        images: [
          {
            url: 'http://thayto.com/static/images/profile.jpeg',
            width: 460,
            height: 460,
            alt: 'Rafael Thayto Profile Picture',
            type: 'image/jpeg',
          },
        ],
        site_name: 'RafaelThayto',
      }}
      twitter={{
        cardType: 'summary_large_image',
        site: '@thayto',
        handle: '@thayto',
      }}
    />

    <Header />

    <main className="p-2">
      <h1 className="text-4xl text-gray-800 font-bold m-4 text-center">Blog</h1>
      <h2 className="text-lg text-gray-800 mb-4 text-center">
        É aqui onde você encontra tudo que gostaria de saber, o que sabe e até o
        que nem sabia que queria saber! :D
      </h2>

      <div className="flex flex-wrap justify-center">
        {posts?.map(post => (
          <article key={nanoid()} className="m-2 lg:max-w-md ">
            <BlogCard
              title={post.frontMatter.title}
              description={post.frontMatter.description}
              tags={post.frontMatter.tags}
              published={post.frontMatter.published}
              image={post.frontMatter.image}
              href={post.frontMatter.href}
              reactionsLength={post.frontMatter.reactionsLength}
              commentsLength={post.frontMatter.commentsLength}
            />
          </article>
        ))}
      </div>

      <div className="flex justify-center my-6">
        <IconsGroup />
      </div>
    </main>

    <Footer />
  </>
)

export const getStaticProps: GetStaticProps<{
  posts: {
    frontMatter: {
      [key: string]: any
    }
    slug: string
  }[]
}> = async () => {
  const files = fs.readdirSync(path.join('posts'))

  const posts = files.map(filename => {
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8',
    )
    const { data: frontMatter } = matter(markdownWithMeta)

    return {
      frontMatter,
      slug: filename.split('.')[0],
    }
  })

  return {
    props: {
      posts,
    },
  }
}

export default Blog
