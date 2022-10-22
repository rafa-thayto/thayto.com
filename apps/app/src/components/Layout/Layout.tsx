import clsx from 'clsx'
import { PropsWithChildren, useEffect } from 'react'
import styles from './Layout.module.css'

type Variant = 'large' | 'small'

interface GradientBackgroundProps {
  variant: Variant
  className: string
}

export const GradientBackground = ({
  variant,
  className,
}: GradientBackgroundProps) => {
  const classes = clsx(
    {
      [styles.colorBackground]: variant === 'large',
      [styles.colorBackgroundBottom]: variant === 'small',
    },
    className,
  )

  return <div className={classes} />
}

export const Layout = ({ children }: PropsWithChildren) => {
  const setAppTheme = () => {
    const darkMode = localStorage.getItem('theme') === 'dark'
    const lightMode = localStorage.getItem('theme') === 'light'

    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else if (lightMode) {
      document.documentElement.classList.remove('dark')
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

  return <div className="relative pb-24 overflow-hidden">{children}</div>
}
