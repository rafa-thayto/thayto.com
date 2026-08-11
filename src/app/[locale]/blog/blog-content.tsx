'use client'

import { BlogCard } from '@/components'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useSearchParams } from 'next/navigation'
import { Post } from '@/utils/mdx'
import { matchesSearch } from '@/utils/post-search'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface BlogContentProps {
  posts: Post[]
}

export function BlogContent({ posts: p }: BlogContentProps) {
  const t = useTranslations('blog')
  const searchParams = useSearchParams()
  const search = searchParams?.get('tags') || searchParams?.get('tag')
  const [query, setQuery] = useState(searchParams?.get('q') ?? '')
  const tags = search?.split(',')
  const posts = p
    .filter((post) =>
      !tags?.length ? true : post.data.tags.some((t) => tags.includes(t)),
    )
    .filter((post) => matchesSearch(query, post.data))

  const handleQueryChange = (value: string) => {
    setQuery(value)
    // Keep ?q= shareable (and honest for the WebSite SearchAction schema)
    // without triggering a navigation on every keystroke.
    const params = new URLSearchParams(searchParams?.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    const queryString = params.toString()
    window.history.replaceState(
      null,
      '',
      queryString ? `?${queryString}` : window.location.pathname,
    )
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
        <LanguageSwitcher />
      </div>
      <label className="flex items-center gap-2 mb-2 text-sm text-slate-600 dark:text-gray-400 focus-within:text-slate-800 dark:focus-within:text-gray-100 transition-colors duration-200">
        <Search className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full bg-transparent text-sm text-slate-800 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none"
        />
      </label>
      {posts?.map((post, index) => (
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
      ))}
    </div>
  )
}
