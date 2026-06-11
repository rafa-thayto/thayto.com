import booksData from '@/data/books.json'
import { BOOK_STATUSES } from '@/db/schema'

type RawBook = (typeof booksData)[number]

describe('books.json data integrity', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(booksData)).toBe(true)
    expect(booksData.length).toBeGreaterThan(0)
  })

  it('every book has a unique non-empty string id', () => {
    const ids = booksData.map((b) => b.id)
    ids.forEach((id, i) => {
      expect(typeof id, `book[${i}].id must be a string`).toBe('string')
      expect(
        id.trim().length,
        `book[${i}].id must not be empty`,
      ).toBeGreaterThan(0)
    })
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  describe.each(
    booksData.map((b, i) => ({
      book: b as RawBook & Record<string, unknown>,
      i,
    })),
  )('book[$i] id=$book.id', ({ book, i }) => {
    it('has a non-empty string title', () => {
      expect(typeof book.title, `book[${i}].title`).toBe('string')
      expect((book.title as string).trim().length).toBeGreaterThan(0)
    })

    it('has a non-empty string englishTitle', () => {
      expect(typeof book.englishTitle, `book[${i}].englishTitle`).toBe('string')
      expect((book.englishTitle as string).trim().length).toBeGreaterThan(0)
    })

    it('has a non-empty string author', () => {
      expect(typeof book.author, `book[${i}].author`).toBe('string')
      expect((book.author as string).trim().length).toBeGreaterThan(0)
    })

    it('has a non-empty string coverUrl', () => {
      expect(typeof book.coverUrl, `book[${i}].coverUrl`).toBe('string')
      expect((book.coverUrl as string).trim().length).toBeGreaterThan(0)
    })

    it('status is one of BOOK_STATUSES', () => {
      expect(BOOK_STATUSES).toContain(book.status)
    })

    it('when stars is present it is an integer between 1 and 5', () => {
      if ('stars' in book && book.stars !== undefined && book.stars !== null) {
        const s = book.stars as number
        expect(typeof s).toBe('number')
        expect(Number.isInteger(s)).toBe(true)
        expect(s).toBeGreaterThanOrEqual(1)
        expect(s).toBeLessThanOrEqual(5)
      }
    })

    it('when love is present it is a boolean', () => {
      if ('love' in book && book.love !== undefined && book.love !== null) {
        expect(typeof book.love).toBe('boolean')
      }
    })

    it('createdAt parses to a valid Date', () => {
      expect(typeof book.createdAt, `book[${i}].createdAt`).toBe('string')
      const d = new Date(book.createdAt as string)
      expect(isNaN(d.getTime())).toBe(false)
    })

    it('when amazonUrl is present it is a non-empty https URL', () => {
      if (
        'amazonUrl' in book &&
        book.amazonUrl !== undefined &&
        book.amazonUrl !== null
      ) {
        const url = book.amazonUrl as string
        expect(url.trim().length).toBeGreaterThan(0)
        expect(url.startsWith('https://')).toBe(true)
      }
    })
  })

  it('NOTE: all books use status READ — other statuses (READING, BUY, WILL_READ, DROPPED) are absent from seed data', () => {
    const statuses = new Set(booksData.map((b) => b.status))
    // Document the current reality: only READ is used.
    // This test will fail if a new status is added to books.json,
    // at which point the note below should be updated.
    expect(statuses.size).toBe(1)
    expect(statuses.has('READ')).toBe(true)
  })
})
