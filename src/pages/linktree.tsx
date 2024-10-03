import { DevTo, Footer, GitHub, LinkedIn, TabNews, Twitter } from '@/components'
import { Bsky } from '@/components/Icons/Bsky'
import { Twitch } from '@/components/Icons/Twitch'
import { IconProps } from '@/components/Icons/types'
import { YouTube } from '@/components/Icons/YouTube'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import posthog from 'posthog-js'
import { useState } from 'react'

type ButtonLink = {
  href: string
  Icon?: (({ color }: IconProps) => JSX.Element) | null
  text: string
}

const links: ButtonLink[] = [
  {
    href: 'https://podcasters.spotify.com/pod/show/devseniorscast',
    Icon: null,
    text: '🎙️ DevSenior Cast',
  },
  {
    href: 'https://hotm.art/hnWXd89A',
    Icon: null,
    text: 'Formação TS <- conteúdo infinito sobre TS',
  },
  {
    href: 'https://bit.ly/3nLnPQZ',
    Icon: null,
    text: 'CRUD com qualidade - Curso DevSoutinho',
  },
  {
    href: 'https://github.com/rafa-thayto/lazy-thayto-vim',
    Icon: null,
    text: '❤️ Neovim Configs',
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
    href: 'https://www.youtube.com/@thayto_dev',
    Icon: YouTube,
    text: 'Youtube',
  },
  {
    href: 'https://github.com/rafa-thayto',
    Icon: GitHub,
    text: 'GitHub',
  },
  {
    href: 'https://bsky.app/profile/thayto.dev',
    Icon: Bsky,
    text: 'Bluesky',
  },
  {
    href: 'https://twitch.tv/thayto_dev',
    Icon: Twitch,
    text: 'Twitch',
  },
  {
    href: 'https://www.amazon.com.br/dp/8575226932?&_encoding=UTF8&tag=thayto-20&linkCode=ur2&linkId=a8887fab2c901ae25fb1855a72f0bc61&camp=1789&creative=9325',
    Icon: null,
    text: 'Estrutura de dados e algoritmos com JavaScript - Loiane',
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
    href: 'https://twitter.com/thayto_dev',
    Icon: Twitter,
    text: 'Twitter',
  },
]

const description = 'Minha árvore de links'

const LinksPage = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const handleThemeChange = (theme: 'dark' | 'light') => {
    setTheme(theme)
  }

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
                  posthog.capture('linktree-button-clicked', {
                    href,
                    title: text,
                  })
                }}
              >
                {Icon && (
                  <span className="mr-4">
                    <Icon color={theme === 'dark' ? '#fff' : '#121212'} />
                  </span>
                )}
                {text}
              </Link>
            ))}
          </main>
        </div>
        <Footer onThemeChange={handleThemeChange} />
      </div>
    </>
  )
}

export default LinksPage
