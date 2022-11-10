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
    Icon?: () => JSX.Element
    text: string
  }

  const links: ButtonLink[] = [
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
      href: 'https://twitter.com/_thayto',
      Icon: Twitter,
      text: 'Twitter',
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
      <div className="mx-0 pt-4 bg-slate-50 dark:bg-gray-900">
        <div className="px-8">
          <header className="mb-8 mx-auto">
            <div className="relative w-44 h-44 mb-4 mx-auto">
              <Image
                src="/static/images/profile.jpeg"
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
