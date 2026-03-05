'use client'

import Image from 'next/image'
import { BookStatus } from '@/data/books.types'

interface BookCardProps {
  title: string
  author: string
  coverUrl: string
  amazonUrl?: string
  status: BookStatus
  statusLabel: string
  stars?: number
}

const statusColors: Record<BookStatus, string> = {
  READ: 'text-emerald-500',
  READING: 'text-orange-500',
  BUY: 'text-sky-500',
  WILL_READ: 'text-amber-500',
  DROPPED: 'text-red-500',
}

export const BookCard = ({
  title,
  author,
  coverUrl,
  amazonUrl,
  status,
  statusLabel,
  stars,
}: BookCardProps) => {
  const cardContent = (
    <div className="group relative w-fit">
      <div className="book-card book-cover relative overflow-hidden rounded-sm">
        <Image
          src={coverUrl}
          alt={title}
          width={120}
          height={180}
          className="transition-all duration-100 ease-in-out"
          unoptimized
        />
      </div>

      <div
        className={`mt-2 text-xs font-medium ${statusColors[status]}`}
        aria-label={`Status: ${statusLabel}`}
      >
        {statusLabel}
      </div>

      <h3 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 mt-1">
        {title}
      </h3>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {author}
      </p>

      {stars && (
        <div
          className="flex mt-1"
          aria-label={`Rating: ${stars} out of 5 stars`}
        >
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${
                i < stars
                  ? 'text-amber-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      )}
    </div>
  )

  if (amazonUrl) {
    return (
      <a
        href={amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-opacity hover:opacity-90"
        aria-label={`View ${title} on Amazon`}
      >
        {cardContent}
      </a>
    )
  }

  return cardContent
}
