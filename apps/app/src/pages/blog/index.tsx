import { BlogCard, Footer, Header, IconsGroup } from '@src/components'
import { POSTS_PATH } from '@src/constants'
import fs from 'fs'
import matter from 'gray-matter'
import { nanoid } from 'nanoid'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'
import path from 'path'
import { getPosts } from 'utils/mdx'

const Blog = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const description =
    'Aqui você encontra vários artigos sobre tecnologia e carreira.'
  return (
    <div className="bg-gray-100">
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

      <main className="p-2">
        <h1 className="text-4xl text-gray-800 font-bold m-4 text-center">
          Blog
        </h1>
        <h2 className="text-lg text-gray-800 mb-4 text-center">
          É aqui onde você encontra tudo que gostaria de saber, o que sabe e até
          o que nem sabia que queria saber! :D
        </h2>

        <div className="flex flex-wrap justify-center">
          {posts?.map((post) => (
            <article key={nanoid()} className="m-2 lg:max-w-md ">
              <BlogCard
                title={post.data.title}
                description={post.data.description}
                tags={post.data.tags}
                published={post.data.published}
                image={post.data.image}
                href={post.data.href}
                reactionsLength={post.data.reactionsLength}
                commentsLength={post.data.commentsLength}
              />
            </article>
          ))}
        </div>

        <div className="flex justify-center my-6">
          <IconsGroup />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export const getStaticProps: GetStaticProps<{
  posts: {
    content: string
    data: {
      [key: string]: any
    }
    filePath: string
  }[]
}> = async () => {
  const posts = getPosts()

  return {
    props: {
      posts,
    },
  }
}

export default Blog
