import { nanoid } from 'nanoid'
import NextLink from 'next/link'
import { Link } from '@/i18n/routing'
import { useMemo } from 'react'
import { ThemeSwitcher } from '../theme-switcher/theme-switcher'
import { LanguageSwitcher } from '../language-switcher'
import { Text } from '../ui/text'

type FooterLink = {
  href: string
  name: string
}

const linkNanoId = nanoid()

export const Footer = ({
  onThemeChange,
}: {
  onThemeChange?: (theme: 'dark' | 'light') => void
}) => {
  const allLinks = useMemo<FooterLink[]>(
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
        href: '/books',
        name: 'Books',
      },
      {
        href: '/linktree',
        name: 'Linktree',
      },
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
        href: '/rss.xml',
        name: 'RSS',
      },
    ],
    [],
  )

  return (
    <footer className="mt-10 py-8 bg-slate-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-24">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-nowrap justify-center items-center gap-3 text-xs">
            {allLinks.map((link, index) => {
              const isExternal = link.href.startsWith('http')
              // App pages go through the i18n-aware Link so the current
              // locale is preserved; external URLs and static files like
              // /rss.xml must not receive a locale prefix.
              const LinkComponent =
                isExternal || link.href.includes('.') ? NextLink : Link

              return (
                <div
                  key={`${link.name}-${linkNanoId}`}
                  className="flex items-center"
                >
                  <LinkComponent
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                  >
                    <Text
                      variant="hover-decoration"
                      className="text-gray-900 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
                    >
                      {link.name}
                    </Text>
                  </LinkComponent>
                  {index < allLinks.length - 1 && (
                    <span className="ml-3 text-gray-400 dark:text-gray-600">
                      •
                    </span>
                  )}
                </div>
              )
            })}
            <div className="flex items-center">
              <span className="ml-3 text-gray-400 dark:text-gray-600">•</span>
              <div className="ml-3">
                <ThemeSwitcher onThemeChange={onThemeChange} />
              </div>
            </div>
            <div className="flex items-center">
              <span className="ml-3 text-gray-400 dark:text-gray-600">•</span>
              <div className="ml-3">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
