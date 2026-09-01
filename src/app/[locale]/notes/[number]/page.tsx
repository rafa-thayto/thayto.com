import { Layout } from '@/components'
import { Handwriting } from '@/components/handwriting'
import { getMdxComponents, noteMdxOptions } from '@/components/mdx/mdx-config'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Locale, locales } from '@/i18n/config'
import { SITE_URL } from '@/utils/constants'
import { getNote, getNoteNumbers, parseNoteNumber } from '@/utils/notes'
import {
  SCHEMA_CONTEXT,
  TWITTER_CARD,
  toOgLocale,
  toAlternateOgLocale,
  toCanonicalUrl,
  toLanguageTag,
  alternateLanguages,
  personSummary,
  organizationPublisher,
  breadcrumbSchema,
  JsonLd,
} from '@/utils/seo'
import { NotesLabel } from '../notes-label'
import styles from '../notes.module.css'

type Props = {
  params: Promise<{ locale: string; number: string }>
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getNoteNumbers(locale).map((number) => ({
      locale,
      number: String(number),
    })),
  )
}

async function resolveNote(params: Props['params']) {
  const { locale, number } = await params
  if (!locales.includes(locale as Locale)) return null
  const parsed = parseNoteNumber(number)
  if (parsed === null) return null
  const note = getNote(locale, parsed)
  if (!note) return null
  return { locale: locale as Locale, note }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await resolveNote(params)
  if (!resolved) return {}

  const { locale, note } = resolved
  const t = await getTranslations({ locale, namespace: 'notes' })
  const title = `${t('label')} #${note.number}`
  const notePath = `/notes/${note.number}`
  const canonicalUrl = toCanonicalUrl(locale, notePath)

  return {
    title: `${title} - Rafael Thayto`,
    description: note.description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages(notePath),
      types: { 'text/markdown': `${canonicalUrl}.md` },
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description: note.description,
      locale: toOgLocale(locale),
      alternateLocale: toAlternateOgLocale(locale),
      siteName: 'Thayto.com',
      publishedTime: note.publishedTime,
      modifiedTime: note.modifiedTime,
      authors: ['Rafael Thayto'],
    },
    twitter: TWITTER_CARD,
  }
}

export default async function NotePage({ params }: Props) {
  const resolved = await resolveNote(params)
  if (!resolved) notFound()

  const { locale, note } = resolved
  const t = await getTranslations({ locale, namespace: 'notes' })
  const title = `${t('label')} #${note.number}`
  const notePath = `/notes/${note.number}`
  const noteUrl = toCanonicalUrl(locale, notePath)

  const articleSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Article' as const,
    '@id': noteUrl,
    url: noteUrl,
    mainEntityOfPage: { '@type': 'WebPage' as const, '@id': noteUrl },
    headline: title,
    description: note.description,
    datePublished: note.publishedTime,
    dateModified: note.modifiedTime,
    inLanguage: toLanguageTag(locale),
    articleSection: t('label'),
    isPartOf: { '@id': toCanonicalUrl(locale, '/notes') },
    author: personSummary(locale),
    publisher: organizationPublisher(),
    image: `${SITE_URL}/static/images/profile.jpg`,
    breadcrumb: breadcrumbSchema(locale, [
      { name: 'Home', path: '/' },
      { name: t('label'), path: '/notes' },
      { name: `#${note.number}`, path: notePath },
    ]),
  }

  return (
    <Layout>
      <JsonLd data={articleSchema} />
      <div data-route="note" className={styles.root}>
        <NotesLabel backFrom={note.number} />
        <main className={styles.note}>
          <h1 className="sr-only">{title}</h1>
          <Handwriting
            text={title}
            seed={note.number}
            trigger="load"
            className={styles.title}
          />
          <article className={styles.article}>
            <MDXRemote
              source={note.content}
              components={getMdxComponents({
                slug: `notes/${note.number}`,
                locale,
                title,
              })}
              options={{ mdxOptions: noteMdxOptions }}
            />
          </article>
          <Handwriting
            text="tmj :)"
            seed={note.number + 1000}
            className={styles.signature}
            strokeWidth={2.6}
            stagger={120}
            label="tmj :)"
          />
        </main>
      </div>
    </Layout>
  )
}
