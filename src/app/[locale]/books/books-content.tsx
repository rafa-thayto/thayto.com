'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Book, BookStatus, SortType } from '@/data/books.types'
import { getBooksByStatus, sortBooks, getFavorites } from '@/data/books.utils'
import { BookCard } from '@/components/BookCard'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Link } from '@/i18n/routing'
import {
  ArrowLeft,
  Filter as FilterIcon,
  ArrowUpDown,
  Languages,
  X,
  ThumbsUp,
  ThumbsDown,
  ArrowDownAZ,
  ArrowUpZA,
  Heart,
  BookOpen,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BooksContentProps {
  books: Book[]
  locale: string
}

const statusFilters: {
  status: BookStatus
  color: string
  key: string
}[] = [
  { status: 'READ', color: 'text-emerald-500', key: 'read' },
  { status: 'READING', color: 'text-orange-500', key: 'reading' },
  { status: 'BUY', color: 'text-sky-500', key: 'buy' },
  { status: 'WILL_READ', color: 'text-amber-500', key: 'willRead' },
  { status: 'DROPPED', color: 'text-red-500', key: 'dropped' },
]

const sortOptions: {
  type: SortType
  icon: typeof ThumbsUp
  key: string
}[] = [
  { type: 'BEST', icon: ThumbsUp, key: 'best' },
  { type: 'WORST', icon: ThumbsDown, key: 'worst' },
  { type: 'ABC', icon: ArrowDownAZ, key: 'abc' },
  { type: 'ZXY', icon: ArrowUpZA, key: 'zxy' },
]

function DismissIcon({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          initial={{ opacity: 0, x: -4, filter: 'blur(4px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -4, filter: 'blur(4px)' }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="ml-auto"
        >
          <X className="w-3 h-3" />
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export function BooksContent({ books, locale }: BooksContentProps) {
  const t = useTranslations('books')

  const [selectedStatus, setSelectedStatus] = useState<BookStatus | null>(null)
  const [selectedSort, setSelectedSort] = useState<SortType | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)

  const filteredBooks = useMemo(() => {
    let result = books

    if (showFavorites) {
      result = getFavorites(result)
    }

    if (selectedStatus) {
      result = getBooksByStatus(result, selectedStatus)
    }

    return sortBooks(result, selectedSort)
  }, [books, selectedStatus, selectedSort, showFavorites])

  const toggleFilter = (status: BookStatus) => {
    setSelectedStatus(selectedStatus === status ? null : status)
  }

  const toggleSort = (sort: SortType) => {
    setSelectedSort(selectedSort === sort ? null : sort)
  }

  return (
    <main className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-40 flex-shrink-0 space-y-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </Link>

          {/* Filters */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <FilterIcon className="w-4 h-4" />
              {t('filters')}
            </div>
            <div className="space-y-1">
              {statusFilters.map(({ status, color, key }) => {
                const isActive = selectedStatus === status
                const isInactive = selectedStatus && selectedStatus !== status

                return (
                  <button
                    key={status}
                    onClick={() => toggleFilter(status)}
                    className={`flex items-center gap-2 text-sm w-full cursor-pointer transition-opacity ${color} ${
                      isInactive ? 'opacity-50' : ''
                    } hover:opacity-100`}
                  >
                    <BookOpen
                      className="w-4 h-4"
                      fill={isActive ? 'currentColor' : 'none'}
                    />
                    {t(`status.${key}`)}
                    <DismissIcon visible={isActive} />
                  </button>
                )
              })}

              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`flex items-center gap-2 text-sm w-full cursor-pointer transition-opacity text-pink-500 ${
                  selectedStatus ? 'opacity-50' : ''
                } hover:opacity-100`}
              >
                <Heart
                  className="w-4 h-4"
                  fill={showFavorites ? 'currentColor' : 'none'}
                />
                {t('status.favorites')}
                <DismissIcon visible={showFavorites} />
              </button>
            </div>
          </div>

          {/* Sort */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <ArrowUpDown className="w-4 h-4" />
              {t('sort')}
            </div>
            <div className="space-y-1">
              {sortOptions.map(({ type, icon: Icon, key }) => {
                const isActive = selectedSort === type
                const isInactive = selectedSort && selectedSort !== type

                return (
                  <button
                    key={type}
                    onClick={() => toggleSort(type)}
                    className={`flex items-center gap-2 text-sm w-full cursor-pointer transition-opacity text-gray-700 dark:text-gray-200 ${
                      isInactive ? 'opacity-50' : ''
                    } hover:opacity-100`}
                  >
                    <Icon className="w-4 h-4" />
                    {t(`sortOptions.${key}`)}
                    <DismissIcon visible={isActive} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Language */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Languages className="w-4 h-4" />
              {t('lang')}
            </div>
            <LanguageSwitcher />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t('pageTitle')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {t('pageSubtitle')}
          </p>

          <div className="grid grid-cols-2 gap-8 gap-y-12 md:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                title={locale === 'pt' ? book.title : book.englishTitle}
                author={book.author}
                coverUrl={book.coverUrl}
                amazonUrl={book.amazonUrl}
                status={book.status}
                statusLabel={t(
                  `status.${
                    book.status === 'WILL_READ'
                      ? 'willRead'
                      : book.status.toLowerCase()
                  }`,
                )}
                stars={book.stars}
              />
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>{t('noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
