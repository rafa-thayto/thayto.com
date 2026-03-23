'use client'

import { useSyncExternalStore } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const noop = () => () => {}
const getSnapshot = () => localStorage.getItem('__clerk_environment') !== null
const getServerSnapshot = () => false

export function OnlineBadge() {
  const isVisible = useSyncExternalStore(noop, getSnapshot, getServerSnapshot)

  if (!isVisible) return null

  return (
    <div className="fixed top-3 right-3 z-50">
      <Badge
        className={cn(
          'rounded-full px-3 py-1.5 gap-2',
          'bg-emerald-100 dark:bg-emerald-950/60',
          'border-emerald-200 dark:border-emerald-800/50',
          'text-emerald-700 dark:text-emerald-300',
          'text-xs font-medium tracking-wide',
          'shadow-sm hover:shadow-md',
          'transition-shadow duration-300',
          'select-none cursor-default',
        )}
      >
        online
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-[pulse-ring_1.5s_ease-in-out_infinite] rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
        </span>
      </Badge>
    </div>
  )
}
