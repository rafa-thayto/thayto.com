'use client'

import { DevTo, Footer, GitHub, LinkedIn, TabNews, Twitter } from '@/components'
import { Bsky } from '@/components/Icons/Bsky'
import { Twitch } from '@/components/Icons/Twitch'
import { IconProps } from '@/components/Icons/types'
import { YouTube } from '@/components/Icons/YouTube'
import { linktreeLinks } from '@/data/linktree-links'
import { Instagram, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import posthog from 'posthog-js'
import React, { useState, useEffect, useRef } from 'react'
import Confetti from 'react-confetti'

type ButtonLink = {
  href: string
  Icon?: (({ color }: IconProps) => React.JSX.Element) | null
  text: string
}

const iconMap: Record<
  string,
  (({ color }: IconProps) => React.JSX.Element) | null
> = {
  LinkedIn,
  Youtube: YouTube,
  GitHub,
  Instagram: Instagram as any,
  Twitter,
  Bluesky: Bsky,
  Twitch,
  'Dev.to': DevTo,
  TabNews,
}

const links: ButtonLink[] = linktreeLinks.map((link) => ({
  href: link.href,
  text: link.text,
  Icon: iconMap[link.text] ?? null,
}))

export function LinktreeContent() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [showAnimation, setShowAnimation] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleThemeChange = (theme: 'dark' | 'light') => {
    setTheme(theme)
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    timeoutRef.current = setTimeout(() => {
      setShowAnimation(true)
      handlePhotoClick()
    }, 500)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setShowAnimation(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handlePhotoClick = () => {
    setShowConfetti(true)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="mx-0 pt-4 bg-slate-50 dark:bg-black">
      <div className="px-8">
        <header className="mb-6 mx-auto">
          <div className="flex items-center justify-center flex-col sm:flex-row mb-4">
            <div
              className="relative w-32 h-32 cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handlePhotoClick}
            >
              <div
                className={`absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full blur-sm transition-all duration-500 ${
                  showAnimation ? 'opacity-75 animate-spin' : 'opacity-0'
                }`}
              ></div>
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 rounded-full transition-all duration-500 ${
                  showAnimation ? 'opacity-100 animate-spin' : 'opacity-0'
                }`}
              ></div>

              {isHovering && !showAnimation && (
                <div className="absolute -inset-2 rounded-full !border-2 !border-blue-500 !animate-pulse !opacity-60"></div>
              )}

              <div className="relative w-full h-full bg-slate-50 dark:bg-black rounded-full p-0.5">
                <Image
                  src="/static/images/profile.jpg"
                  alt="Thayto's profile picture"
                  fill
                  priority
                  className={`rounded-full object-cover transition-transform duration-300 ${
                    isHovering ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            </div>
            <div className="sm:ml-6 mt-4 sm:mt-0 flex justify-center flex-col">
              <h1 className="text-2xl text-slate-900 dark:text-white font-bold text-center sm:text-left">
                Rafael Thayto Tani
              </h1>
              <p className="text-md text-slate-900 dark:text-white text-center sm:text-left">
                Senior Software Engineer 🇺🇸
              </p>
            </div>
          </div>
        </header>
        <main className="max-w-2xl mx-auto mb-10">
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden border-solid">
            {links.map(({ Icon, href, text }, index) => (
              <Link
                key={text}
                href={href}
                className="group flex items-center justify-between py-4 px-4 bg-white dark:bg-gray-900 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-950"
                style={{
                  borderBottom:
                    index !== links.length - 1 ? '1px solid #d1d5db' : 'none',
                }}
                onClick={() => {
                  posthog.capture('linktree-button-clicked', {
                    href,
                    title: text,
                  })
                }}
              >
                <div className="flex items-center">
                  {Icon && (
                    <div className="w-6 h-6 flex-shrink-0 mr-3 flex items-center justify-center">
                      <Icon color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200">
                    {text}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200" />
              </Link>
            ))}
          </div>
        </main>
      </div>
      <Footer onThemeChange={handleThemeChange} />
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 200}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          onConfettiComplete={() => {
            setShowConfetti(false)
          }}
          colors={[
            '#3B82F6',
            '#60A5FA',
            '#93C5FD',
            '#DBEAFE',
            '#1D4ED8',
            '#2563EB',
          ]}
        />
      )}
    </div>
  )
}
