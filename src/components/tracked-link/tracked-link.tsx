'use client'

import posthog from 'posthog-js'
import { useLocale } from 'next-intl'
import type { ReactNode } from 'react'

interface TrackedLinkProps {
  href: string
  event: string
  eventProps?: Record<string, string>
  children: ReactNode
}

export function TrackedLink({
  href,
  event,
  eventProps,
  children,
}: TrackedLinkProps) {
  const locale = useLocale()
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-75 transition-opacity"
      // the unlayered `a { text-decoration: inherit }` reset in styles.css
      // beats Tailwind's `underline` utility, so underline inline
      style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}
      onClick={() =>
        posthog.capture(event, { ...eventProps, url: href, locale })
      }
    >
      {children}
    </a>
  )
}
