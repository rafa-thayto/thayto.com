import { readFileSync } from 'fs'
import { join } from 'path'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { eq } from 'drizzle-orm'
import { books, BOOK_STATUSES } from '@/db/schema'
import * as schema from '@/db/schema'

function buildDb() {
  const client = createClient({ url: ':memory:' })
  const sql = readFileSync(
    join(process.cwd(), 'drizzle/0000_unusual_ultimates.sql'),
    'utf-8',
  )
  const statements = sql
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter(Boolean)

  const db = drizzle(client, { schema })

  return { client, db, statements }
}

describe('BOOK_STATUSES constant', () => {
  it('has exactly 5 expected values', () => {
    expect(BOOK_STATUSES).toEqual([
      'READ',
      'READING',
      'BUY',
      'WILL_READ',
      'DROPPED',
    ])
    expect(BOOK_STATUSES).toHaveLength(5)
  })
})

describe('Drizzle schema + migration integration', () => {
  let db: ReturnType<typeof drizzle>
  let client: ReturnType<typeof createClient>

  beforeEach(async () => {
    const built = buildDb()
    client = built.client
    db = built.db
    for (const stmt of built.statements) {
      await client.execute(stmt)
    }
  })

  afterEach(() => {
    client.close()
  })

  it('inserts and retrieves a fully-populated book with love:true and stars set', async () => {
    await db.insert(books).values({
      id: 'book-1',
      title: 'Código Limpo',
      englishTitle: 'Clean Code',
      author: 'Robert C. Martin',
      coverUrl: 'https://example.com/cover.jpg',
      amazonUrl: 'https://amazon.com/clean-code',
      status: 'READ',
      stars: 5,
      love: true,
      createdAt: '2024-01-15 10:00:00',
    })

    const [row] = await db.select().from(books).where(eq(books.id, 'book-1'))

    expect(row).toBeDefined()
    expect(row.id).toBe('book-1')
    expect(row.title).toBe('Código Limpo')
    expect(row.englishTitle).toBe('Clean Code')
    expect(row.author).toBe('Robert C. Martin')
    expect(row.coverUrl).toBe('https://example.com/cover.jpg')
    expect(row.amazonUrl).toBe('https://amazon.com/clean-code')
    expect(row.status).toBe('READ')
    expect(row.stars).toBe(5)
    // love uses integer mode:'boolean' — Drizzle should return a JS boolean
    expect(row.love).toBe(true)
    expect(row.createdAt).toBe('2024-01-15 10:00:00')
  })

  it('inserts a book with love:null and stars:null and nullable fields round-trip as null', async () => {
    await db.insert(books).values({
      id: 'book-2',
      title: 'Clean Architecture',
      englishTitle: 'Clean Architecture',
      author: 'Robert C. Martin',
      amazonUrl: null,
      stars: null,
      love: null,
      status: 'READING',
      createdAt: '2024-02-01 09:00:00',
    })

    const [row] = await db.select().from(books).where(eq(books.id, 'book-2'))

    expect(row).toBeDefined()
    expect(row.amazonUrl).toBeNull()
    expect(row.stars).toBeNull()
    expect(row.love).toBeNull()
  })

  it('inserts a book with love:false and retrieves it as a JS boolean false', async () => {
    await db.insert(books).values({
      id: 'book-3',
      title: 'The Pragmatic Programmer',
      englishTitle: 'The Pragmatic Programmer',
      author: 'Dave Thomas',
      love: false,
      stars: 4,
      status: 'READ',
      createdAt: '2024-03-10 08:00:00',
    })

    const [row] = await db.select().from(books).where(eq(books.id, 'book-3'))

    expect(row.love).toBe(false)
    expect(row.stars).toBe(4)
  })

  it('applies the status default WILL_READ when status is omitted', async () => {
    // NewDbBook allows omitting status because it has a DB default
    await db.insert(books).values({
      id: 'book-4',
      title: 'Domain-Driven Design',
      englishTitle: 'Domain-Driven Design',
      author: 'Eric Evans',
      createdAt: '2024-04-01 07:00:00',
    })

    const [row] = await db.select().from(books).where(eq(books.id, 'book-4'))

    expect(row.status).toBe('WILL_READ')
  })

  it('applies the coverUrl default empty string when coverUrl is omitted', async () => {
    await db.insert(books).values({
      id: 'book-5',
      title: 'Refactoring',
      englishTitle: 'Refactoring',
      author: 'Martin Fowler',
      createdAt: '2024-05-01 06:00:00',
    })

    const [row] = await db.select().from(books).where(eq(books.id, 'book-5'))

    expect(row.coverUrl).toBe('')
  })

  it('populates createdAt via the current_timestamp default when omitted', async () => {
    await db.insert(books).values({
      id: 'book-6',
      title: 'SICP',
      englishTitle: 'Structure and Interpretation of Computer Programs',
      author: 'Abelson & Sussman',
    })

    const [row] = await db.select().from(books).where(eq(books.id, 'book-6'))

    // createdAt should be a non-empty string populated by the DB default
    expect(row.createdAt).toBeTruthy()
    expect(typeof row.createdAt).toBe('string')
    expect(row.createdAt.length).toBeGreaterThan(0)
  })

  it('enforces the primary key constraint — duplicate id throws', async () => {
    await db.insert(books).values({
      id: 'book-7',
      title: 'The Mythical Man-Month',
      englishTitle: 'The Mythical Man-Month',
      author: 'Fred Brooks',
      createdAt: '2024-06-01 00:00:00',
    })

    await expect(
      db.insert(books).values({
        id: 'book-7',
        title: 'Duplicate',
        englishTitle: 'Duplicate',
        author: 'Someone',
        createdAt: '2024-06-02 00:00:00',
      }),
    ).rejects.toThrow()
  })

  it('all five BOOK_STATUSES can be stored and retrieved correctly', async () => {
    const entries = BOOK_STATUSES.map((status, i) => ({
      id: `status-book-${i}`,
      title: `Book ${status}`,
      englishTitle: `Book ${status}`,
      author: 'Test Author',
      status,
      createdAt: `2024-0${i + 1}-01 00:00:00`,
    }))

    await db.insert(books).values(entries)

    const rows = await db.select().from(books)
    const storedStatuses = rows
      .filter((r) => r.id.startsWith('status-book-'))
      .map((r) => r.status)
      .sort()

    expect(storedStatuses).toEqual([...BOOK_STATUSES].sort())
  })
})
