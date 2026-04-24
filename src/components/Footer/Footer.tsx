import { nanoid } from 'nanoid'
import Link from 'next/link'
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
        name: 'Library',
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
            {allLinks.map((link, index) => (
              <div
                key={`${link.name}-${linkNanoId}`}
                className="flex items-center"
              >
                <Link
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    link.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                >
                  <Text
                    variant="hover-decoration"
                    className="text-gray-900 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    {link.name}
                  </Text>
                </Link>
                {index < allLinks.length - 1 && (
                  <span className="ml-3 text-gray-400 dark:text-gray-600">
                    •
                  </span>
                )}
              </div>
            ))}
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
