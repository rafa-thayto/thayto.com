import glyphs from '@/data/hershey-cursive.json'

// Glyph data is the public-domain Hershey "Script 1-stroke" font (via the
// hersheytext project). Each glyph is a set of polylines in a ~22-unit-tall
// coordinate space with the baseline at y=22, drawn by a plotter pen one
// stroke at a time, which is exactly what a stroke-dashoffset "handwriting"
// animation needs. The advance factor mirrors hersheytext's renderer.
const ADVANCE_FACTOR = 1.68
const glyphMap = glyphs as Record<string, { d: string; o: number }>

export type Stroke = {
  d: string
  // draw order across the whole text; the animation staggers by this
  order: number
}

export type HandwritingOptions = {
  seed?: number
  // extra space between glyphs, in font units
  letterSpacing?: number
  // max random offset applied to every point, in font units
  jitter?: number
  // max rotation applied to each glyph around its own centre, in degrees
  tilt?: number
  // stroke width in font units, used to pad the viewBox so round caps fit
  strokeWidth?: number
}

export type Handwriting = {
  strokes: Stroke[]
  viewBox: string
  width: number
  height: number
}

type Point = [number, number]

// deterministic pseudo-random in [0, 1): the same text + seed always draws
// the same wobble, so server and client markup match
export const noise = (seed: number, salt: number): number => {
  const n = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453
  return n - Math.floor(n)
}

const hashText = (text: string): number =>
  Array.from(text).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 9973, 7)

const parsePolylines = (d: string): Point[][] =>
  d
    .split('M')
    .filter((part) => part.trim() !== '')
    .map((part) =>
      part
        .replace('L', ' ')
        .trim()
        .split(/\s+/)
        .map((pair) => pair.split(',').map(Number) as Point),
    )

const rotate = ([x, y]: Point, [cx, cy]: Point, degrees: number): Point => {
  const rad = (degrees * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const dx = x - cx
  const dy = y - cy
  return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos]
}

const round = (n: number) => Math.round(n * 100) / 100

// Catmull-Rom through the plotter vertices → cubic Béziers, so the big index
// numbers read as pen curves instead of visibly faceted polylines
const toSmoothPath = (points: Point[]): string => {
  if (points.length === 1) {
    const [x, y] = points[0]
    return `M${round(x)} ${round(y)} L${round(x)} ${round(y)}`
  }
  if (points.length === 2) {
    const [[x0, y0], [x1, y1]] = points
    return `M${round(x0)} ${round(y0)} L${round(x1)} ${round(y1)}`
  }

  let d = `M${round(points[0][0])} ${round(points[0][1])}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(
      c2[1],
    )} ${round(p2[0])} ${round(p2[1])}`
  }
  return d
}

export const supportsText = (text: string): boolean =>
  Array.from(text).every((ch) => ch in glyphMap)

export const handwrite = (
  text: string,
  {
    seed = hashText(text),
    letterSpacing = 0,
    jitter = 0.35,
    tilt = 3,
    strokeWidth = 2.2,
  }: HandwritingOptions = {},
): Handwriting => {
  const strokes: Stroke[] = []
  let cursor = 0
  let order = 0
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  Array.from(text).forEach((ch, glyphIndex) => {
    const glyph = glyphMap[ch] ?? glyphMap[' ']
    const polylines = parsePolylines(glyph.d)
    const glyphSeed = seed + glyphIndex * 17
    const angle = (noise(glyphSeed, 1) * 2 - 1) * tilt
    const baselineShift = (noise(glyphSeed, 2) * 2 - 1) * jitter * 1.5
    const centre: Point = [cursor + (glyph.o * ADVANCE_FACTOR) / 2, 11.5]

    polylines.forEach((polyline, strokeIndex) => {
      const points = polyline.map(([x, y], pointIndex): Point => {
        const salt = strokeIndex * 101 + pointIndex * 13
        const jx = (noise(glyphSeed, salt + 3) * 2 - 1) * jitter
        const jy = (noise(glyphSeed, salt + 4) * 2 - 1) * jitter
        const point = rotate(
          [cursor + x + jx, y + jy + baselineShift],
          centre,
          angle,
        )
        minX = Math.min(minX, point[0])
        minY = Math.min(minY, point[1])
        maxX = Math.max(maxX, point[0])
        maxY = Math.max(maxY, point[1])
        return point
      })
      strokes.push({ d: toSmoothPath(points), order })
      order += 1
    })

    cursor += glyph.o * ADVANCE_FACTOR + letterSpacing
  })

  if (strokes.length === 0) {
    return { strokes, viewBox: '0 0 1 1', width: 1, height: 1 }
  }

  const pad = strokeWidth
  const x = round(minX - pad)
  const y = round(minY - pad)
  const width = round(maxX - minX + pad * 2)
  const height = round(maxY - minY + pad * 2)

  return { strokes, viewBox: `${x} ${y} ${width} ${height}`, width, height }
}
