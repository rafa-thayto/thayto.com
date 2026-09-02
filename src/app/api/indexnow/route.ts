import { NextRequest, NextResponse } from 'next/server'
import { getPosts, Post } from '@/utils/mdx'
import { getNotes } from '@/utils/notes'
import { locales } from '@/i18n/config'
import { toLocalePath } from '@/utils/seo'
import {
  DatedPage,
  recentlyModifiedUrls,
  submitToIndexNow,
} from '@/utils/indexnow'

// Runs daily from the Vercel cron in vercel.json. Vercel sends the CRON_SECRET
// as a bearer token, so nothing else can trigger submissions.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const key = process.env.INDEXNOW_KEY

  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (!key) {
    return NextResponse.json(
      { error: 'INDEXNOW_KEY is not configured' },
      { status: 500 },
    )
  }

  const pages: DatedPage[] = locales.flatMap((locale) => [
    ...(getPosts(locale) as Post[]).map((post) => ({
      path: toLocalePath(locale, post.data.href),
      modifiedTime: post.data.modifiedTime,
    })),
    ...getNotes(locale).map((note) => ({
      path: toLocalePath(locale, `/notes/${note.number}`),
      modifiedTime: note.modifiedTime,
    })),
  ])

  const urlList = recentlyModifiedUrls(pages, new Date())
  const result = await submitToIndexNow(key, urlList)

  return NextResponse.json({ ...result, urlList })
}
