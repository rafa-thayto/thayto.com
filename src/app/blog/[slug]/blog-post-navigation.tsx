'use client'

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { posthog } from 'posthog-js'

interface BlogPostNavigationProps {
  prevPost?: { slug: string; title: string } | null
  nextPost?: { slug: string; title: string } | null
  title: string
  position: 'top' | 'bottom'
}

export function BlogPostNavigation({
  prevPost,
  nextPost,
  title,
  position,
}: BlogPostNavigationProps) {
  if (position === 'top') {
    return (
      <nav className="py-8">
        <Link
          href="/blog"
          onClick={() => {
            posthog.capture('blog-post-back-btn', {
              title: title,
            })
          }}
          className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Voltar para o blog
        </Link>
      </nav>
    )
  }

  return (
    <>
      {(prevPost || nextPost) && (
        <nav className="mt-12 mb-16">
          <div className="grid gap-6 md:grid-cols-2">
            {prevPost && (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                onClick={() => {
                  posthog.capture('change-post-btn', {
                    href: `/blog/${prevPost.slug}`,
                    title: prevPost.title,
                  })
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <ArrowLeftIcon className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:-translate-x-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                      Artigo anterior
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {prevPost.title}
                    </h3>
                  </div>
                </div>
              </Link>
            )}

            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700 md:text-right"
                onClick={() => {
                  posthog.capture('change-post-btn', {
                    href: `/blog/${nextPost.slug}`,
                    title: nextPost.title,
                  })
                }}
              >
                <div className="flex items-start space-x-4 md:flex-row-reverse md:space-x-reverse">
                  <div className="flex-shrink-0">
                    <ArrowRightIcon className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                      Próximo artigo
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {nextPost.title}
                    </h3>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  )
}
