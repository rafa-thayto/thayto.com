import { BlogCard, IconsGroup, Layout } from '@src/components'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'
import { getPosts } from '@src/utils/mdx'
import { getPlaiceholder } from 'plaiceholder'
import { getAllImagePaths } from '@src/utils/images'
import glob from 'glob'

const Blog = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const description =
    'Aqui você encontra vários artigos sobre tecnologia e carreira.'
  return (
    <Layout>
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
              url: 'https://thayto.com/static/images/profile.jpg',
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

      <main className="sm:px-2 mt-8">
        <div className="px-4 sm:px-2">
          <h1 className="text-4xl text-slate-900 dark:text-white font-bold m-4 text-center">
            Blog
          </h1>
          <h2 className="text-lg text-slate-900 dark:text-slate-400 mb-4 text-center">
            É aqui onde você encontra tudo que gostaria de saber, o que sabe e
            até o que nem sabia que queria saber! :D
          </h2>
        </div>

        <div className="flex flex-wrap justify-center">
          {posts?.map((post) => (
            <article key={post.data.title} className="my-2 sm:m-2 lg:max-w-md ">
              <BlogCard
                title={post.data.title}
                description={post.data.description}
                tags={post.data.tags}
                publishedTime={post.data.publishedTime}
                image={
                  post.data.image && {
                    src: `/static/images/${post.data.image.src}`,
                    alt: post.data.image.alt || 'Card Hero',
                    blurDataURL: post.data.image.base64,
                  }
                }
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
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<{
  posts: {
    content: string
    data: Record<string, any>
    filePath: string
  }[]
}> = async () => {
  const posts = getPosts()
  const imagePaths = getAllImagePaths()
  imagePaths.push('')
  await Promise.all(
    imagePaths.map(async (src) => {
      const { base64, blurhash, img } = await getPlaiceholder(
        `/static/images/como-abrir-o-vscode-direto-do-github.png`,
      )
      return {
        ...img,
        alt: 'Paint Splashes',
        title: 'Photo from Unsplash',
        blurhash,
        base64,
      }
    }),
  )

  // const newPosts = await Promise.all(
  //   posts.map(async (post) => {
  //     try {
  //       console.warn('post.data.image', post.data.image)
  //       // const { base64 } = await getPlaiceholder(
  //       //   `/static/images/${post.data.image.src}`,
  //       //   { size: 10 },
  //       // )
  //       // console.log('base64', base64)

  //       return {
  //         content: post.content,
  //         filePath: post.filePath,
  //         data: {
  //           ...post.data,
  //           image: {
  //             ...post.data.image,
  //             // base64,
  //           },
  //         },
  //       }
  //     } catch (error) {
  //       console.error('error', error)
  //     }
  //   }),
  // )

  return {
    props: {
      posts: posts,
    },
  }
}

export default Blog
