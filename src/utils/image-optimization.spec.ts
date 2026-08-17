import { describe, expect, it } from 'vitest'
import { canOptimizeImage } from './image-optimization'

describe('canOptimizeImage', () => {
  it('optimizes local images', () => {
    expect(canOptimizeImage('/static/images/profile.jpg')).toBe(true)
    expect(canOptimizeImage('/vercel.svg')).toBe(true)
  })

  it('optimizes remote images from an allowed host and path', () => {
    expect(
      canOptimizeImage(
        'https://dev-to-uploads.s3.amazonaws.com/uploads/articles/abc.png',
      ),
    ).toBe(true)
  })

  it('ignores host casing, since URL hostnames are case-insensitive', () => {
    expect(
      canOptimizeImage(
        'https://DEV-TO-UPLOADS.s3.amazonaws.com/uploads/articles/abc.png',
      ),
    ).toBe(true)
  })

  // next/image throws at runtime on a host that remotePatterns doesn't cover,
  // so anything outside the allowlist has to fall back to a plain img tag.
  it('refuses hosts that are not allowed', () => {
    expect(canOptimizeImage('https://example.com/photo.png')).toBe(false)
    expect(
      canOptimizeImage(
        'https://evil.dev-to-uploads.s3.amazonaws.com/uploads/a.png',
      ),
    ).toBe(false)
  })

  it('refuses allowed hosts on a path the config does not cover', () => {
    expect(
      canOptimizeImage('https://dev-to-uploads.s3.amazonaws.com/private/a.png'),
    ).toBe(false)
  })

  // remotePatterns pins the protocol to https.
  it('refuses plain http even on an allowed host', () => {
    expect(
      canOptimizeImage(
        'http://dev-to-uploads.s3.amazonaws.com/uploads/articles/abc.png',
      ),
    ).toBe(false)
  })

  // remotePatterns pins `port: ''`, which only matches the protocol default.
  it('refuses allowed hosts served from a non-default port', () => {
    expect(
      canOptimizeImage(
        'https://dev-to-uploads.s3.amazonaws.com:9999/uploads/a.png',
      ),
    ).toBe(false)
  })

  it('allows the explicit default https port', () => {
    expect(
      canOptimizeImage(
        'https://dev-to-uploads.s3.amazonaws.com:443/uploads/a.png',
      ),
    ).toBe(true)
  })

  it('refuses malformed urls instead of throwing', () => {
    expect(canOptimizeImage('https://')).toBe(false)
  })
})
