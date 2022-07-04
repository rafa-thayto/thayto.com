import { NextSeo } from 'next-seo'
import { useEffect, useMemo, useState } from 'react'
import Confetti from 'react-confetti'
import { Header } from '@src/components/Header'
import { BlogCard } from '@thayto/ui'
import { nanoid } from 'nanoid'

const Blog = () => {
  const [confettiWidth, setConfettiWidth] = useState(0)
  const [confettiHeight, setConfettiHeight] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const fakeCards = useMemo(
    () => [
      {
        title: 'Como configurar o deploy do Turborepo no Netlify',
        published: 'Published: 21 de jun.',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
        tags: ['turborepo', 'netlify', 'howTo', 'guide', 'thayto'],
        href: 'https://dev.to/thayto/como-configurar-o-deploy-do-turborepo-no-netlify-45f8',
      },
      {
        title: "Como 'settar' a versão default do Node usando nvm",
        published: 'Published: 19 de jun.',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
        tags: ['node', 'nvm', 'thayto'],
        href: 'https://dev.to/thayto/como-settar-a-versao-default-do-node-usando-nvm-47dg',
      },
      {
        title: 'Aqui tem um artigo se pá',
        published: 'Published: 03 de jul.',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
        tags: ['tag', 'someTag', 'moreTags', 'thayto'],
        href: '/blog',
      },
      {
        title: 'Aqui tem um artigo se pá',
        published: 'Published: 03 de jul.',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
        tags: ['tag', 'someTag', 'moreTags', 'thayto'],
        href: '/blog',
      },
      {
        title: 'Aqui tem um artigo se pá',
        published: 'Published: 03 de jul.',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
        tags: ['tag', 'someTag', 'moreTags', 'thayto'],
        href: '/blog',
      },
      {
        title: 'Aqui tem um artigo se pá',
        published: 'Published: 03 de jul.',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
        tags: ['tag', 'someTag', 'moreTags', 'thayto'],
        href: '/blog',
      },
    ],
    [],
  )

  useEffect(() => {
    function handleResize() {
      setConfettiWidth(window.screen.width)
      setConfettiHeight(window.screen.height)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    setShowConfetti(true)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
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
      {showConfetti && (
        <Confetti
          width={confettiWidth}
          height={confettiHeight}
          recycle={false}
          numberOfPieces={800}
          tweenDuration={15000}
          gravity={0.15}
        />
      )}
      <Header />
      <main>
        <h1 className="text-4xl text-gray-800 font-bold m-4 text-center">Blog</h1>
        <h2 className="text-lg text-gray-800 mb-10 text-center">Aqui a gente vai ter um blog</h2>

        <div className="flex flex-wrap justify-center">
          {fakeCards.map(card => (
            <article key={nanoid()} className="m-2">
              <BlogCard
                title={card.title}
                description={card.description}
                tags={card.tags}
                published={card.published}
                href={card.href}
              />
            </article>
          ))}
        </div>
      </main>
    </>
  )
}

export default Blog
