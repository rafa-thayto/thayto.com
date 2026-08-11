import { matchesSearch } from './post-search'

const post = {
  title: 'Migrando para o App Router',
  description: 'Como migrei o blog para Next.js com Server Components',
  tags: ['nextjs', 'react'],
}

describe('matchesSearch', () => {
  it('matches empty and whitespace-only queries', () => {
    expect(matchesSearch('', post)).toBe(true)
    expect(matchesSearch('   ', post)).toBe(true)
  })

  it('matches case-insensitively across title, description, and tags', () => {
    expect(matchesSearch('APP ROUTER', post)).toBe(true)
    expect(matchesSearch('server components', post)).toBe(true)
    expect(matchesSearch('react', post)).toBe(true)
  })

  it('ignores accents in both query and content', () => {
    expect(matchesSearch('migrei', post)).toBe(true)
    expect(matchesSearch('migração', { ...post, title: 'migracao' })).toBe(true)
    expect(matchesSearch('migracao', { ...post, title: 'migração' })).toBe(true)
  })

  it('requires every term to match (AND semantics)', () => {
    expect(matchesSearch('nextjs router', post)).toBe(true)
    expect(matchesSearch('nextjs vue', post)).toBe(false)
  })
})
