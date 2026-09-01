import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const getNotesPath = (locale: string) =>
  path.join(process.cwd(), 'notes', locale)

export type Note = {
  number: number
  description: string
  publishedTime: string
  modifiedTime: string
  content: string
  locale: string
}

// notes are numbered, never titled: the file name is the number
const NOTE_FILE = /^(\d+)\.mdx$/

export const getNoteNumbers = (locale: string): number[] => {
  const notesPath = getNotesPath(locale)
  if (!fs.existsSync(notesPath)) return []
  return fs
    .readdirSync(notesPath)
    .map((file) => file.match(NOTE_FILE)?.[1])
    .filter((n): n is string => n !== undefined)
    .map(Number)
    .sort((a, b) => a - b)
}

export const getNote = (locale: string, number: number): Note | null => {
  const filePath = path.join(getNotesPath(locale), `${number}.mdx`)
  if (!Number.isInteger(number) || number < 1 || !fs.existsSync(filePath)) {
    return null
  }
  const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'))
  const publishedTime = String(data.publishedTime ?? '')
  return {
    number,
    description: String(data.description ?? ''),
    publishedTime,
    modifiedTime: String(data.modifiedTime ?? publishedTime),
    content,
    locale,
  }
}

export const getNotes = (locale: string): Note[] =>
  getNoteNumbers(locale)
    .map((number) => getNote(locale, number))
    .filter((note): note is Note => note !== null)

export const parseNoteNumber = (value: string): number | null =>
  /^\d+$/.test(value) ? Number(value) : null
