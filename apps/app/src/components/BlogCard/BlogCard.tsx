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
  published: string
  tags: string[]
  href: string
  reactionsLength: number
  commentsLength: number
}

export const BlogCard = ({
  title,
  description,
  tags,
  published,
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
    <div className="rounded overflow-hidden shadow-lg border-gray-400 hover:border-orange-300 border">
      <Link href={href} passHref>
        <>
          {image && (
            <a
              rel="noopener follow"
              className="cursor-pointer"
              aria-label="Post Preview Image"
            >
              <div className="h-64 relative">
                <Image
                  className="object-cover"
                  layout="fill"
                  src={image.src}
                  alt={image.alt || title}
                />
              </div>
            </a>
          )}
          <div className="px-6 py-4 ">
            <a
              rel="noopener"
              className="cursor-pointer"
              aria-label="Post Preview Title"
            >
              <h1 className="font-bold text-xl mb-2">{title}</h1>
            </a>
            <p className="text-gray-400 text-sm mb-2">{published}</p>
            <p className="text-gray-700 text-base">{description}</p>
          </div>
        </>
      </Link>
      <div className="px-6 pt-4 pb-2">
        {tags?.map((tag) => (
          <a
            rel="noopener nofollow"
            key={tag}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            #{tag}
          </a>
        ))}
      </div>
      <div className="px-6 pt-4 pb-4 flex">
        {/* <Link href={href} passHref> */}
        <a className="flex">
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
          <span title="Number of reactions" className="ml-1">
            {reactionsLength + (hasLike ? 1 : 0)}
            <span>&nbsp;Reactions</span>
          </span>
        </a>
        {/* </Link> */}
        <Link href={`${href}#comments`} passHref>
          <a
            aria-label={`Comments for post ${title} (${commentsLength})`}
            className="ml-4 flex"
          >
            <ChatBubbleLeftEllipsisIcon height={24} />
            <span title="Number of comments" className="ml-1">
              {commentsLength}
              <span>&nbsp;Comments</span>
            </span>
          </a>
        </Link>
      </div>
    </div>
  )
}
