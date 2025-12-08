'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { locales } from '@/i18n/config'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { useParams } from 'next/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()

  const switchLocale = (newLocale: string) => {
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: newLocale },
    )
  }

  return (
    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 transition-all duration-300">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium
            transition-all duration-300 ease-in-out
            transform hover:scale-105 active:scale-95
            ${
              loc === locale
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm scale-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50'
            }
          `}
          aria-label={`Switch to ${loc === 'pt' ? 'Portuguese' : 'English'}`}
          aria-current={loc === locale ? 'true' : undefined}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
