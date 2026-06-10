import { getBooksByStatus, getFavorites, sortBooks } from './books.utils'
import type { Book } from './books.types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const makeBook = (
  overrides: Partial<Book> & Pick<Book, 'id' | 'title'>,
): Book => ({
  englishTitle: overrides.title,
  author: 'Author',
  coverUrl: '',
  status: 'READ',
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
})

const bookA: Book = makeBook({
  id: 'a',
  title: 'Apple',
  status: 'READ',
  stars: 5,
  love: true,
  createdAt: '2024-03-01T00:00:00Z',
})

const bookB: Book = makeBook({
  id: 'b',
  title: 'Banana',
  status: 'READING',
  stars: 3,
  love: false,
  createdAt: '2024-02-01T00:00:00Z',
})

const bookC: Book = makeBook({
  id: 'c',
  title: 'Cherry',
  status: 'BUY',
  stars: undefined,
  love: undefined,
  createdAt: '2024-01-01T00:00:00Z',
})

const bookD: Book = makeBook({
  id: 'd',
  title: 'Date',
  status: 'WILL_READ',
  stars: 1,
  love: true,
  createdAt: '2024-04-01T00:00:00Z',
})

const bookE: Book = makeBook({
  id: 'e',
  title: 'Elderberry',
  status: 'DROPPED',
  stars: 2,
  love: false,
  createdAt: '2023-12-01T00:00:00Z',
})

const allBooks: Book[] = [bookA, bookB, bookC, bookD, bookE]

// ---------------------------------------------------------------------------
// getBooksByStatus
// ---------------------------------------------------------------------------

