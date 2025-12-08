'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon, EyeIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { posthog } from 'posthog-js'

interface MDXImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  title?: string
}

export const MDXImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  title,
}: MDXImageProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const isExternalImage =
    src.startsWith('http://') || src.startsWith('https://')
  const isLocalImage = src.startsWith('/static/images/')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen])

  const openFullscreen = () => {
    setIsFullscreen(true)
    posthog.capture('mdx-image-fullscreen-open', {
      src,
      alt,
      isExternal: isExternalImage,
      isLocal: isLocalImage,
    })
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
    posthog.capture('mdx-image-fullscreen-close', {
      src,
      alt,
      isExternal: isExternalImage,
      isLocal: isLocalImage,
    })
  }

  const fullscreenModal = (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeFullscreen}
    >
      <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
        <button
          onClick={closeFullscreen}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 backdrop-blur-sm"
          aria-label="Fechar imagem em tela cheia"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div
          className="relative w-full h-full max-w-none max-h-none"
          onClick={(e) => e.stopPropagation()}
        >
          {isExternalImage ? (
            <img src={src} alt={alt} className="w-full h-full object-contain" />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
              priority
            />
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="inline-block bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <p className="text-sm font-medium">{title || alt}</p>
            <p className="text-xs text-gray-300 mt-1">
              Pressione ESC ou clique fora da imagem para fechar
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <span
        className={`relative block cursor-pointer group transition-transform duration-300 hover:scale-[1.02] rounded-lg overflow-hidden ${className}`}
        onClick={openFullscreen}
      >
        {isExternalImage ? (
          <img
            src={src}
            alt={alt}
            width={width || 800}
            height={height || 600}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width || 800}
            height={height || 600}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        )}

        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3">
            <EyeIcon className="h-6 w-6 text-gray-900 dark:text-white" />
          </span>
        </span>
      </span>

      {isFullscreen && mounted && createPortal(fullscreenModal, document.body)}
    </>
  )
}
