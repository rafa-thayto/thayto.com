import { dbBookToBook } from './books-mapping'
import { DbBook } from '@/db/schema'

const baseDbBook: DbBook = {
  id: 'clean-code',
  title: 'Código Limpo',
  englishTitle: 'Clean Code',
  author: 'Robert C. Martin',
  coverUrl: 'https://example.com/clean-code.jpg',
  amazonUrl: 'https://amazon.com/dp/8576082675',
  status: 'READ',
  stars: 5,
  love: true,
  createdAt: '2024-01-15',
}

describe('dbBookToBook', () => {
  it('maps a fully-populated DbBook 1:1 to a Book', () => {
    const result = dbBookToBook(baseDbBook)

    expect(result).toEqual({
      id: 'clean-code',
      title: 'Código Limpo',
      englishTitle: 'Clean Code',
      author: 'Robert C. Martin',
      coverUrl: 'https://example.com/clean-code.jpg',
      amazonUrl: 'https://amazon.com/dp/8576082675',
      status: 'READ',
      stars: 5,
      love: true,
      createdAt: '2024-01-15',
    })
  })

  it('maps null amazonUrl to undefined', () => {
    const result = dbBookToBook({ ...baseDbBook, amazonUrl: null })

    expect(result.amazonUrl).toBeUndefined()
    expect(result.amazonUrl).not.toBeNull()
  })

  it('maps null stars to undefined', () => {
    const result = dbBookToBook({ ...baseDbBook, stars: null })

    expect(result.stars).toBeUndefined()
    expect(result.stars).not.toBeNull()
  })

  it('maps null love to undefined', () => {
    const result = dbBookToBook({ ...baseDbBook, love: null })

    expect(result.love).toBeUndefined()
    expect(result.love).not.toBeNull()
  })

  it('maps love:false to false, not undefined', () => {
    const result = dbBookToBook({ ...baseDbBook, love: false })

    expect(result.love).toBe(false)
    expect(result.love).not.toBeUndefined()
  })

  it('maps love:true to true', () => {
    const result = dbBookToBook({ ...baseDbBook, love: true })

    expect(result.love).toBe(true)
  })
})
