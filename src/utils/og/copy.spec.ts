import { describe, expect, it } from 'vitest'
import { OG_COPY, OG_PAGES, resolveOgLocale, type OgPage } from './copy'
import { locales } from '@/i18n/config'

describe('OG_COPY', () => {
  it('covers every page in both locales with non-empty copy', () => {
    OG_PAGES.forEach((page) => {
      locales.forEach((locale) => {
        const copy = OG_COPY[page][locale]
        expect(copy.greeting.trim()).not.toBe('')
        expect(copy.headline.trim()).not.toBe('')
      })
    })
  })

  it('keeps the original home headline verbatim in english', () => {
    expect(OG_COPY.home.en.headline).toBe(
      "I'm Rafael Thayto,\nSenior Software Engineer\nand VIM/Neovim user ❤️ (since 2022)",
    )
  })

  it('keeps the original blog and linktree english cards verbatim', () => {
    expect(OG_COPY.blog.en.greeting).toBe('Check out this Blog')
    expect(OG_COPY.linktree.en.headline).toBe(
      "I've gathered all my links in this place",
    )
  })

  it('falls back to the default locale for unknown locales', () => {
    expect(resolveOgLocale('en')).toBe('en')
    expect(resolveOgLocale('fr')).toBe('pt')
  })

  it('lists every fixed page exactly once', () => {
    const expected: OgPage[] = [
      'home',
      'blog',
      'posts',
      'books',
      'hobbies',
      'linktree',
    ]
    expect([...OG_PAGES].sort()).toEqual([...expected].sort())
  })
})
