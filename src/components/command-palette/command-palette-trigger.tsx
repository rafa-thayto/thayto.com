'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { OPEN_COMMAND_PALETTE_EVENT } from './command-palette'

export const CommandPaletteTrigger = () => {
  const t = useTranslations('commandPalette')
  // Lazy init: navigator only exists on the client; SSR falls back to ⌘K and
  // suppressHydrationWarning below absorbs the mismatch on non-Mac clients.
  const [isMac] = useState(
    () =>
      typeof navigator === 'undefined' ||
      /Mac|iP(hone|ad|od)/i.test(navigator.userAgent),
  )

  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT))
      }
      className="group inline-flex items-center gap-1.5 rounded-xl p-2 text-gray-600/80 transition-all duration-300 hover:bg-white/30 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-gray-300/80 dark:hover:bg-white/10 dark:hover:text-white"
      aria-label={t('openLabel')}
    >
      <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
      <kbd
        className="hidden rounded border border-gray-300/60 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:border-gray-600/60 dark:text-gray-400 md:inline-block"
        aria-hidden="true"
        suppressHydrationWarning
      >
        {isMac ? '⌘K' : 'Ctrl K'}
      </kbd>
    </button>
  )
}
