import 'server-only'
import { unstable_cache } from 'next/cache'
import { desc } from 'drizzle-orm'
import { db } from '@/db'
import { books as booksTable } from '@/db/schema'
import { Book } from '@/data/books.types'
import { dbBookToBook } from './books-mapping'

// Revalidate the cached read at most once every 24h.
export const BOOKS_REVALIDATE_SECONDS = 86400

// Cache tag for on-demand revalidation: after re-seeding the production
// database, call revalidateTag(BOOKS_CACHE_TAG) to refresh immediately instead
// of waiting for the time-based window.
export const BOOKS_CACHE_TAG = 'books'

// Caches the libSQL read at the data layer so the static /books page can be
// regenerated on a timer (or invalidated on demand) without querying the
// database on every render. unstable_cache is the stable App Router primitive
// for caching non-fetch data sources on this Next.js config (the newer
// 'use cache' directive requires the cacheComponents experimental flag).
export const getBooks = unstable_cache(
  async (): Promise<Book[]> => {
    const rows = await db
      .select()
      .from(booksTable)
      .orderBy(desc(booksTable.createdAt))
    return rows.map(dbBookToBook)
  },
  ['books-list'],
  { revalidate: BOOKS_REVALIDATE_SECONDS, tags: [BOOKS_CACHE_TAG] },
)
