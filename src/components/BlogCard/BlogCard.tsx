import {
  ChatBubbleLeftEllipsisIcon,
  HeartIcon as HeartIconOutline,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { useCallback, useState } from 'react'

interface BlogCardProps {
  id: string
  title: string
  image?: {
    src: string
    alt?: string
    blurDataURL?: string
  }
  description: string
  publishedTime: Date
  tags: string[]
  href: string
  reactionsLength: number
  commentsLength: number
  priority?: boolean
}

export const BlogCard = ({
  id,
  title,
  description,
  tags,
  publishedTime,
  href,
  image,
  reactionsLength,
  commentsLength,
  priority = false,
}: BlogCardProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [hasLike, setHasLike] = useState(false)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  const handleLikeClick = useCallback(() => {
    setHasLike((oldState) => !oldState)
  }, [])

  return (
    <div className="rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 overflow-hidden shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:shadow-xl bg-white dark:bg-gray-800">
      <Link
        href={href}
        onClick={() => {
          posthog.capture('blog-card-clicked', {
            href,
            title,
          })
        }}
      >
        {image && (
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <Image
              className="object-cover transition-transform duration-200 hover:scale-105"
              fill
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              placeholder={image.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={image.blurDataURL}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={image.src}
              alt={image.alt || title}
            />
          </div>
        )}
        <div className="px-6 py-4 flex flex-col gap-2">
          <h2 className="font-bold text-slate-900 dark:text-white text-xl mb-2 line-clamp-2">
            {title}
          </h2>
          <p className="text-gray-400 text-sm mb-2">
            <time dateTime={new Date(publishedTime).toISOString()}>
              {new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'long',
              }).format(new Date(publishedTime))}
            </time>
          </p>
          <p className="text-gray-700 dark:text-slate-300 text-sm line-clamp-3">
            {description}
          </p>
        </div>
      </Link>

      <div className="px-6 pt-4 flex flex-wrap gap-2 mb-4 text-blue-800 dark:text-blue-300">
        {tags?.map((tag) => (
          <Link
            key={`tag-${tag}-${id}`}
            href={pathname + '?' + createQueryString('tag', tag)}
            rel="noopener nofollow"
            className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full px-3 py-1 text-xs font-normal hover:bg-gray-300 dark:hover:bg-slate-300 transition-colors duration-200"
          >
            #{tag}
          </Link>
        ))}
      </div>

      <div className="px-6 py-4 hidden">
        <div className="flex">
          {hasLike && (
            <HeartIconSolid
              height={24}
              className="cursor-pointer"
              color="#dc2626d9"
              onClick={handleLikeClick}
            />
          )}
          {!hasLike && (
            <HeartIconOutline
              height={24}
              className="cursor-pointer"
              color="#dc2626d9"
              onClick={handleLikeClick}
            />
          )}
          <span
            title="Number of reactions"
            className="ml-1 text-slate-800 dark:text-slate-100"
          >
            {reactionsLength + (hasLike ? 1 : 0)}
            <span>&nbsp;Reactions</span>
          </span>
        </div>

        <Link
          href={`${href}#comments`}
          aria-label={`Comments for post ${title} (${commentsLength})`}
          className="ml-4 flex"
        >
          <>
            <ChatBubbleLeftEllipsisIcon
              height={24}
              className="text-slate-800 dark:text-slate-100"
            />
            <span
              title="Number of comments"
              className="ml-1 text-slate-800 dark:text-slate-100"
            >
              {commentsLength}
              <span>&nbsp;Comments</span>
            </span>
          </>
        </Link>
      </div>
    </div>
  )
}
