import { nanoid } from 'nanoid'
import Link from 'next/link'
import { useMemo } from 'react'

const sunIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="24"
    fill="none"
    viewBox="0 0 25 24"
    className="dark:opacity-50"
  >
    <g
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      clipPath="url(#clip0_192_823)"
    >
      <path d="M12.5 17a5 5 0 100-10 5 5 0 000 10zM12.5 1v2M12.5 21v2M4.72 4.22l1.42 1.42M18.86 18.36l1.42 1.42M1.5 12h2M21.5 12h2M4.72 19.78l1.42-1.42M18.86 5.64l1.42-1.42"></path>
    </g>
    <defs>
      <clipPath id="clip0_192_823">
        <path
          className="fill-current text-white"
          d="M0 0H24V24H0z"
          transform="translate(.5)"
        ></path>
      </clipPath>
    </defs>
  </svg>
)

const moonIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    fill="none"
    viewBox="0 0 21 20"
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="stroke-current text-gray-400 dark:text-white"
      d="M19.5 10.79A9 9 0 119.71 1a7 7 0 009.79 9.79v0z"
    ></path>
  </svg>
)

const ThemeSwitcher = () => {
  return (
    <div className="flex mt-6 bg-white justify-center dark:bg-gray-800 rounded-3xl p-1 shadow items-center">
      <button
        type="button"
        aria-label="Use Dark Mode"
        onClick={() => {
          window.umami.track('switch-theme', {
            from: 'dark-to-light',
          })
          document.documentElement.classList.add('dark')
          localStorage.setItem('theme', 'dark')
        }}
        className="flex items-center h-full pr-2 dark:bg-indigo-500 rounded-3xl justify-center align-center p-2 w-24 transition"
      >
        {moonIcon}
      </button>

      <button
        type="button"
        aria-label="Use Light Mode"
        onClick={() => {
          window.umami.track('switch-theme', {
            from: 'light-to-dark',
          })
          document.documentElement.classList.remove('dark')
          localStorage.setItem('theme', 'light')
        }}
        className="flex items-center h-full pr-2 bg-indigo-500 dark:bg-transparent rounded-3xl justify-center align-center p-2 w-24 transition"
      >
        {sunIcon}
      </button>
    </div>
  )
}

type Link = {
  href: string
  name: string
}

export const Footer = () => {
  const linkNanoId = nanoid()
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

  return (
    <>
      <div className="flex flex-col items-center">
        <ThemeSwitcher />
      </div>
      <footer className="border-t border-gray-200 bg-slate-50 dark:bg-gray-900 dark:border-black mt-10 flex justify-end">
        <div className="px-20 py-14 md:px-32">
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
      </footer>
    </>
  )
}
