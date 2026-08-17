import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MDXImage } from './MDXImage'

vi.mock('posthog-js', () => ({ posthog: { capture: vi.fn() } }))

const imageOf = (alt: string) => screen.getByAltText(alt)
const isOptimized = (alt: string) =>
  imageOf(alt).getAttribute('data-next-image') === 'true'

describe('MDXImage', () => {
  it('routes local images through the optimizer', () => {
    render(<MDXImage src="/static/images/profile.jpg" alt="local" />)
    expect(isOptimized('local')).toBe(true)
  })

  it('routes allowed remote hosts through the optimizer', () => {
    render(
      <MDXImage
        src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a.png"
        alt="allowed"
      />,
    )
    expect(isOptimized('allowed')).toBe(true)
  })

  // next/image throws on hosts remotePatterns does not cover, so these have to
  // render as-is rather than break the whole post.
  it('renders disallowed remote hosts unoptimized instead of failing', () => {
    render(<MDXImage src="https://example.com/photo.png" alt="disallowed" />)
    expect(isOptimized('disallowed')).toBe(false)
    expect(imageOf('disallowed').getAttribute('src')).toBe(
      'https://example.com/photo.png',
    )
  })
})
