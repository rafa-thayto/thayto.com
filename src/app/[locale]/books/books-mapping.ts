import { type DbBook } from '@/db/schema'
import { Book } from '@/data/books.types'

export function dbBookToBook(b: DbBook): Book {
  return {
    id: b.id,
    title: b.title,
    englishTitle: b.englishTitle,
    author: b.author,
    coverUrl: b.coverUrl,
    amazonUrl: b.amazonUrl ?? undefined,
    status: b.status,
    stars: b.stars ?? undefined,
    love: b.love ?? undefined,
    createdAt: b.createdAt,
  }
}
