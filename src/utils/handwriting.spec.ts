import { describe, expect, it } from 'vitest'
import { handwrite, noise, supportsText } from './handwriting'

describe('handwrite', () => {
  it('is deterministic for the same text and seed', () => {
    const a = handwrite('Notas do Rafael #1', { seed: 3 })
    const b = handwrite('Notas do Rafael #1', { seed: 3 })
    expect(a).toEqual(b)
  })

  it('changes the wobble when the seed changes', () => {
    const a = handwrite('#1', { seed: 1 })
    const b = handwrite('#1', { seed: 2 })
    expect(a.strokes.map((s) => s.d)).not.toEqual(b.strokes.map((s) => s.d))
  })

  it('numbers strokes in drawing order', () => {
    const { strokes } = handwrite('#12')
    expect(strokes.map((s) => s.order)).toEqual(
      strokes.map((_, index) => index),
    )
    // '#' is four pen strokes, each digit one
    expect(strokes).toHaveLength(6)
  })

  it('emits smooth cubic paths for multi-point strokes', () => {
    const { strokes } = handwrite('0')
    expect(strokes[0].d).toMatch(/^M[\d.-]+ [\d.-]+ C/)
  })

  it('fits the viewBox around every point with room for the pen width', () => {
    const { viewBox, width, height } = handwrite('Rafael', {
      jitter: 0,
      tilt: 0,
      strokeWidth: 2,
    })
    const [x, y, w, h] = viewBox.split(' ').map(Number)
    expect(w).toBe(width)
    expect(h).toBe(height)
    expect(x).toBeLessThan(0 + 2)
    expect(y).toBeLessThan(1)
    expect(w).toBeGreaterThan(40)
    expect(h).toBeGreaterThan(20)
  })

  it('treats unknown characters as spaces instead of throwing', () => {
    expect(supportsText('Notas do Rafael #1')).toBe(true)
    expect(supportsText("Rafael's Notes")).toBe(true)
    expect(supportsText('ção')).toBe(false)
    const withUnknown = handwrite('aça')
    const withSpace = handwrite('a a')
    expect(withUnknown.strokes).toHaveLength(withSpace.strokes.length)
  })

  it('returns an empty drawing for empty text', () => {
    expect(handwrite('').strokes).toEqual([])
  })
})

describe('noise', () => {
  it('stays within [0, 1) and is stable', () => {
    for (let i = 0; i < 50; i++) {
      const n = noise(i, 7)
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(1)
      expect(noise(i, 7)).toBe(n)
    }
  })
})
