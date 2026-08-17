'use client'

import posthog from 'posthog-js'
import { useEffect, useRef } from 'react'

const THRESHOLDS = [25, 50, 75, 100]

interface ReadingProgressProps {
  slug: string
  title: string
  locale: string
  wordCount: number
}

export function ReadingProgress({
  slug,
  title,
  locale,
  wordCount,
}: ReadingProgressProps) {
  const reached = useRef<Set<number>>(new Set())

  useEffect(() => {
    const article = document.querySelector('article')
    if (!article) return

    reached.current = new Set()

    const onScroll = () => {
      const { top, height } = article.getBoundingClientRect()
      // portion of the article above the viewport's bottom edge = amount read
      const scrolled = Math.min(Math.max(window.innerHeight - top, 0), height)
      const depth = (scrolled / height) * 100

      for (const threshold of THRESHOLDS) {
        if (depth >= threshold && !reached.current.has(threshold)) {
          reached.current.add(threshold)
          posthog.capture('blog-post-scroll-depth-reached', {
            depth: threshold,
            slug,
            title,
            locale,
            wordCount,
          })
        }
      }

      if (reached.current.size === THRESHOLDS.length) {
        window.removeEventListener('scroll', onScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug, title, locale, wordCount])

  return null
}
