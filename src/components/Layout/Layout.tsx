'use client'

import { PropsWithChildren, useEffect } from 'react'
import { Footer, Header } from '../'

export const Layout = ({ children }: PropsWithChildren) => {
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
    <div className="min-h-screen overflow-x-hidden bg-slate-50 dark:bg-black">
      {/* <Header /> */}
      {children}
      <Footer />
    </div>
  )
}
