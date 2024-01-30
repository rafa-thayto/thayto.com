import {
  DevTo,
  Footer,
  GitHub,
  LinkedIn,
  Medium,
  TabNews,
  Twitter,
} from '@src/components'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'

const LinksPage = () => {
  const description = 'Minha árvore de links'

  type ButtonLink = {
    href: string
    Icon?: (() => JSX.Element) | null
    text: string
  }

  const links: ButtonLink[] = [
    {
      href: 'https://podcasters.spotify.com/pod/show/devseniorscast',
      Icon: null,
      text: '🎙️ DevSenior Cast',
    },
    {
      href: 'https://bit.ly/3nLnPQZ',
      Icon: null,
      text: 'CRUD com qualidade - Curso DevSoutinho',
    },
    {
      href: '/blog',
      Icon: null,
      text: 'Blog',
    },
    {
      href: 'https://www.linkedin.com/in/thayto/',
      Icon: LinkedIn,
      text: 'LinkedIn',
    },
    {
      href: 'https://twitter.com/thayto_dev',
      Icon: Twitter,
      text: 'Twitter',
    },
    {
      href: 'https://twitch.tv/thayto_dev',
      Icon: null,
      text: 'Twitch',
    },
    {
      href: 'https://www.youtube.com/@thayto_dev',
      Icon: null,
      text: 'Youtube',
    },
    {
      href: 'https://github.com/rafa-thayto',
      Icon: GitHub,
      text: 'GitHub',
    },
    {
      href: 'https://dev.to/thayto/',
      Icon: DevTo,
      text: 'Dev.to',
    },
    {
      href: 'https://www.tabnews.com.br/thayto',
      Icon: TabNews,
      text: 'TabNews',
    },
    {
      href: 'https://medium.com/@thayto',
      Icon: Medium,
      text: 'Medium',
    },
    {
      href: 'https://www.amazon.com.br/dp/8575226932?&_encoding=UTF8&tag=thayto-20&linkCode=ur2&linkId=a8887fab2c901ae25fb1855a72f0bc61&camp=1789&creative=9325',
      Icon: null,
      text: 'Estrutura de dados e algoritmos com JavaScript - Loiane',
    },
  ]

  return (
    <>
      <NextSeo
        title="Rafael Thayto - Linktree"
        description={description}
        canonical="https://thayto.com/linktree"
        openGraph={{
          type: 'article',
          url: `https://thayto.com/linktree`,
          title: 'Rafael Thayto - Linktree',
          description,
          article: {
            authors: ['Rafael Thayto'],
          },
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
      <div className="mx-0 pt-4 bg-slate-50 dark:bg-gray-900">
        <div className="px-8">
          <header className="mb-8 mx-auto">
            <div className="relative w-44 h-44 mb-4 mx-auto">
              <Image
                src="/static/images/profile.jpg"
                alt="Thayto's profile picture"
                fill
                priority
                className="rounded-full"
              />
            </div>
            <h1 className="text-2xl text-slate-900 dark:text-white font-bold text-center">
              Rafael Thayto Tani
            </h1>
          </header>
          <main className="lg:mx-72 xl:mx-96 mb-10">
            {links.map(({ Icon, href, text }) => (
              <Link
                key={text}
                href={href}
                className="flex justify-center font-medium cursor-pointer rounded-full border border-slate-900 hover:hover:bg-indigo-300 dark:hover:hover:bg-indigo-500 px-10 py-4 mb-4 text-slate-900 dark:text-gray-300 bg-white dark:bg-gray-600"
                onClick={() => {
                  window.simplytics.track('linktree-button-clicked', {
                    name: 'linktree-button-clicked',
                    data: {
                      href,
                      title: text,
                    },
                  })
                }}
              >
                {text}
                {Icon && (
                  <span className="ml-4">
                    <Icon />
                  </span>
                )}
              </Link>
            ))}
          </main>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default LinksPage
