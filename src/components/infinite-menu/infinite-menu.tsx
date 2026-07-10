'use client'

import { useEffect, useRef } from 'react'
import {
  InfiniteGridMenu,
  defaultItems,
  type InfiniteMenuItem,
} from './infinite-menu-engine'
import './infinite-menu.css'

export type { InfiniteMenuItem }

interface InfiniteMenuProps {
  items?: InfiniteMenuItem[]
  scale?: number
  /** Fires with the index (into `items`) of the disc facing the camera. */
  onActiveIndex?: (index: number) => void
  /** Fires when the sphere starts/stops moving (drag or inertia). */
  onMovingChange?: (isMoving: boolean) => void
}

export default function InfiniteMenu({
  items = [],
  scale = 1.0,
  onActiveIndex,
  onMovingChange,
}: InfiniteMenuProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Keep callbacks in refs so changing their identity doesn't re-run the effect
  // (which would tear down and rebuild the whole WebGL engine).
  const onActiveIndexRef = useRef(onActiveIndex)
  const onMovingChangeRef = useRef(onMovingChange)
  useEffect(() => {
    onActiveIndexRef.current = onActiveIndex
    onMovingChangeRef.current = onMovingChange
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const menuItems = items.length ? items : defaultItems

    const handleActiveItem = (index: number) => {
      onActiveIndexRef.current?.(index % menuItems.length)
    }

    let sketch: InfiniteGridMenu | null = null
    try {
      sketch = new InfiniteGridMenu(
        canvas,
        menuItems,
        handleActiveItem,
        (isMoving) => onMovingChangeRef.current?.(isMoving),
        (sk) => sk.run(),
        scale,
      )
    } catch (err) {
      // WebGL2 unavailable (older browser / disabled). Leave the canvas blank —
      // the list view remains the accessible default.
      console.error('InfiniteMenu: failed to initialise WebGL2', err)
      return
    }

    const handleResize = () => sketch?.resize()
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      sketch?.dispose()
    }
  }, [items, scale])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas id="infinite-grid-menu-canvas" ref={canvasRef} />
    </div>
  )
}
