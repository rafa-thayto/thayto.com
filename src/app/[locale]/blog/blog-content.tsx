'use client'

import { BlogCard } from '@/components'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useSearchParams } from 'next/navigation'
import { Post } from '@/utils/mdx'
import { toCanonicalUrl } from '@/utils/seo'
import type { Locale } from '@/i18n/config'
import { Link as LocaleLink, useRouter } from '@/i18n/routing'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
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
      <Loader2
        className="w-6 h-6 animate-spin motion-reduce:animate-none"
        aria-hidden="true"
      />
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

  const router = useRouter()

  // Keyboard path for the globe: Enter opens the highlighted (front-facing)
  // post. Arrow browsing would need the engine to rotate to an index, which it
  // can't yet — so we don't advertise what we can't do.
  const handleStageKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && activePost) {
      e.preventDefault()
      router.push(activePost.data.href)
    }
  }

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
            className="relative flex select-none items-center justify-center w-9 h-9 rounded-md border border-slate-300 dark:border-gray-700 text-slate-600 dark:text-gray-300 transition-[color,background-color,border-color,transform] duration-150 ease-out hover:text-slate-900 hover:border-slate-400 dark:hover:text-white dark:hover:border-gray-500 aria-pressed:bg-slate-100 aria-pressed:border-slate-400 aria-pressed:text-slate-900 dark:aria-pressed:bg-gray-800 dark:aria-pressed:border-gray-500 dark:aria-pressed:text-white active:scale-95 active:duration-75 motion-reduce:transition-none motion-reduce:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-black before:absolute before:-inset-1 before:content-['']"
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

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-col gap-4"
        >
          {isGlobe ? (
            menuItems.length > 0 ? (
              <div className="flex flex-col items-center">
                {/* Square, centered stage: the sphere's FOV is symmetric only at a
                1:1 aspect — a wide/short box flings edge discs into the corners. */}
                <div
                  tabIndex={0}
                  role="group"
                  aria-label="Blog posts globe — drag to spin, press Enter to open the highlighted post"
                  onKeyDown={handleStageKeyDown}
                  className="relative w-full max-w-[520px] aspect-square mx-auto select-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-black"
                >
                  <InfiniteMenu
                    items={menuItems}
                    onActiveIndex={setActiveIndex}
                    onMovingChange={setIsMoving}
                  />
                </div>

                {/* Active-post caption in normal flow. Outer div owns the drag-dim
                (CSS); the keyed motion.div owns the per-post crossfade so the two
                never fight. Reserved min-height keeps the hint below from jumping
                during the mode="wait" swap gap. */}
                <div
                  aria-live={isMoving ? 'off' : 'polite'}
                  aria-atomic="true"
                  className={`w-full max-w-md mt-6 min-h-[10.5rem] flex flex-col items-center justify-start text-center transition-[opacity,filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
                    isMoving ? 'opacity-55 blur-[2px]' : 'opacity-100 blur-none'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {activePost && (
                      <motion.div
                        key={activePost.data.href}
                        initial={{ opacity: 0, y: 4, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 4, filter: 'blur(4px)' }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex w-full flex-col items-center gap-4"
                      >
                        <div className="flex flex-col items-center gap-1.5">
                          <LocaleLink
                            href={activePost.data.href}
                            className="rounded-sm text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-slate-900 dark:text-gray-50 underline decoration-2 underline-offset-4 decoration-transparent hover:text-blue-600 hover:decoration-blue-600/40 dark:hover:text-blue-400 dark:hover:decoration-blue-400/40 line-clamp-2 transition-colors duration-150 ease-out motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-black"
                          >
                            {activePost.data.title}
                          </LocaleLink>
                          <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-gray-400 line-clamp-2">
                            {activePost.data.description}
                          </p>
                        </div>
                        <LocaleLink
                          href={activePost.data.href}
                          className="group inline-flex select-none items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-[background-color,transform] duration-150 ease-out hover:bg-blue-500 active:scale-[0.97] active:duration-75 motion-reduce:transition-none motion-reduce:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-black"
                        >
                          Read post
                          <ArrowUpRight
                            className="w-4 h-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                            aria-hidden="true"
                          />
                        </LocaleLink>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <p
                  className={`mt-6 text-xs text-slate-500 dark:text-gray-400 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                    isMoving ? 'opacity-70' : 'opacity-100'
                  }`}
                >
                  <span aria-hidden="true">
                    Drag to spin · click “Read post” to open
                  </span>
                  <span className="sr-only">
                    Drag to spin the globe, or press Enter while it is focused
                    to open the highlighted post.
                  </span>
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
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
