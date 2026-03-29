'use client'

import { useEffect, useRef } from 'react'
import { Link, useRouter } from '@/i18n/routing'

type PostData = {
  title: string
  description: string
  href: string
  publishedTime: string
  tags: string[]
}

type Props = {
  posts: PostData[]
  locale: string
}

type LineInfo = {
  text: string
  type: 'title' | 'date' | 'description' | 'separator'
  postIndex: number
}

const CONFIG = {
  centerFontSize: 30,
  edgeFontSize: 11,
  morphRadius: 300,
  lineHeightMultiplier: 1.6,
  separatorHeight: 50,
  friction: 0.95,
  padding: 48,
  bg: '#0a0a0a',
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function resolveFont(): { sans: string; serif: string } {
  const poppins = getComputedStyle(document.body)
    .getPropertyValue('--font-poppins')
    .trim()
  const lora = getComputedStyle(document.body)
    .getPropertyValue('--font-lora')
    .trim()

  return {
    sans: poppins ? `${poppins}, sans-serif` : 'Poppins, sans-serif',
    serif: lora ? `${lora}, serif` : 'Lora, serif',
  }
}

export function PostsCanvas({ posts, locale }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    scrollY: 0,
    velocity: 0,
    maxScroll: 0,
    lines: [] as LineInfo[],
    isDragging: false,
    lastTouchY: 0,
    lastTouchTime: 0,
    focusedPostIndex: 0,
    animFrame: 0,
    dpr: 1,
    width: 0,
    height: 0,
    fontSans: 'Poppins, sans-serif',
    fontSerif: 'Lora, serif',
  })
  const router = useRouter()

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = stateRef.current

    function resize() {
      const rect = container!.getBoundingClientRect()
      state.dpr = Math.min(devicePixelRatio || 1, 3)
      canvas!.width = rect.width * state.dpr
      canvas!.height = rect.height * state.dpr
      state.width = rect.width
      state.height = rect.height
    }

    async function prepareLines() {
      resize()
      await document.fonts.ready

      const fonts = resolveFont()
      state.fontSans = fonts.sans
      state.fontSerif = fonts.serif

      const { prepareWithSegments, layoutWithLines, setLocale } = await import(
        '@chenglou/pretext'
      )

      setLocale(locale === 'pt' ? 'pt-BR' : 'en-US')

      const maxWidth = state.width - CONFIG.padding * 2
      const lines: LineInfo[] = []

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i]

        // Title — laid out at center font size (largest) to avoid overflow
        const titleFont = `600 ${CONFIG.centerFontSize}px ${state.fontSerif}`
        const titlePrepared = prepareWithSegments(post.title, titleFont)
        const titleLayout = layoutWithLines(
          titlePrepared,
          maxWidth,
          CONFIG.centerFontSize * CONFIG.lineHeightMultiplier,
        )
        for (const line of titleLayout.lines) {
          lines.push({ text: line.text, type: 'title', postIndex: i })
        }

        // Date
        const date = new Date(post.publishedTime).toLocaleDateString(
          locale === 'pt' ? 'pt-BR' : 'en-US',
          { year: 'numeric', month: 'long', day: 'numeric' },
        )
        lines.push({ text: date, type: 'date', postIndex: i })

        // Description
        const descSize = Math.round(CONFIG.centerFontSize * 0.6)
        const descFont = `${descSize}px ${state.fontSans}`
        const descPrepared = prepareWithSegments(post.description, descFont)
        const descLayout = layoutWithLines(
          descPrepared,
          maxWidth,
          descSize * CONFIG.lineHeightMultiplier,
        )
        for (const line of descLayout.lines) {
          lines.push({ text: line.text, type: 'description', postIndex: i })
        }

        // Separator between posts
        if (i < posts.length - 1) {
          lines.push({ text: '', type: 'separator', postIndex: i })
        }
      }

      state.lines = lines

      // maxScroll: use edge-size heights (tight) + buffer for the morph expansion zone
      let totalHeight = 0
      for (const line of lines) {
        if (line.type === 'separator') {
          totalHeight += CONFIG.separatorHeight
        } else if (line.type === 'title') {
          totalHeight += CONFIG.edgeFontSize * CONFIG.lineHeightMultiplier
        } else if (line.type === 'date') {
          totalHeight += CONFIG.edgeFontSize * 0.6 * CONFIG.lineHeightMultiplier
        } else {
          totalHeight +=
            CONFIG.edgeFontSize * 0.65 * CONFIG.lineHeightMultiplier
        }
      }
      // Add buffer for the center expansion zone where lines are enlarged
      state.maxScroll = Math.max(0, totalHeight + CONFIG.morphRadius * 0.5)
    }

    function render() {
      if (!ctx || !canvas) return
      const { width, height, dpr } = state

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = CONFIG.bg
      ctx.fillRect(0, 0, width, height)
      ctx.textBaseline = 'top'

      const lines = state.lines
      if (lines.length === 0) {
        state.animFrame = requestAnimationFrame(render)
        return
      }

      // Momentum physics
      if (!state.isDragging) {
        state.scrollY += state.velocity
        state.velocity *= CONFIG.friction

        // Elastic overscroll with bounce-back
        if (state.scrollY < 0) {
          state.scrollY *= 0.85
          state.velocity *= 0.5
        } else if (state.scrollY > state.maxScroll) {
          const over = state.scrollY - state.maxScroll
          state.scrollY = state.maxScroll + over * 0.85
          state.velocity *= 0.5
        }

        if (Math.abs(state.velocity) < 0.1) state.velocity = 0
      }

      const viewCenter = height / 2
      // First post at viewport center when scrollY=0, scrolling down reveals more
      let y = viewCenter - state.scrollY

      let closestDist = Infinity
      let closestPost = 0

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (line.type === 'separator') {
          y += CONFIG.separatorHeight
          continue
        }

        // Base sizes per line type
        let centerSize: number
        let edgeSize: number
        let fontWeight = ''
        let fontFamily = state.fontSans

        if (line.type === 'title') {
          centerSize = CONFIG.centerFontSize
          edgeSize = CONFIG.edgeFontSize
          fontWeight = '600 '
          fontFamily = state.fontSerif
        } else if (line.type === 'date') {
          centerSize = CONFIG.centerFontSize * 0.45
          edgeSize = CONFIG.edgeFontSize * 0.6
        } else {
          centerSize = CONFIG.centerFontSize * 0.6
          edgeSize = CONFIG.edgeFontSize * 0.65
        }

        // Morph calculation
        const approxLineH = centerSize * CONFIG.lineHeightMultiplier
        const lineCenter = y + approxLineH / 2
        const dist = Math.abs(lineCenter - viewCenter)
        const t = Math.min(dist / CONFIG.morphRadius, 1)
        const ease = easeOutCubic(t)

        const fontSize = lerp(centerSize, edgeSize, ease)
        const lineHeight = fontSize * CONFIG.lineHeightMultiplier

        // Track which title is closest to viewport center
        if (line.type === 'title' && dist < closestDist) {
          closestDist = dist
          closestPost = line.postIndex
        }

        // Cull off-screen lines
        if (y + lineHeight < -100 || y > height + 100) {
          y += lineHeight
          continue
        }

        // Visual properties per line type
        let opacity: number
        let gray: number

        if (line.type === 'title') {
          opacity = lerp(1.0, 0.25, ease)
          gray = lerp(255, 120, ease)
        } else if (line.type === 'date') {
          opacity = lerp(0.5, 0.1, ease)
          gray = lerp(150, 60, ease)
        } else {
          opacity = lerp(0.75, 0.15, ease)
          gray = lerp(200, 80, ease)
        }

        ctx.save()
        ctx.globalAlpha = opacity
        ctx.fillStyle = `rgb(${Math.round(gray)},${Math.round(
          gray,
        )},${Math.round(gray)})`
        ctx.font = `${fontWeight}${fontSize}px ${fontFamily}`
        ctx.fillText(line.text, CONFIG.padding, y)
        ctx.restore()

        y += lineHeight
      }

      state.focusedPostIndex = closestPost
      state.animFrame = requestAnimationFrame(render)
    }

    // --- Event handlers ---

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      state.scrollY += e.deltaY
      state.velocity = 0
    }

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 1) {
        state.isDragging = true
        state.lastTouchY = e.touches[0].clientY
        state.lastTouchTime = performance.now()
        state.velocity = 0
      }
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
      if (e.touches.length === 1 && state.isDragging) {
        const touchY = e.touches[0].clientY
        const delta = state.lastTouchY - touchY
        state.scrollY += delta

        const now = performance.now()
        const dt = now - state.lastTouchTime
        if (dt > 0) {
          state.velocity = (delta / dt) * (1000 / 60)
        }

        state.lastTouchY = touchY
        state.lastTouchTime = now
      }
    }

    function onTouchEnd() {
      state.isDragging = false
    }

    function onClick() {
      const post = posts[state.focusedPostIndex]
      if (post) {
        router.push(post.href)
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowDown':
        case 'j':
          e.preventDefault()
          state.velocity += 8
          break
        case 'ArrowUp':
        case 'k':
          e.preventDefault()
          state.velocity -= 8
          break
        case 'Enter': {
          const post = posts[state.focusedPostIndex]
          if (post) router.push(post.href)
          break
        }
      }
    }

    function onResize() {
      cancelAnimationFrame(state.animFrame)
      prepareLines().then(() => {
        state.animFrame = requestAnimationFrame(render)
      })
    }

    // Initialize
    prepareLines().then(() => {
      state.animFrame = requestAnimationFrame(render)
    })

    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)
    canvas.addEventListener('click', onClick)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(state.animFrame)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [posts, locale, router])

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#0a0a0a]">
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-pointer"
        style={{ touchAction: 'none' }}
        tabIndex={0}
        role="list"
        aria-label={
          locale === 'pt' ? 'Lista de posts do blog' : 'Blog posts list'
        }
      />

      {/* Overlay UI */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6">
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="text-white/40 hover:text-white/80 transition-colors text-sm font-medium tracking-wide"
          >
            ← {locale === 'pt' ? 'Voltar' : 'Back'}
          </Link>
        </div>
        <div className="text-center pb-2">
          <p className="text-white/20 text-xs tracking-widest uppercase animate-pulse">
            {locale === 'pt'
              ? 'Role para explorar · Clique para ler'
              : 'Scroll to explore · Click to read'}
          </p>
        </div>
      </div>

      {/* Hidden semantic content for SEO and accessibility */}
      <nav className="sr-only" aria-label="Blog posts">
        <h1>{locale === 'pt' ? 'Posts do Blog' : 'Blog Posts'}</h1>
        <ol>
          {posts.map((post) => (
            <li key={post.href}>
              <h2>
                <Link href={post.href}>{post.title}</Link>
              </h2>
              <p>{post.description}</p>
              <time dateTime={post.publishedTime}>
                {new Date(post.publishedTime).toLocaleDateString(
                  locale === 'pt' ? 'pt-BR' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' },
                )}
              </time>
              {post.tags.length > 0 && (
                <ul aria-label="Tags">
                  {post.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
