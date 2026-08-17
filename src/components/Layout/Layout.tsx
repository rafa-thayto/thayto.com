'use client'

import { PropsWithChildren, useEffect } from 'react'
import { Footer } from '../'
import { OnlineBadge } from '../online-badge'
import { ThemePullCord } from '../theme-pull-cord'
import { cn } from '@/lib/utils'

type LayoutProps = PropsWithChildren<{
  // Pins the footer to the bottom of the viewport on pages too short to fill
  // it. Opt-in because a flex container stops child margins from collapsing,
  // which would change spacing on the content-heavy pages.
  stickyFooter?: boolean
}>

export const Layout = ({ children, stickyFooter = false }: LayoutProps) => {
  const setAppTheme = () => {
    const lightMode = localStorage.getItem('theme') === 'light'

    if (lightMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  const handleSystemThemeChange = () => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

    darkQuery.onchange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }

  useEffect(() => {
    setAppTheme()
    handleSystemThemeChange()
  }, [])

  return (
    <div
      className={cn(
        'min-h-screen overflow-x-hidden bg-slate-50 dark:bg-black',
        stickyFooter && 'flex flex-col',
      )}
    >
      <OnlineBadge />
      <ThemePullCord />
      {children}
      <Footer />
    </div>
  )
}
