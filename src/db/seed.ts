import booksData from '@/data/books.json'
import { Book } from '@/data/books.types'
import { db } from './index'
import { books, BOOK_STATUSES } from './schema'

// SQLite does not enforce the status enum (Drizzle's enum is TS-only), so we
// validate the seed source at runtime to fail loudly on bad data before insert.
function assertValidStatuses(source: Book[]) {
  const allowed = new Set<string>(BOOK_STATUSES)
  const invalid = source.filter((b) => !allowed.has(b.status))
  if (invalid.length > 0) {
    const offenders = invalid.map((b) => `${b.id} (${b.status})`).join(', ')
    throw new Error(
      `Invalid book status(es) in books.json: ${offenders}. Allowed: ${BOOK_STATUSES.join(
        ', ',
      )}`,
    )
  }
}

async function seed() {
  const source = booksData as Book[]

  assertValidStatuses(source)

  console.log(`Seeding ${source.length} books...`)

  // delete + insert wrapped in a transaction so a failed insert never leaves
  // the table empty.
  await db.transaction(async (tx) => {
    await tx.delete(books)
    await tx.insert(books).values(
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
  })

  const count = await db.$count(books)
  console.log(`Seed complete. ${count} books in database.`)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
