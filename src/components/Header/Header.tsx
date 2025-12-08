'use client'

import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { nanoid } from 'nanoid'
import Link from 'next/link'
import { Fragment, useState, useEffect } from 'react'
import ReactConfetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { ThemeSwitcher } from '../theme-switcher/theme-switcher'
import { LanguageSwitcher } from '../language-switcher'
import { useLocale } from 'next-intl'

export const Header = () => {
  const navbarId = nanoid()
  const menuId = nanoid()
  const locale = useLocale()

  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const basePath = locale === 'pt' ? '' : '/en'
  const navigation = [
    {
      name: ';)',
      href: '#',
      onClick: () => {
        setShowConfetti(true)
      },
    },
    { name: 'Home', href: basePath || '/' },
    { name: 'Blog', href: `${basePath}/blog` },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Liquid glass mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const header = document.querySelector('.liquid-glass-container')
      if (header) {
        const rect = header.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMousePosition({
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y)),
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={width - 16}
          height={height - 16}
          recycle={false}
          numberOfPieces={800}
          tweenDuration={15000}
          gravity={0.15}
          onConfettiComplete={() => {
            setShowConfetti(false)
          }}
        />
      )}
      <Popover>
        <div
          className={`liquid-glass-container fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
            isScrolled
              ? 'py-1 px-4 sm:px-6 lg:px-8'
              : 'py-2 px-4 sm:px-6 lg:px-8'
          }`}
        >
          <div
            className={`relative mx-auto rounded-3xl transition-all duration-700 ease-out overflow-hidden ${
              isScrolled ? 'max-w-3xl' : 'max-w-4xl'
            }`}
            style={
              {
                backdropFilter: 'blur(30px) saturate(200%)',
                WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                background: `
                radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                  rgba(255, 255, 255, 0.25) 0%, 
                  rgba(255, 255, 255, 0.1) 50%, 
                  rgba(255, 255, 255, 0.05) 100%
                )
              `,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                inset 0 -1px 0 rgba(255, 255, 255, 0.1)
              `,
                '--mouse-x': `${mousePosition.x}%`,
                '--mouse-y': `${mousePosition.y}%`,
              } as React.CSSProperties
            }
          >
            {/* Liquid Glass Background Blobs */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {/* Primary flowing blob */}
              <div
                className="absolute w-96 h-96 rounded-full opacity-30"
                style={{
                  background: `
                    radial-gradient(circle, 
                      rgba(168, 85, 247, 0.4) 0%, 
                      rgba(59, 130, 246, 0.3) 50%, 
                      transparent 100%
                    )
                  `,
                  transform: `translate(${-150 + mousePosition.x * 2}px, ${
                    -150 + mousePosition.y * 1.5
                  }px)`,
                  transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.320, 1)',
                  animation: 'liquidBlob1 12s ease-in-out infinite',
                  filter: 'blur(40px)',
                }}
              />

              {/* Secondary flowing blob */}
              <div
                className="absolute w-80 h-80 rounded-full opacity-25"
                style={{
                  background: `
                    radial-gradient(circle, 
                      rgba(236, 72, 153, 0.4) 0%, 
                      rgba(139, 69, 19, 0.3) 50%, 
                      transparent 100%
                    )
                  `,
                  transform: `translate(${100 - mousePosition.x * 1.5}px, ${
                    -100 + mousePosition.y * 2
                  }px)`,
                  transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)',
                  animation: 'liquidBlob2 15s ease-in-out infinite reverse',
                  filter: 'blur(35px)',
                  right: 0,
                  top: 0,
                }}
              />

              {/* Tertiary accent blob */}
              <div
                className="absolute w-64 h-64 rounded-full opacity-20"
                style={{
                  background: `
                    radial-gradient(circle, 
                      rgba(34, 197, 94, 0.4) 0%, 
                      rgba(59, 130, 246, 0.3) 50%, 
                      transparent 100%
                    )
                  `,
                  transform: `translate(${mousePosition.x * 1.2}px, ${
                    50 + mousePosition.y * 0.8
                  }px)`,
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.320, 1)',
                  animation: 'liquidBlob3 18s ease-in-out infinite',
                  filter: 'blur(30px)',
                  bottom: 0,
                  left: '50%',
                  marginLeft: '-128px',
                }}
              />
            </div>

            {/* Glass Refraction Layer */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.3) 0%, 
                    transparent 50%, 
                    rgba(255, 255, 255, 0.1) 100%
                  )
                `,
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
              }}
            />

            {/* Content Layer */}
            <div
              className={`relative flex items-center justify-between transition-all duration-500 ease-out ${
                isScrolled ? 'px-4 py-1.5' : 'px-6 py-2.5'
              }`}
            >
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-3 group">
                  <span
                    className={`font-bold text-gray-900 dark:text-white transition-all duration-500 ease-out ${
                      isScrolled ? 'text-lg' : 'text-xl'
                    }`}
                  >
                    Rafael Thayto
                  </span>
                </Link>
              </div>

              <nav className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={`${item.name}-${navbarId}`}
                    href={item.href}
                    onClick={item.onClick}
                    className={`font-medium text-gray-700/90 dark:text-gray-200/90 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:scale-105 relative group ${
                      isScrolled ? 'text-xs' : 'text-sm'
                    }`}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 dark:bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-3">
                <div
                  className={`transition-all duration-500 ease-out ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}
                >
                  <LanguageSwitcher />
                </div>
                <div
                  className={`transition-all duration-500 ease-out ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}
                >
                  <ThemeSwitcher />
                </div>

                <div className="md:hidden">
                  <Popover.Button
                    className={`inline-flex items-center justify-center rounded-xl text-gray-600/80 dark:text-gray-300/80 hover:bg-white/30 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 backdrop-blur-sm ${
                      isScrolled ? 'p-1.5' : 'p-2'
                    }`}
                  >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon
                      className={`transition-all duration-300 ${
                        isScrolled ? 'h-4 w-4' : 'h-5 w-5'
                      }`}
                      aria-hidden="true"
                    />
                  </Popover.Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-out ${
            isScrolled ? 'h-12' : 'h-16'
          }`}
        />

        <Transition
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0 scale-95 translate-y-[-10px]"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-[-10px]"
        >
          <Popover.Panel
            focus
            className="fixed z-50 top-0 inset-x-0 p-4 transition transform origin-top md:hidden"
          >
            <div
              className="max-w-sm mx-auto rounded-2xl bg-white/80 dark:bg-black/70 ring-1 ring-white/20 dark:ring-white/10 overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 border border-white/30 dark:border-white/15 backdrop-blur-lg"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent pointer-events-none" />

              <div className="relative px-6 pt-6 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Rafael Thayto
                  </span>
                </div>
                <div>
                  <Popover.Button className="bg-white/50 dark:bg-white/10 rounded-xl p-2 inline-flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 backdrop-blur-sm">
                    <span className="sr-only">Close main menu</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>

              <div className="relative px-4 pt-4 pb-6 space-y-1">
                {navigation.map((item) => (
                  <Popover.Button
                    as={Link}
                    key={`${item.name}-${menuId}`}
                    href={item.href}
                    onClick={item.onClick}
                    className="block w-full px-4 py-3 rounded-xl text-left font-medium text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-300 backdrop-blur-sm"
                  >
                    {item.name}
                  </Popover.Button>
                ))}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  )
}
