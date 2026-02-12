'use client'

import { posthog } from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { init as outlitInit, track as outlitTrack } from '@outlit/browser'
import { HumanBehaviorProvider } from 'humanbehavior-js/react'

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

if (
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_OUTLIT_PUBLIC_KEY
) {
  outlitInit({
    publicKey: process.env.NEXT_PUBLIC_OUTLIT_PUBLIC_KEY,
    trackPageviews: true,
    trackForms: true,
    autoIdentify: true,
    trackCalendarEmbeds: true,
  })
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <HumanBehaviorProvider
        apiKey={process.env.NEXT_PUBLIC_HUMANBEHAVIOR_API_KEY}
        options={{
          redactionStrategy: {
            mode: 'visibility-first' as const,
          },
        }}
      >
        {children}
      </HumanBehaviorProvider>
    </PostHogProvider>
  )
}
