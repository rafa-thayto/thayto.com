'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'

type PosthogLocaleRegisterProps = {
  locale: string
}

export function PosthogLocaleRegister({ locale }: PosthogLocaleRegisterProps) {
  useEffect(() => {
    posthog.register({ locale })
  }, [locale])

  return null
}
