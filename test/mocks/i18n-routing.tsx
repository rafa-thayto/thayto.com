import { vi } from 'vitest'

export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
}))

export const usePathname = vi.fn(() => '/')
export const useParams = vi.fn(() => ({ locale: 'pt' }))

export const Link = ({ children, href, ...props }: any) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

export const routing = {
  locales: ['pt', 'en'],
  defaultLocale: 'pt',
}
