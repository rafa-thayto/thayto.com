import { describe, expect, it } from 'vitest'
import { buildIndexNowPayload, recentlyModifiedUrls } from './indexnow'

const now = new Date('2026-09-02T12:00:00Z')

describe('recentlyModifiedUrls', () => {
  it('keeps pages modified inside the trailing window', () => {
    const urls = recentlyModifiedUrls(
      [
        { path: '/blog/fresh', modifiedTime: '2026-09-01T00:00:00Z' },
        { path: '/en/blog/fresh', modifiedTime: new Date('2026-08-30') },
        { path: '/blog/stale', modifiedTime: '2026-01-01T00:00:00Z' },
      ],
      now,
    )
    expect(urls).toEqual([
      'https://thayto.com/blog/fresh',
      'https://thayto.com/en/blog/fresh',
    ])
  })

  it('drops pages with unparseable dates', () => {
    expect(
      recentlyModifiedUrls([{ path: '/blog/x', modifiedTime: 'nope' }], now),
    ).toEqual([])
  })

  it('honours a custom window', () => {
    const pages = [{ path: '/blog/x', modifiedTime: '2026-08-20T00:00:00Z' }]
    expect(recentlyModifiedUrls(pages, now, 7)).toEqual([])
    expect(recentlyModifiedUrls(pages, now, 30)).toHaveLength(1)
  })
})

describe('buildIndexNowPayload', () => {
  it('points keyLocation at the served key file on the same host', () => {
    expect(buildIndexNowPayload('abc', ['https://thayto.com/blog/x'])).toEqual({
      host: 'thayto.com',
      key: 'abc',
      keyLocation: 'https://thayto.com/indexnow-key.txt',
      urlList: ['https://thayto.com/blog/x'],
    })
  })
})
