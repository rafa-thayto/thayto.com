'use client'

import posthog from 'posthog-js'
import { useEffect, useRef } from 'react'

const CANVAS_WIDTH = 160
const CANVAS_HEIGHT = 300
const ANCHOR_X = 120
const ANCHOR_Y = 4
const SEGMENTS = 11
const SPACING = 13
const REST_LENGTH = SEGMENTS * SPACING
// how far past rest length the cord must still be stretched at release to fire
const PULL_TRIGGER = 40
const MAX_STRETCH = REST_LENGTH * 1.35
const BEAD_RADIUS = 3.25
const HANDLE_RADIUS = 8
const HANDLE_HIT_SIZE = 36
const GRAVITY = 2200
const STEP = 1 / 120
const CONSTRAINT_ITERATIONS = 5
const FLASH_DURATION = 350
// frames of near-zero motion before the rAF loop goes to sleep
const SLEEP_FRAMES = 120

type Point = { x: number; y: number; px: number; py: number }

const createPoints = (): Point[] =>
  Array.from({ length: SEGMENTS + 1 }, (_, i) => ({
    x: ANCHOR_X,
    y: ANCHOR_Y + i * SPACING,
    px: ANCHOR_X,
    py: ANCHOR_Y + i * SPACING,
  }))

export const ThemePullCord = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const handle = handleRef.current
    if (!canvas || !handle) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = CANVAS_WIDTH * dpr
    canvas.height = CANVAS_HEIGHT * dpr
    ctx.scale(dpr, dpr)

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const damping = reducedMotion ? 0.9 : 0.985

    const points = createPoints()
    const last = points[SEGMENTS]

    // drop-in entrance: bunch the cord near the anchor with a random sideways
    // kick so gravity unfurls it differently on every page load
    const scatterForEntrance = () => {
      const kick = (Math.random() - 0.5) * 8
      for (let i = 1; i <= SEGMENTS; i++) {
        const p = points[i]
        p.x = ANCHOR_X + (Math.random() - 0.5) * 20
        p.y = ANCHOR_Y + i * 4 + Math.random() * 4
        p.px = p.x - kick * (i / SEGMENTS)
        p.py = p.y
      }
    }
    if (!reducedMotion) scatterForEntrance()

    let canvasRect = canvas.getBoundingClientRect()
    let dragging = false
    let dragX = last.x
    let dragY = last.y
    let flashStart = -FLASH_DURATION
    let flashToLight = false
    let running = false
    let calmFrames = 0
    let accumulator = 0
    let lastTime = 0
    let rafId = 0

    const isDark = () => document.documentElement.classList.contains('dark')

    const flashProgress = () =>
      (performance.now() - flashStart) / FLASH_DURATION

    const toggleTheme = () => {
      const newTheme = isDark() ? 'light' : 'dark'
      flashToLight = newTheme === 'light'
      flashStart = performance.now()

      posthog.capture('switch-theme', {
        from: newTheme === 'light' ? 'dark-to-light' : 'light-to-dark',
        source: 'pull-cord',
      })

      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      localStorage.setItem('theme', newTheme)
      window.dispatchEvent(new Event('themeChange'))
    }

    const integrate = () => {
      for (let i = 1; i <= SEGMENTS; i++) {
        const p = points[i]
        if (dragging && i === SEGMENTS) {
          p.px = p.x
          p.py = p.y
          p.x = dragX
          p.y = dragY
          continue
        }
        const vx = (p.x - p.px) * damping
        const vy = (p.y - p.py) * damping
        p.px = p.x
        p.py = p.y
        p.x += vx
        p.y += vy + GRAVITY * STEP * STEP
      }
    }

    const relaxConstraints = () => {
      for (let iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
        for (let i = 0; i < SEGMENTS; i++) {
          const a = points[i]
          const b = points[i + 1]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy) || 0.0001
          const diff = (dist - SPACING) / dist
          const aPinned = i === 0
          const bPinned = dragging && i + 1 === SEGMENTS
          if (aPinned && bPinned) continue
          if (aPinned) {
            b.x -= dx * diff
            b.y -= dy * diff
          } else if (bPinned) {
            a.x += dx * diff
            a.y += dy * diff
          } else {
            a.x += dx * diff * 0.5
            a.y += dy * diff * 0.5
            b.x -= dx * diff * 0.5
            b.y -= dy * diff * 0.5
          }
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      const dark = isDark()
      const cordColor = dark ? '#94a3b8' : '#64748b'
      const handleColor = dark ? '#cbd5e1' : '#475569'

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i <= SEGMENTS; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.strokeStyle = cordColor
      ctx.lineWidth = 1.5
      ctx.globalAlpha = 0.9
      ctx.stroke()
      ctx.globalAlpha = 1

      ctx.fillStyle = cordColor
      for (let i = 1; i < SEGMENTS; i++) {
        ctx.beginPath()
        ctx.arc(points[i].x, points[i].y, BEAD_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(last.x, last.y, HANDLE_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = handleColor
      ctx.fill()

      const t = flashProgress()
      if (t < 1) {
        ctx.beginPath()
        ctx.arc(last.x, last.y, HANDLE_RADIUS + t * 20, 0, Math.PI * 2)
        ctx.strokeStyle = flashToLight ? '#f97316' : '#3b82f6'
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.6 * (1 - t)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      handle.style.transform = `translate(${last.x - HANDLE_HIT_SIZE / 2}px, ${
        last.y - HANDLE_HIT_SIZE / 2
      }px)`
    }

    const totalMotion = () => {
      let motion = 0
      for (let i = 1; i <= SEGMENTS; i++) {
        motion += Math.abs(points[i].x - points[i].px)
        motion += Math.abs(points[i].y - points[i].py)
      }
      return motion
    }

    const loop = (now: number) => {
      accumulator += Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      while (accumulator >= STEP) {
        integrate()
        relaxConstraints()
        accumulator -= STEP
      }
      draw()

      const flashing = flashProgress() < 1
      if (!dragging && !flashing && totalMotion() < 0.25) {
        calmFrames++
      } else {
        calmFrames = 0
      }

      if (calmFrames > SLEEP_FRAMES) {
        running = false
        return
      }
      rafId = requestAnimationFrame(loop)
    }

    const wake = () => {
      calmFrames = 0
      if (running) return
      running = true
      lastTime = performance.now()
      accumulator = 0
      rafId = requestAnimationFrame(loop)
    }

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max)

    const setDragTarget = (e: PointerEvent) => {
      const dx = e.clientX - canvasRect.left - ANCHOR_X
      const dy = e.clientY - canvasRect.top - ANCHOR_Y
      const dist = Math.hypot(dx, dy) || 0.0001
      const scale = dist > MAX_STRETCH ? MAX_STRETCH / dist : 1
      dragX = clamp(ANCHOR_X + dx * scale, 10, CANVAS_WIDTH - 10)
      dragY = clamp(ANCHOR_Y + dy * scale, 4, CANVAS_HEIGHT - 12)
    }

    const onHandleDown = (e: PointerEvent) => {
      e.preventDefault()
      handle.setPointerCapture(e.pointerId)
      dragging = true
      handle.style.cursor = 'grabbing'
      setDragTarget(e)
      wake()
    }

    const onHandleMove = (e: PointerEvent) => {
      if (!dragging) return
      setDragTarget(e)
    }

    const settleHandle = () => {
      dragging = false
      handle.style.cursor = 'grab'
      wake()
    }

    const onHandleUp = () => {
      const pulledToMax =
        dragging && last.y - ANCHOR_Y > REST_LENGTH + PULL_TRIGGER
      settleHandle()
      if (pulledToMax) toggleTheme()
    }

    const onHandleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
      // scripted tug so keyboard users get the same pull-and-release feel
      last.y += 34
      toggleTheme()
      wake()
    }

    const onResize = () => {
      canvasRect = canvas.getBoundingClientRect()
    }

    const onThemeChange = () => wake()

    handle.addEventListener('pointerdown', onHandleDown)
    handle.addEventListener('pointermove', onHandleMove)
    handle.addEventListener('pointerup', onHandleUp)
    handle.addEventListener('pointercancel', settleHandle)
    handle.addEventListener('keydown', onHandleKeyDown)
    window.addEventListener('resize', onResize)
    window.addEventListener('themeChange', onThemeChange)

    draw()
    wake()

    return () => {
      cancelAnimationFrame(rafId)
      handle.removeEventListener('pointerdown', onHandleDown)
      handle.removeEventListener('pointermove', onHandleMove)
      handle.removeEventListener('pointerup', onHandleUp)
      handle.removeEventListener('pointercancel', settleHandle)
      handle.removeEventListener('keydown', onHandleKeyDown)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('themeChange', onThemeChange)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed right-1 top-0 z-40 md:right-4">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      />
      <div
        ref={handleRef}
        role="button"
        tabIndex={0}
        aria-label="Pull the cord to toggle theme"
        className="pointer-events-auto absolute left-0 top-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        style={{
          width: HANDLE_HIT_SIZE,
          height: HANDLE_HIT_SIZE,
          cursor: 'grab',
          touchAction: 'none',
        }}
      />
    </div>
  )
}
