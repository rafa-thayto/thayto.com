import { MetadataRoute } from 'next'
import { getPosts, Post } from '@/utils/mdx'
import { getNotes } from '@/utils/notes'
import { locales, Locale } from '@/i18n/config'
import { toCanonicalUrl } from '@/utils/seo'

type EntryOptions = {
  changeFrequency: 'weekly' | 'monthly'
  priority: number
}

// Anything with a stable cross-locale key (post slug, note number) and a
// modification date. One key may exist in only some locales.
type LocalizedItem = {
  key: string
  path: string
  modifiedTime: string | Date
}

const latestDate = (dates: (string | Date)[]): Date | undefined => {
  const times = dates
    .map((date) => new Date(date).getTime())
    .filter((time) => !Number.isNaN(time))
  return times.length ? new Date(Math.max(...times)) : undefined
}

// Every locale that has the page gets its own <loc>, so English URLs are
// discoverable directly rather than only inside alternates. Alternates list
// only the locales that really exist; x-default prefers pt, the site default.
const localizedEntries = (
  path: string,
  availableLocales: Locale[],
  options: EntryOptions,
  lastModifiedFor: (locale: Locale) => Date | undefined,
): MetadataRoute.Sitemap => {
  const defaultLocale = availableLocales.includes('pt')
    ? 'pt'
    : availableLocales[0]
  const languages: Record<string, string> = {
    'x-default': toCanonicalUrl(defaultLocale, path),
  }
  for (const locale of availableLocales) {
    languages[locale] = toCanonicalUrl(locale, path)
  }
  return availableLocales.map((locale) => ({
    url: toCanonicalUrl(locale, path),
    lastModified: lastModifiedFor(locale),
    ...options,
    alternates: { languages },
  }))
}

const contentEntries = (
  itemsByLocale: Record<Locale, LocalizedItem[]>,
  options: EntryOptions,
): MetadataRoute.Sitemap => {
  const allItems = locales.flatMap((locale) => itemsByLocale[locale])
  const keys = Array.from(new Set(allItems.map((item) => item.key)))

  return keys.flatMap((key) => {
    const variants = new Map(
      locales.flatMap((locale) => {
        const item = itemsByLocale[locale].find((it) => it.key === key)
        return item ? [[locale, item] as const] : []
      }),
    )
    const availableLocales = Array.from(variants.keys())
    const { path } = variants.get(availableLocales[0])!
    return localizedEntries(
      path,
      availableLocales,
      options,
      (locale) => new Date(variants.get(locale)!.modifiedTime),
    )
  })
}

const byLocale = <T>(load: (locale: Locale) => T[]): Record<Locale, T[]> =>
  Object.fromEntries(locales.map((locale) => [locale, load(locale)])) as Record<
    Locale,
    T[]
  >

const newestOf = (itemsByLocale: Record<Locale, LocalizedItem[]>) =>
  latestDate(
    locales
      .flatMap((locale) => itemsByLocale[locale])
      .map((i) => i.modifiedTime),
  )

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = byLocale<LocalizedItem>((locale) =>
    (getPosts(locale) as Post[]).map((post) => ({
      key: post.filePath.replace('.mdx', ''),
      path: post.data.href,
      modifiedTime: post.data.modifiedTime,
    })),
  )
  const notes = byLocale<LocalizedItem>((locale) =>
    getNotes(locale).map((note) => ({
      key: String(note.number),
      path: `/notes/${note.number}`,
      modifiedTime: note.modifiedTime,
    })),
  )

  // <lastmod> must reflect real content changes. Search engines learn to
  // ignore sitemaps whose dates bump on every deploy, so listing pages
  // inherit the newest child date and pages with no dated content omit it.
  const latestPostDate = newestOf(posts)
  const latestNoteDate = newestOf(notes)

  const staticPages: (EntryOptions & { path: string; lastModified?: Date })[] =
    [
      {
        path: '/',
        lastModified: latestPostDate,
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        path: '/blog',
        lastModified: latestPostDate,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        path: '/notes',
        lastModified: latestNoteDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      { path: '/books', changeFrequency: 'monthly', priority: 0.8 },
      { path: '/linktree', changeFrequency: 'monthly', priority: 0.8 },
      { path: '/hobbies', changeFrequency: 'monthly', priority: 0.8 },
    ]

  return [
    ...staticPages.flatMap(({ path, lastModified, ...options }) =>
      localizedEntries(path, [...locales], options, () => lastModified),
    ),
    ...contentEntries(posts, { changeFrequency: 'monthly', priority: 0.7 }),
    ...contentEntries(notes, { changeFrequency: 'monthly', priority: 0.6 }),
  ]
}
