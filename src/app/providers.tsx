'use client'

import { posthog } from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { OutlitProvider } from '@outlit/browser/react'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
  })
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OutlitProvider
      publicKey={process.env.NEXT_PUBLIC_OUTLIT_PUBLIC_KEY!}
      trackPageviews
      trackForms
      autoIdentify
      trackCalendarEmbeds
    >
      <PostHogProvider client={posthog}>{children}</PostHogProvider>
    </OutlitProvider>
  )
}
