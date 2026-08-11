import { getPosts } from '@/utils/mdx'
import { SITE_URL } from '@/utils/constants'
import { getPostsPath } from '@/constants'
import { getYearsOfProfessionalExperience } from '@/constants'
import { promises as fs } from 'fs'
import path from 'path'
import booksData from '@/data/books.json'
import { Book } from '@/data/books.types'
import { linktreeLinks } from '@/data/linktree-links'
import ptMessages from '@/messages/pt.json'
import enMessages from '@/messages/en.json'
import {
  companies,
  getCompanyLabel,
  CompanyEntry,
  CompanyLink,
} from '@/data/companies'
import { curiosityLinks } from '@/data/curiosity-links'

function getMessages(locale: string) {
  return locale === 'en' ? enMessages : ptMessages
}

function interpolate(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    String(vars[key] ?? `{${key}}`),
  )
}

// messages meant for t.rich() carry tags like <exp>…</exp>; markdown gets the plain text
function stripRichTags(text: string): string {
  return text.replace(/<\/?\w+>/g, '')
}

function richTagsToMarkdownLinks(text: string): string {
  return text.replace(/<(\w+)>(.*?)<\/\1>/g, (_, tag, label) => {
    const url = curiosityLinks[tag]
    return url ? `[${label}](${url})` : label
  })
}

function toMarkdownLink(company: CompanyLink, locale: string): string {
  return `[${getCompanyLabel(company, locale)}](${company.url})`
}

function formatCompanyEntry(entry: CompanyEntry, locale: string): string {
  if (!('offices' in entry)) {
    return toMarkdownLink(entry, locale)
  }
  const offices = entry.offices
    .map((office) => toMarkdownLink(office, locale))
    .join(', ')
  return `${entry.name} (${offices})`
}

export function getCompaniesDetail(locale: string): string {
  return companies.map((entry) => formatCompanyEntry(entry, locale)).join(', ')
}

export function generateHomeMarkdown(locale: string): string {
  const messages = getMessages(locale)
  const posts = getPosts(locale)
  const years = getYearsOfProfessionalExperience()
  const bio = messages.home.bio
  const prefix = locale === 'en' ? '/en' : ''

  const lines: string[] = [
    '# Rafael Thayto',
    '',
    `> ${messages.home.subtitle}`,
    '',
    `${stripRichTags(interpolate(bio.intro, { years }))} ${
      bio.companies
    } (${getCompaniesDetail(locale)}) ${bio.location}`,
    '',
    bio.blog,
    '',
    `## ${messages.home.curiosities.title}`,
    '',
    richTagsToMarkdownLinks(messages.home.curiosities.text),
    '',
    `## ${messages.home.recentPosts}`,
    '',
    ...posts.map((post) => {
      const slug = post.filePath.replace('.mdx', '')
      const date = post.data.publishedTime
        ? new Date(post.data.publishedTime).toISOString().split('T')[0]
        : ''
      return `- [${post.data.title}](${SITE_URL}${prefix}/blog/${slug}.md) - ${date}`
    }),
    '',
    '## Links',
    '',
    `- [Blog](${SITE_URL}${prefix}/blog)`,
    `- [About](${SITE_URL}${prefix}/about)`,
    `- [Books](${SITE_URL}${prefix}/books)`,
    `- [Hobbies](${SITE_URL}${prefix}/hobbies)`,
    `- [Linktree](${SITE_URL}${prefix}/linktree)`,
    '',
  ]

  return lines.join('\n')
}

export function generateBlogIndexMarkdown(locale: string): string {
  const messages = getMessages(locale)
  const posts = getPosts(locale)
  const prefix = locale === 'en' ? '/en' : ''

  const lines: string[] = [
    `# ${messages.metadata.blog.title}`,
    '',
    `> ${messages.metadata.blog.description}`,
    '',
    '## Posts',
    '',
    ...posts.map((post) => {
      const slug = post.filePath.replace('.mdx', '')
      const date = post.data.publishedTime
        ? new Date(post.data.publishedTime).toISOString().split('T')[0]
        : ''
      const tags = post.data.tags?.length
        ? `  Tags: ${post.data.tags.join(', ')}`
        : ''
      return `- [${
        post.data.title
      }](${SITE_URL}${prefix}/blog/${slug}.md) - ${date}\n  ${
        post.data.description
      }${tags ? '\n' + tags : ''}`
    }),
    '',
  ]

  return lines.join('\n')
}

export async function generateBlogPostMarkdown(
  slug: string,
  locale: string,
): Promise<string> {
  const postsPath = path.resolve(getPostsPath(locale))
  const filePath = path.resolve(postsPath, `${slug}.mdx`)
  if (!filePath.startsWith(postsPath + path.sep) && filePath !== postsPath) {
    throw Object.assign(new Error('Invalid slug'), { code: 'ENOENT' })
  }
  return fs.readFile(filePath, 'utf-8')
}

export function generateAboutMarkdown(locale: string): string {
  const messages = getMessages(locale)
  const years = getYearsOfProfessionalExperience()

  const lines: string[] = [
    `# ${messages.about.title}`,
    '',
    interpolate(messages.about.bio.paragraph1, { years }),
    '',
    messages.about.bio.paragraph2,
    '',
  ]

  return lines.join('\n')
}

export function generateHobbiesMarkdown(locale: string): string {
  const messages = getMessages(locale)

  const lines: string[] = [
    `# ${messages.hobbies.title}`,
    '',
    `> ${messages.metadata.hobbies.description}`,
    '',
    messages.hobbies.paragraph1,
    '',
    messages.hobbies.paragraph2,
    '',
  ]

  return lines.join('\n')
}

export function generateBooksMarkdown(locale: string): string {
  const messages = getMessages(locale)
  const books: Book[] = booksData as Book[]

  const statusLabels: Record<string, string> = {
    READ: messages.books.status.read,
    READING: messages.books.status.reading,
    WILL_READ: messages.books.status.willRead,
    BUY: messages.books.status.buy,
    DROPPED: messages.books.status.dropped,
  }

  const statusOrder = ['READ', 'READING', 'WILL_READ', 'BUY', 'DROPPED']
  const grouped: Record<string, Book[]> = {}
  for (const book of books) {
    if (!grouped[book.status]) grouped[book.status] = []
    grouped[book.status].push(book)
  }

  const lines: string[] = [
    `# ${messages.books.pageTitle}`,
    '',
    `> ${messages.books.pageSubtitle}`,
    '',
  ]

  for (const status of statusOrder) {
    const group = grouped[status]
    if (!group?.length) continue

    lines.push(`## ${statusLabels[status] ?? status}`, '')
    for (const book of group) {
      const title = locale === 'en' ? book.englishTitle : book.title
      const stars = book.stars
        ? ` (${'★'.repeat(book.stars)}${'☆'.repeat(5 - book.stars)})`
        : ''
      const fav = book.love ? ' ♥' : ''
      lines.push(`- ${title} - ${book.author}${stars}${fav}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

export function generateLinktreeMarkdown(): string {
  const lines: string[] = [
    '# Rafael Thayto - Links',
    '',
    '> Senior Software Engineer',
    '',
    ...linktreeLinks.map(
      (link) =>
        `- [${link.text}](${
          link.href.startsWith('/') ? SITE_URL + link.href : link.href
        })`,
    ),
    '',
  ]

  return lines.join('\n')
}
