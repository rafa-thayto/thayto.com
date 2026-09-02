import { SITE_URL } from './constants'

export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow'
export const INDEXNOW_KEY_PATH = '/indexnow-key.txt'
const DAY_MS = 24 * 60 * 60 * 1000

export type DatedPage = {
  /** Locale-prefixed path, e.g. "/blog/slug" or "/en/blog/slug" */
  path: string
  modifiedTime: string | Date
}

// IndexNow asks for URLs only when they change. The site has no persistent
// "last submitted" store, so the cron resubmits anything modified in a short
// trailing window instead; IndexNow deduplicates repeated submissions.
export const recentlyModifiedUrls = (
  pages: DatedPage[],
  now: Date,
  windowDays = 7,
): string[] => {
  const cutoff = now.getTime() - windowDays * DAY_MS
  return pages
    .filter((page) => {
      const modified = new Date(page.modifiedTime).getTime()
      return !Number.isNaN(modified) && modified >= cutoff
    })
    .map((page) => `${SITE_URL}${page.path}`)
}

export const buildIndexNowPayload = (key: string, urlList: string[]) => ({
  host: new URL(SITE_URL).host,
  key,
  keyLocation: `${SITE_URL}${INDEXNOW_KEY_PATH}`,
  urlList,
})

export const submitToIndexNow = async (key: string, urlList: string[]) => {
  if (urlList.length === 0) return { status: 204, submitted: 0 }
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(buildIndexNowPayload(key, urlList)),
  })
  return { status: response.status, submitted: urlList.length }
}
