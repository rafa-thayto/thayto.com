import { nanoid } from 'nanoid'
import Link from 'next/link'
import { useMemo } from 'react'
import { ThemeSwitcher } from '../theme-switcher/theme-switcher'

type Link = {
  href: string
  name: string
}

const linkNanoId = nanoid()

export const Footer = ({
  onThemeChange,
}: {
  onThemeChange?: (theme: 'dark' | 'light') => void
}) => {
  const sitemapLinks = useMemo<Link[]>(
    () => [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/blog',
        name: 'Blog',
      },
      {
        href: '/linktree',
        name: 'Linktree',
      },
      {
        href: '/sitemap.xml',
        name: 'Sitemap.xml',
      },
    ],
    [],
  )

  const socialLinks = useMemo<Link[]>(
    () => [
      {
        href: 'https://www.linkedin.com/in/thayto/',
        name: 'LinkedIn',
      },
      {
        href: 'https://github.com/rafa-thayto',
        name: 'GitHub',
      },
      {
        href: 'https://www.youtube.com/@thayto_dev',
        name: 'YouTube',
      },
      {
        href: 'https://www.twitch.tv/thayto_dev',
        name: 'Twitch',
      },
      {
        href: 'https://dev.to/thayto/',
        name: 'Dev.to',
      },
      {
        href: 'https://www.tabnews.com.br/thayto',
        name: 'TabNews',
      },
    ],
    [],
  )

  return (
    <>
      <div className="flex flex-col items-center mt-10">
        <ThemeSwitcher onThemeChange={onThemeChange} />
      </div>
      <footer className="border-t border-gray-200 bg-slate-50 dark:bg-gray-900 dark:border-black mt-10">
        <div className="flex justify-end gap-20 mx-10vw">
          <div className="py-14">
            <h6 className="text-lg font-medium text-black dark:text-white">
              Social
            </h6>
            <ul className="mt-4">
              {socialLinks.map((link) => (
                <li key={`${link.name}-${linkNanoId}`} className="py-1">
                  <Link
                    href={link.href}
                    className="text-gray-500 dark:text-slate-500 underlined focus:outline-none inline-block whitespace-nowrap text-lg hover:text-gray-500 dark:hover:text-slate-500 focus:text-gray-500 dark:focus:text-slate-500"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="py-14">
            <h6 className="text-lg font-medium text-black dark:text-white">
              Sitemap
            </h6>
            <ul className="mt-4">
              {sitemapLinks.map((link) => (
                <li key={`${link.name}-${linkNanoId}`} className="py-1">
                  <Link
                    href={link.href}
                    className="text-gray-500 dark:text-slate-500 underlined focus:outline-none inline-block whitespace-nowrap text-lg hover:text-gray-500 dark:hover:text-slate-500 focus:text-gray-500 dark:focus:text-slate-500"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
