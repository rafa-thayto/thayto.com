const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export interface SearchablePost {
  title: string
  description: string
  tags: string[]
}

// Every whitespace-separated term must appear somewhere in the post
// (title, description, or tags), accent- and case-insensitive.
export function matchesSearch(query: string, post: SearchablePost): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return true

  const haystack = normalize(
    [post.title, post.description, ...post.tags].join(' '),
  )
  return terms.every((term) => haystack.includes(term))
}
