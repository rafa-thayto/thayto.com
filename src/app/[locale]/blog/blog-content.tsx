'use client'

import { BlogCard } from '@/components'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useSearchParams } from 'next/navigation'
import { Post } from '@/utils/mdx'
import { toCanonicalUrl } from '@/utils/seo'
import type { Locale } from '@/i18n/config'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { ArrowLeft, Globe, List, Loader2 } from 'lucide-react'
import type { InfiniteMenuItem } from '@/components/infinite-menu'

// Lazily loaded on first switch to globe view — keeps the WebGL engine and
// gl-matrix out of the initial /blog bundle. ssr:false because it needs a
// WebGL2 canvas (client-only).
const InfiniteMenu = dynamic(() => import('@/components/infinite-menu'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-slate-500 dark:text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading globe view…</span>
    </div>
  ),
})

interface BlogContentProps {
  posts: Post[]
  locale: Locale
}

type View = 'list' | 'globe'

export function BlogContent({ posts: p, locale }: BlogContentProps) {
  const searchParams = useSearchParams()
  const [view, setView] = useState<View>('list')

  // Stable string key for the active tag filter. Deriving `tags`/`posts` inline
  // would produce a new array identity every render, which cascades into a new
  // `menuItems` reference and needlessly tears down + rebuilds the WebGL engine.
  const tagKey = searchParams?.get('tags') || searchParams?.get('tag') || ''

  const posts = useMemo(() => {
    const tags = tagKey ? tagKey.split(',') : []
    return p.filter((post) =>
      !tags.length ? true : post.data.tags.some((t) => tags.includes(t)),
    )
  }, [p, tagKey])

  // Only posts with an image can be textured onto the sphere. Locale-prefixed
  // absolute link so the component's built-in http handler opens the post (in
  // the correct language) in a new tab.
  const menuItems = useMemo<InfiniteMenuItem[]>(
    () =>
      posts
        .filter((post) => post.data.image?.src)
        .map((post) => ({
          image: `/static/images/${post.data.image.src}`,
          link: toCanonicalUrl(locale, post.data.href),
          title: post.data.title,
          description: post.data.description,
        })),
    [posts, locale],
  )

  const isGlobe = view === 'globe'

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4 px-4">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-100 transition-colors duration-200 w-fit"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Index
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView(isGlobe ? 'list' : 'globe')}
            aria-pressed={isGlobe}
            aria-label={
              isGlobe ? 'Switch to list view' : 'Switch to globe view'
            }
            title={isGlobe ? 'List view' : 'Globe view'}
            className="flex items-center justify-center w-9 h-9 rounded-md border border-slate-300 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-gray-500 transition-colors duration-200"
          >
            {isGlobe ? (
              <List className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Globe className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      {isGlobe ? (
        menuItems.length > 0 ? (
          <div
            className="relative w-full h-[70vh] rounded-lg overflow-hidden"
            style={{ position: 'relative' }}
          >
            <InfiniteMenu items={menuItems} />
          </div>
        ) : (
          <div className="flex h-[40vh] items-center justify-center text-center text-slate-500 dark:text-gray-400">
            No posts with images to show on the globe.
          </div>
        )
      ) : (
        posts?.map((post, index) => (
          <article
            key={post.data.title}
            className="w-full [&:has(a:hover)>a:not(:hover)]:opacity-30"
          >
            <BlogCard
              id={post.data.id}
              title={post.data.title}
              description={post.data.description}
              tags={post.data.tags}
              publishedTime={post.data.publishedTime}
              image={
                post.data.image && {
                  src: `/static/images/${post.data.image.src}`,
                  alt: post.data.image.alt || 'Card Hero',
                  blurDataURL: post.data.image.placeholder
                    ? `/static/images/${post.data.image.placeholder}`
                    : post.data.image.base64,
                }
              }
              href={post.data.href}
              reactionsLength={post.data.reactionsLength}
              commentsLength={post.data.commentsLength}
              priority={index < 3}
            />
          </article>
        ))
      )}
    </div>
  )
}
