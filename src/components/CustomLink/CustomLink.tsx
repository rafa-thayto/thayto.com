'use client'

import Link from 'next/link'
import posthog from 'posthog-js'
import { SITE_URL } from '@/utils/constants'

type NextLinkProps = React.ComponentPropsWithRef<typeof Link>

interface CustomLinkProps extends NextLinkProps {
  slug?: string
  locale?: string
  title?: string
}

const siteHost = new URL(SITE_URL).hostname

export const CustomLink = ({
  as,
  href,
  ref: _,
  onClick,
  slug,
  locale,
  title,
  ...otherProps
}: CustomLinkProps) => {
  if (typeof href === 'string' && /^https?:\/\//.test(href)) {
    const host = new URL(href).hostname
    if (host !== siteHost && !host.endsWith(`.${siteHost}`)) {
      return (
        <a
          href={href}
          {...otherProps}
          onClick={(event) => {
            onClick?.(event)
            posthog.capture('blog-post-outbound-link-clicked', {
              href,
              host,
              slug,
              locale,
              title,
            })
          }}
        />
      )
    }
  }
  return (
    <Link
      as={as}
      href={href}
      onClick={(event) => {
        onClick?.(event)
        posthog.capture('blog-post-internal-link-clicked', {
          href,
          locale,
          slug,
          title,
        })
      }}
      {...otherProps}
    />
  )
}
