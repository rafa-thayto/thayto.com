import {
  ChatBubbleLeftEllipsisIcon,
  HeartIcon as HeartIconOutline,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'

interface BlogCardProps {
  title: string
  image?: {
    src: string
    alt?: string
  }
  description: string
  publishedTime: Date
  tags: string[]
  href: string
  reactionsLength: number
  commentsLength: number
}

export const BlogCard = ({
  title,
  description,
  tags,
  publishedTime,
  href,
  image,
  reactionsLength,
  commentsLength,
}: BlogCardProps) => {
  const [hasLike, setHasLike] = useState(false)

  const handleLikeClick = useCallback(() => {
    setHasLike((oldState) => !oldState)
  }, [])

  return (
    <div className="rounded-lg overflow-hidden shadow-lg transition border-gray-400 dark:border-black hover:border-indigo-300 hover:border border bg-slate-50 dark:bg-gray-800">
      <Link href={href} passHref>
        <a>
          {image && (
            <Link href={href} passHref>
              <a className="cursor-pointer" aria-label="Post Preview Image">
                <div className="h-64 relative">
                  <Image
                    className="object-cover"
                    layout="fill"
                    src={image.src}
                    alt={image.alt || title}
                  />
                </div>
              </a>
            </Link>
          )}
          <div className="px-6 py-4 ">
            <Link href={href} passHref>
              <a className="cursor-pointer" aria-label="Post Preview Title">
                <h1 className="font-bold text-slate-900 dark:text-white text-xl mb-2">
                  {title}
                </h1>
              </a>
            </Link>
            <p className="text-gray-400 text-sm mb-2">
              {new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'long',
              }).format(new Date(publishedTime))}
            </p>
            <p className="text-gray-700 dark:text-slate-300 text-base">
              {description}
            </p>
          </div>
        </a>
      </Link>

      <div className="px-6 pt-4 pb-2">
        {tags?.map((tag) => (
          <Link key={tag} href={`/blog?tag=${tag}`} passHref>
            <a
              rel="noopener nofollow"
              className="inline-block bg-gray-200 dark:bg-slate-400 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-800 mr-2 mb-2"
            >
              #{tag}
            </a>
          </Link>
        ))}
      </div>

      <div className="px-6 py-4 flex">
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

        <Link href={`${href}#comments`} passHref>
          <a
            aria-label={`Comments for post ${title} (${commentsLength})`}
            className="ml-4 flex"
          >
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
          </a>
        </Link>
      </div>
    </div>
  )
}
