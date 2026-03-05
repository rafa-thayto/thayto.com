export type BookStatus = 'READ' | 'READING' | 'BUY' | 'WILL_READ' | 'DROPPED'
export type SortType = 'BEST' | 'WORST' | 'ABC' | 'ZXY'

export interface Book {
  id: string
  title: string // Portuguese title
  englishTitle: string // English title
  author: string
  coverUrl: string // Book cover image URL
  amazonUrl?: string // Amazon affiliate link (optional)
  status: BookStatus
  stars?: number // 1-5 rating (for read books)
  love?: boolean // For Favorites filter
  createdAt: string // ISO date for default sorting
}
