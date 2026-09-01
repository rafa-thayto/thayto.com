'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { handwrite, type HandwritingOptions } from '@/utils/handwriting'
import { cn } from '@/lib/utils'
import styles from './handwriting.module.css'

type HandwritingProps = HandwritingOptions & {
  text: string
  className?: string
  style?: CSSProperties
  // 'view' draws once the drawing scrolls into view, 'load' draws right away
  trigger?: 'view' | 'load'
  // wait before the first stroke, in ms
  delay?: number
  // how long each stroke takes, in ms
  duration?: number
  // gap between consecutive strokes, in ms
  stagger?: number
  label?: string
}

export function Handwriting({
  text,
  className,
  style,
  trigger = 'view',
  delay = 200,
  duration = 1000,
  stagger = 45,
  label,
  seed,
  letterSpacing,
  jitter,
  tilt,
  strokeWidth = 2.2,
}: HandwritingProps) {
  const ref = useRef<SVGSVGElement>(null)
  const [drawing, setDrawing] = useState(trigger === 'load')

  const { strokes, viewBox } = useMemo(
    () => handwrite(text, { seed, letterSpacing, jitter, tilt, strokeWidth }),
    [text, seed, letterSpacing, jitter, tilt, strokeWidth],
  )

  useEffect(() => {
    if (trigger !== 'view' || drawing) return
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDrawing(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDrawing(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [trigger, drawing])

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(styles.root, className)}
      data-drawing={drawing ? 'true' : 'false'}
      style={
        {
          '--handwriting-delay': `${delay}ms`,
          '--handwriting-duration': `${duration}ms`,
          '--handwriting-stagger': `${stagger}ms`,
          '--handwriting-stroke-width': strokeWidth,
          ...style,
        } as CSSProperties
      }
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {label && <title>{label}</title>}
      {strokes.map((stroke) => (
        <path
          key={stroke.order}
          d={stroke.d}
          pathLength={1}
          className={styles.stroke}
          style={{ '--stroke-order': stroke.order } as CSSProperties}
        />
      ))}
    </svg>
  )
}
