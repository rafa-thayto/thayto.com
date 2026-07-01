'use client'

import { BlogCard } from '@/components'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useSearchParams } from 'next/navigation'
import { Post } from '@/utils/mdx'
import { toCanonicalUrl } from '@/utils/seo'
import type { Locale } from '@/i18n/config'
import { Link as LocaleLink } from '@/i18n/routing'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Globe, List, Loader2 } from 'lucide-react'
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
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMoving, setIsMoving] = useState(false)

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

  // Only posts with an image can be textured onto the sphere.
  const globePosts = useMemo(
    () => posts.filter((post) => post.data.image?.src),
    [posts],
  )

  const menuItems = useMemo<InfiniteMenuItem[]>(
    () =>
      globePosts.map((post) => ({
        image: `/static/images/${post.data.image.src}`,
        link: toCanonicalUrl(locale, post.data.href),
        title: post.data.title,
        description: post.data.description,
      })),
    [globePosts, locale],
  )

  const isGlobe = view === 'globe'
  const activePost = globePosts[activeIndex] ?? globePosts[0]

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
          <div className="flex flex-col items-center">
            {/* Square, centered stage: the sphere's FOV is symmetric only at a
                1:1 aspect — a wide/short box flings edge discs into the corners. */}
            <div className="relative w-full max-w-[520px] aspect-square mx-auto select-none">
              <InfiniteMenu
                items={menuItems}
                onActiveIndex={setActiveIndex}
                onMovingChange={setIsMoving}
              />
            </div>

            {/* Active-post caption rendered in normal flow, styled to match the
                site — avoids the demo overlay that mangled long titles. */}
            <div
              className={`w-full max-w-xl mt-2 flex flex-col items-center gap-3 text-center transition-opacity duration-300 ${
                isMoving ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {activePost && (
                <>
                  <LocaleLink
                    href={activePost.data.href}
                    className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                  >
                    {activePost.data.title}
                  </LocaleLink>
                  <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2">
                    {activePost.data.description}
                  </p>
                  <LocaleLink
                    href={activePost.data.href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 transition-colors"
                  >
                    Read post
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </LocaleLink>
                </>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-400 dark:text-gray-500">
              Drag to spin · click “Read post” to open
            </p>
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
