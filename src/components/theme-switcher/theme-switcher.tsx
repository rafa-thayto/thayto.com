'use client'
/* eslint-disable */

import posthog from 'posthog-js'
import { useEffect, useState } from 'react'

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    className="transition-all duration-300"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
    />
  </svg>
)

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    className="transition-all duration-300"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79v0z"
    />
  </svg>
)

type ThemeSwitcherProps = {
  onThemeChange?: (theme: 'dark' | 'light') => void
}

export const ThemeSwitcher = ({ onThemeChange }: ThemeSwitcherProps) => {
  const [isDark, setIsDark] = useState<boolean | null>(null)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const initialIsDark = theme === 'dark' || (!theme && systemPrefersDark)
    setIsDark(initialIsDark)

    if (initialIsDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const theme = localStorage.getItem('theme')
        const systemPrefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches
        setIsDark(theme === 'dark' || (!theme && systemPrefersDark))
      }
    }

    const handleThemeChange = () => {
      const theme = localStorage.getItem('theme')
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
      setIsDark(theme === 'dark' || (!theme && systemPrefersDark))
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('themeChange', handleThemeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('themeChange', handleThemeChange)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'

    posthog.capture('switch-theme', {
      from: isDark ? 'dark-to-light' : 'light-to-dark',
    })

    setIsDark(!isDark)

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    localStorage.setItem('theme', newTheme)
    onThemeChange?.(newTheme)

    window.dispatchEvent(new Event('themeChange'))
  }

  // Render a placeholder during SSR/hydration to avoid mismatch
  if (isDark === null) {
    return (
      <div
        className="inline-flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-800"
        aria-hidden="true"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-800 transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out transform ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        } group-hover:scale-110`}
      >
        <div
          className={`transition-all duration-300 ${
            isDark ? 'text-blue-500' : 'text-orange-500'
          }`}
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </div>
      </div>

      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-20 ${
          isDark
            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
            : 'bg-gradient-to-r from-orange-400 to-yellow-400'
        }`}
      />
    </button>
  )
}
