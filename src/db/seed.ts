import booksData from '@/data/books.json'
import { Book } from '@/data/books.types'
import { db } from './index'
import { books } from './schema'

async function seed() {
  const source = booksData as Book[]

  console.log(`Seeding ${source.length} books...`)

  await db.delete(books)

  await db.insert(books).values(
    source.map((b) => ({
      id: b.id,
      title: b.title,
      englishTitle: b.englishTitle,
      author: b.author,
      coverUrl: b.coverUrl,
      amazonUrl: b.amazonUrl ?? null,
      status: b.status,
      stars: b.stars ?? null,
      love: b.love ?? null,
      createdAt: b.createdAt,
    })),
  )

  const count = await db.$count(books)
  console.log(`Seed complete. ${count} books in database.`)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
