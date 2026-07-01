'use client'

import { useEffect, useRef, useState } from 'react'
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
}

export default function InfiniteMenu({
  items = [],
  scale = 1.0,
}: InfiniteMenuProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeItem, setActiveItem] = useState<InfiniteMenuItem | null>(null)
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const menuItems = items.length ? items : defaultItems

    const handleActiveItem = (index: number) => {
      const itemIndex = index % menuItems.length
      setActiveItem(menuItems[itemIndex])
    }

    let sketch: InfiniteGridMenu | null = null
    try {
      sketch = new InfiniteGridMenu(
        canvas,
        menuItems,
        handleActiveItem,
        setIsMoving,
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

  const handleButtonClick = () => {
    if (!activeItem?.link) return
    if (activeItem.link.startsWith('http')) {
      window.open(activeItem.link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas id="infinite-grid-menu-canvas" ref={canvasRef} />

      {activeItem && (
        <>
          <h2
            className={`infinite-menu-face-title ${
              isMoving ? 'inactive' : 'active'
            }`}
          >
            {activeItem.title}
          </h2>

          <p
            className={`infinite-menu-face-description ${
              isMoving ? 'inactive' : 'active'
            }`}
          >
            {activeItem.description}
          </p>

          <button
            type="button"
            aria-label={
              activeItem.title
                ? `Open post: ${activeItem.title}`
                : 'Open item link'
            }
            onClick={handleButtonClick}
            className={`infinite-menu-action-button ${
              isMoving ? 'inactive' : 'active'
            }`}
          >
            <span
              className="infinite-menu-action-button-icon"
              aria-hidden="true"
            >
              &#x2197;
            </span>
          </button>
        </>
      )}
    </div>
  )
}
