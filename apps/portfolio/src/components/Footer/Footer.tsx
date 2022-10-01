import Link from 'next/link'

export const Footer = () => (
  <footer className="border-t mt-4 flex justify-end">
    <div className="px-6 py-4">
      <h6 className="text-lg font-medium">Sitemap</h6>
      <ul>
        <li className="py-1">
          <Link href="/" passHref>
            <a
              href="/"
              className="text-black underlined focus:outline-none inline-block whitespace-nowrap text-lg hover:text-black focus:text-black"
            >
              Home
            </a>
          </Link>
        </li>
        <li className="py-1">
          <Link href="/blog" passHref>
            <a
              href="/blog"
              className="text-black underlined focus:outline-none inline-block whitespace-nowrap text-lg hover:text-black focus:text-black"
            >
              Blog
            </a>
          </Link>
        </li>
        <li className="py-1">
          <Link href="/linktree" passHref>
            <a
              href="/linktree"
              className="text-black underlined focus:outline-none inline-block whitespace-nowrap text-lg hover:text-black focus:text-black"
            >
              Linktree
            </a>
          </Link>
        </li>
        <li className="py-1">
          <a
            href="/api/sitemap.xml"
            className="text-secondary underlined focus:outline-none inline-block whitespace-nowrap text-lg hover:text-team-current focus:text-team-current"
          >
            Sitemap.xml
          </a>
        </li>
      </ul>
    </div>
  </footer>
)