describe('getBooksByStatus', () => {
  it('returns all books when status is null', () => {
    expect(getBooksByStatus(allBooks, null)).toEqual(allBooks)
  })

  it('filters books with status READ', () => {
    const result = getBooksByStatus(allBooks, 'READ')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('filters books with status READING', () => {
    const result = getBooksByStatus(allBooks, 'READING')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('b')
  })

  it('filters books with status BUY', () => {
    const result = getBooksByStatus(allBooks, 'BUY')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('c')
  })

  it('filters books with status WILL_READ', () => {
    const result = getBooksByStatus(allBooks, 'WILL_READ')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('d')
  })

  it('filters books with status DROPPED', () => {
    const result = getBooksByStatus(allBooks, 'DROPPED')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('e')
  })

  it('returns empty array when no books match status', () => {
    const result = getBooksByStatus([bookA, bookB], 'DROPPED')
    expect(result).toHaveLength(0)
  })

  it('does not mutate the original array', () => {
    const input = [bookA, bookB]
    getBooksByStatus(input, 'READ')
    expect(input).toHaveLength(2)
  })

  it('returns all books when input is empty and status is null', () => {
    expect(getBooksByStatus([], null)).toEqual([])
  })

  it('returns multiple books matching the same status', () => {
    const extra: Book = makeBook({ id: 'f', title: 'Fig', status: 'READ' })
    const result = getBooksByStatus([bookA, extra, bookB], 'READ')
    expect(result).toHaveLength(2)
    expect(result.map((b) => b.id)).toEqual(['a', 'f'])
  })
})

// ---------------------------------------------------------------------------
// getFavorites
// ---------------------------------------------------------------------------

describe('getFavorites', () => {
  it('returns only books where love === true', () => {
    const result = getFavorites(allBooks)
    expect(result.map((b) => b.id)).toEqual(['a', 'd'])
  })

  it('excludes books where love === false', () => {
    const result = getFavorites([bookB, bookE])
    expect(result).toHaveLength(0)
  })

  it('excludes books where love is undefined', () => {
    const result = getFavorites([bookC])
    expect(result).toHaveLength(0)
  })

  it('returns empty array when input is empty', () => {
    expect(getFavorites([])).toHaveLength(0)
  })

  it('returns all books when all have love === true', () => {
    const loved: Book[] = [
      makeBook({ id: '1', title: 'A', love: true }),
      makeBook({ id: '2', title: 'B', love: true }),
    ]
    expect(getFavorites(loved)).toHaveLength(2)
  })

  it('does not mutate the original array', () => {
    const input = [bookA, bookB, bookC]
    getFavorites(input)
    expect(input).toHaveLength(3)
  })
})

// ---------------------------------------------------------------------------
// sortBooks
// ---------------------------------------------------------------------------

describe('sortBooks', () => {
  describe('null sortType — order by createdAt desc', () => {
    it('orders most-recent first', () => {
      const result = sortBooks(allBooks, null)
      const ids = result.map((b) => b.id)
      // bookD: 2024-04-01, bookA: 2024-03-01, bookB: 2024-02-01, bookC: 2024-01-01, bookE: 2023-12-01
      expect(ids).toEqual(['d', 'a', 'b', 'c', 'e'])
    })

    it('does not mutate the original array', () => {
      const input = [bookA, bookB]
      sortBooks(input, null)
      expect(input[0].id).toBe('a')
    })
  })

  describe('BEST — stars descending, missing stars treated as 0', () => {
    it('places highest-starred book first', () => {
      const result = sortBooks(allBooks, 'BEST')
      expect(result[0].id).toBe('a') // stars: 5
    })

    it('places book with undefined stars last (treated as 0)', () => {
      const result = sortBooks(allBooks, 'BEST')
      expect(result[result.length - 1].id).toBe('c') // stars: undefined → 0
    })

    it('descending order: 5 → 3 → 2 → 1 → 0', () => {
      const result = sortBooks(allBooks, 'BEST')
      const stars = result.map((b) => b.stars ?? 0)
      expect(stars).toEqual([5, 3, 2, 1, 0])
    })

    it('does not mutate the original array', () => {
      const input = [bookA, bookC]
      sortBooks(input, 'BEST')
      expect(input[0].id).toBe('a')
    })
  })

  describe('WORST — stars ascending, missing stars treated as 0', () => {
    it('places book with undefined stars first (treated as 0)', () => {
      const result = sortBooks(allBooks, 'WORST')
      expect(result[0].id).toBe('c') // stars: undefined → 0
    })

    it('places highest-starred book last', () => {
      const result = sortBooks(allBooks, 'WORST')
      expect(result[result.length - 1].id).toBe('a') // stars: 5
    })

    it('ascending order: 0 → 1 → 2 → 3 → 5', () => {
      const result = sortBooks(allBooks, 'WORST')
      const stars = result.map((b) => b.stars ?? 0)
      expect(stars).toEqual([0, 1, 2, 3, 5])
    })
  })

  describe('ABC — title localeCompare ascending (A → Z)', () => {
    it('first title is the alphabetically earliest', () => {
      const result = sortBooks(allBooks, 'ABC')
      expect(result[0].title).toBe('Apple')
    })

    it('last title is the alphabetically latest', () => {
      const result = sortBooks(allBooks, 'ABC')
      expect(result[result.length - 1].title).toBe('Elderberry')
    })

    it('full ascending order', () => {
      const result = sortBooks(allBooks, 'ABC')
      const titles = result.map((b) => b.title)
      expect(titles).toEqual([
        'Apple',
        'Banana',
        'Cherry',
        'Date',
        'Elderberry',
      ])
    })

    it('does not mutate the original array', () => {
      const input = [bookC, bookA]
      sortBooks(input, 'ABC')
      expect(input[0].id).toBe('c')
    })
  })

  describe('ZXY — title localeCompare descending (Z → A)', () => {
    it('first title is the alphabetically latest', () => {
      const result = sortBooks(allBooks, 'ZXY')
      expect(result[0].title).toBe('Elderberry')
    })

    it('last title is the alphabetically earliest', () => {
      const result = sortBooks(allBooks, 'ZXY')
      expect(result[result.length - 1].title).toBe('Apple')
    })

    it('full descending order', () => {
      const result = sortBooks(allBooks, 'ZXY')
      const titles = result.map((b) => b.title)
      expect(titles).toEqual([
        'Elderberry',
        'Date',
        'Cherry',
        'Banana',
        'Apple',
      ])
    })
  })

  describe('edge cases', () => {
    it('returns empty array unchanged for any sortType', () => {
      expect(sortBooks([], 'BEST')).toEqual([])
      expect(sortBooks([], 'WORST')).toEqual([])
      expect(sortBooks([], 'ABC')).toEqual([])
      expect(sortBooks([], 'ZXY')).toEqual([])
      expect(sortBooks([], null)).toEqual([])
    })

    it('single-element array returns unchanged regardless of sortType', () => {
      expect(sortBooks([bookA], 'BEST')).toHaveLength(1)
      expect(sortBooks([bookA], null)).toHaveLength(1)
    })

    it('BEST: two books both without stars are treated as equal (stable relative order)', () => {
      const x: Book = makeBook({ id: 'x', title: 'X', stars: undefined })
      const y: Book = makeBook({ id: 'y', title: 'Y', stars: undefined })
      const result = sortBooks([x, y], 'BEST')
      // Both treated as 0; (0 - 0) === 0, so relative order is preserved by JS sort stability
      expect(result).toHaveLength(2)
      expect(result.map((b) => b.id)).toEqual(['x', 'y'])
    })
  })
})
