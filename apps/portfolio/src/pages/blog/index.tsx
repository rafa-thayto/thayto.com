import { Footer } from '@src/components/Footer'
import { Header } from '@src/components/Header'
import { IconsGroup } from '@src/components/IconsGroup'
import { BlogCard } from '@thayto/ui'
import { nanoid } from 'nanoid'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'

const Blog = () => {
  const fakeCards = useMemo(
    () => [
      {
        title: 'Como configurar o deploy do Turborepo no Netlify',
        published: 'Published: 21 de jun.',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
        image: {
          src: '/static/images/como-configurar-o-deploy-do-turborepo-no-netlify.png',
        },
        tags: ['turborepo', 'netlify', 'howTo', 'guide', 'thayto'],
        href: 'https://dev.to/thayto/como-configurar-o-deploy-do-turborepo-no-netlify-45f8',
        reactionsLength: 0,
        commentsLength: 0,
      },
      {
        title: "Como 'settar' a versão default do Node usando nvm",
        published: 'Published: 19 de jun.',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
        image: {
          src: '/static/images/como-settar-a-versao-default-do-node-usando-nvm.png',
        },
        tags: ['node', 'nvm', 'thayto'],
        href: 'https://dev.to/thayto/como-settar-a-versao-default-do-node-usando-nvm-47dg',
        reactionsLength: 0,
        commentsLength: 0,
      },
    ],
    [],
  )

  return (
    <>
      <NextSeo
        title="Rafael Thayto - Blog"
        description="Aqui você encontra vários artigos sobre tecnologia e carreira."
        canonical="https://www.thayto.com/blog"
        openGraph={{
          url: 'https://www.thayto.com/blog',
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
        <h1 className="text-4xl text-gray-800 font-bold m-4 text-center">
          Blog
        </h1>
        <h2 className="text-lg text-gray-800 mb-4 text-center">
          É aqui onde você encontra tudo que gostaria de saber, o que sabe e até
          o que nem sabia que queria saber! :D
        </h2>

        <div className="flex flex-wrap justify-center">
          {fakeCards.map(card => (
            <article key={nanoid()} className="m-2 lg:max-w-md ">
              <BlogCard
                title={card.title}
                description={card.description}
                tags={card.tags}
                published={card.published}
                image={card.image}
                href={card.href}
                reactionsLength={card.reactionsLength}
                commentsLength={card.commentsLength}
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
}

export default Blog
