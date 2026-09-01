import { noise } from '@/utils/handwriting'

export const BLOB_WIDTH = 831
export const BLOB_HEIGHT = 379

const POINTS = 11
const round = (n: number) => Math.round(n * 10) / 10

// A closed, wobbly ellipse: radius modulated by seeded noise, then run through
// Catmull-Rom so it reads as one marker stroke rather than a polygon. Few
// points and a wide wobble range keep it lumpy instead of geometric.
export const blobPath = (seed: number): string => {
  const cx = BLOB_WIDTH / 2
  const cy = BLOB_HEIGHT / 2
  const points = Array.from({ length: POINTS }, (_, i) => {
    const angle = (i / POINTS) * Math.PI * 2 + noise(seed, i + 50) * 0.25
    const wobble = 0.82 + noise(seed, i + 1) * 0.18
    return [
      cx + Math.cos(angle) * cx * wobble,
      cy + Math.sin(angle) * cy * wobble,
    ] as const
  })

  const at = (i: number) => points[(i + POINTS) % POINTS]
  let d = `M${round(at(0)[0])} ${round(at(0)[1])}`
  for (let i = 0; i < POINTS; i++) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(
      p2[0],
    )} ${round(p2[1])}`
  }
  return `${d} Z`
}

// Every blob gets its own slight rotation, skew and squash so the stack
// never looks stamped from one template.
export const blobTransform = (seed: number): string => {
  const rotate = -4 + 8 * noise(seed, 101)
  const scaleX = 0.94 + 0.06 * noise(seed, 102)
  const scaleY = 0.94 + 0.06 * noise(seed, 103)
  const skewX = -2 + 4 * noise(seed, 104)
  const cx = BLOB_WIDTH / 2
  const cy = BLOB_HEIGHT / 2
  return `translate(${cx} ${cy}) rotate(${rotate}) skewX(${skewX}) scale(${scaleX} ${scaleY}) translate(${-cx} ${-cy})`
}
