import { Book, BookStatus, SortType } from './books.types'

export const getBooksByStatus = (
  books: Book[],
  status: BookStatus | null,
): Book[] => {
  if (!status) return books
  return books.filter((book) => book.status === status)
}

export const getFavorites = (books: Book[]): Book[] => {
  return books.filter((book) => book.love === true)
}

export const sortBooks = (books: Book[], sortType: SortType | null): Book[] => {
  const sorted = [...books]

  if (!sortType) {
    return sorted.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }

  switch (sortType) {
    case 'BEST':
      return sorted.sort((a, b) => (b.stars || 0) - (a.stars || 0))
    case 'WORST':
      return sorted.sort((a, b) => (a.stars || 0) - (b.stars || 0))
    case 'ABC':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'ZXY':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    default:
      return sorted
  }
}
