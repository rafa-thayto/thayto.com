import { describe, expect, it } from 'vitest'
import { getNote, getNoteNumbers, getNotes, parseNoteNumber } from './notes'
import { locales } from '@/i18n/config'

describe('notes content', () => {
  it('ships every note in both locales under the same number', () => {
    const [first, ...rest] = locales.map((locale) => getNoteNumbers(locale))
    rest.forEach((numbers) => expect(numbers).toEqual(first))
    expect(first.length).toBeGreaterThan(0)
  })

  it('numbers notes from 1 without gaps', () => {
    const numbers = getNoteNumbers('pt')
    expect(numbers).toEqual(numbers.map((_, index) => index + 1))
  })

  it('requires a description and a published date on every note', () => {
    locales.forEach((locale) => {
      getNotes(locale).forEach((note) => {
        expect(note.description.trim()).not.toBe('')
        expect(note.publishedTime).toMatch(/^\d{4}-\d{2}-\d{2}/)
        expect(note.content.trim()).not.toBe('')
      })
    })
  })

  it('returns null for notes that do not exist', () => {
    expect(getNote('pt', 9999)).toBeNull()
    expect(getNote('pt', 0)).toBeNull()
    expect(getNote('pt', 1.5)).toBeNull()
  })

  it('only accepts plain integers as route params', () => {
    expect(parseNoteNumber('1')).toBe(1)
    expect(parseNoteNumber('01')).toBe(1)
    expect(parseNoteNumber('1.md')).toBeNull()
    expect(parseNoteNumber('abc')).toBeNull()
    expect(parseNoteNumber('-1')).toBeNull()
  })
})
