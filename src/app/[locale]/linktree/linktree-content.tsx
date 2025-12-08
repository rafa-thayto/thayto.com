'use client'

import { DevTo, Footer, GitHub, LinkedIn, TabNews, Twitter } from '@/components'
import { Bsky } from '@/components/Icons/Bsky'
import { Twitch } from '@/components/Icons/Twitch'
import { IconProps } from '@/components/Icons/types'
import { YouTube } from '@/components/Icons/YouTube'
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

const links: ButtonLink[] = [
  {
    href: 'https://hub.la/r/lista-espera',
    Icon: null,
    text: 'lista de espera | linkedin',
  },
  {
    href: 'https://discord.gg/JXxC4xTdDU',
    Icon: null,
    text: 'Discord - Tutorandus Community',
  },
  {
    href: 'https://higlobe.com?grsf=rafael-xnn88r',
    Icon: null,
    text: 'Higlobe - USD 20$ pra você e pra mim',
  },
  {
    href: 'https://github.com/rafa-thayto/lazy-thayto-vim',
    Icon: null,
    text: '❤️ Neovim Configs',
  },
  {
    href: 'https://thayto.substack.com/',
    Icon: null,
    text: 'Newsletter - First Time Founder',
  },
  {
    href: '/blog',
    Icon: null,
    text: 'Blog',
  },
  {
    href: 'https://www.linkedin.com/in/thayto/',
    Icon: LinkedIn,
    text: 'LinkedIn',
  },
  {
    href: 'https://www.youtube.com/@thayto_dev',
    Icon: YouTube,
    text: 'Youtube',
  },
  {
    href: 'https://podcasters.spotify.com/pod/show/devseniorscast',
    Icon: null,
    text: '🎙️ DevSenior Cast',
  },
  {
    href: 'https://github.com/rafa-thayto',
    Icon: GitHub,
    text: 'GitHub',
  },
  {
    href: 'https://www.instagram.com/thayto_dev/?utm_source=thayto.com',
    Icon: Instagram as any,
    text: 'Instagram',
  },
  {
    href: 'https://x.com/thayto_dev',
    Icon: Twitter,
    text: 'Twitter',
  },
  {
    href: 'https://bsky.app/profile/thayto.dev',
    Icon: Bsky,
    text: 'Bluesky',
  },
  {
    href: 'https://twitch.tv/thayto_dev',
    Icon: Twitch,
    text: 'Twitch',
  },
  {
    href: 'https://hotm.art/hnWXd89A',
    Icon: null,
    text: 'Formação TS',
  },
  {
    href: 'https://bit.ly/3nLnPQZ',
    Icon: null,
    text: 'CRUD com qualidade',
  },
  {
    href: 'https://www.amazon.com.br/dp/8575226932?&_encoding=UTF8&tag=thayto-20&linkCode=ur2&linkId=a8887fab2c901ae25fb1855a72f0bc61&camp=1789&creative=9325',
    Icon: null,
    text: 'Estrutura de dados e algoritmos com JavaScript - Loiane',
  },
  {
    href: 'https://dev.to/thayto/',
    Icon: DevTo,
    text: 'Dev.to',
  },
  {
    href: 'https://www.tabnews.com.br/thayto',
    Icon: TabNews,
    text: 'TabNews',
  },
]

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
