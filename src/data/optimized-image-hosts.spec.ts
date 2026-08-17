import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  canOptimizeImage,
  optimizedImageHosts,
} from '@/utils/image-optimization'
import { locales } from '@/i18n/config'

const POSTS_ROOT = join(process.cwd(), 'posts')

const remoteImageSources = () =>
  locales
    .flatMap((locale) => {
      const dir = join(POSTS_ROOT, locale)
      return readdirSync(dir)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => readFileSync(join(dir, file), 'utf-8'))
    })
    .flatMap(
      (source) => source.match(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g) ?? [],
    )
    .map((match) => match.replace(/^!\[[^\]]*\]\(/, '').replace(/\)$/, ''))

describe('optimized image hosts', () => {
  it('describes each host in the shape next.config.js expects', () => {
    expect(optimizedImageHosts.length).toBeGreaterThan(0)

    optimizedImageHosts.forEach(({ hostname, pathPrefix }) => {
      expect(hostname).toBe(hostname.toLowerCase())
      expect(hostname).not.toContain('/')
      // next.config.js appends '**' to build the remotePatterns pathname.
      expect(pathPrefix.startsWith('/')).toBe(true)
      expect(pathPrefix.endsWith('/')).toBe(true)
    })
  })

  // Guards the reason this allowlist exists: every image actually published in
  // a post should reach next/image. A new host here means either adding it
  // above or knowingly accepting the unoptimized fallback.
  it('optimizes every remote image used in the posts', () => {
    const sources = remoteImageSources()
    expect(sources.length).toBeGreaterThan(0)

    const unoptimized = [
      ...new Set(sources.filter((src) => !canOptimizeImage(src))),
    ]

    expect(unoptimized).toEqual([])
  })
})
