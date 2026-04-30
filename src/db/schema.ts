import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

export const BOOK_STATUSES = [
  'READ',
  'READING',
  'BUY',
  'WILL_READ',
  'DROPPED',
] as const

export const books = sqliteTable(
  'books',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    englishTitle: text('english_title').notNull(),
    author: text('author').notNull(),
    coverUrl: text('cover_url').notNull().default(''),
    amazonUrl: text('amazon_url'),
    status: text('status', { enum: BOOK_STATUSES })
      .notNull()
      .default('WILL_READ'),
    stars: integer('stars'),
    love: integer('love', { mode: 'boolean' }),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [
    index('books_status_idx').on(t.status),
    index('books_created_at_idx').on(t.createdAt),
    index('books_love_idx').on(t.love),
  ],
)

export type DbBook = typeof books.$inferSelect
export type NewDbBook = typeof books.$inferInsert
