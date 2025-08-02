'use client'

import { motion, type MotionProps } from 'motion/react'
import * as Slot from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

type Variant = {
  variant: string
  component: React.FC<React.ComponentProps<'span'> & Partial<MotionProps>>
}

const variants = [
  {
    variant: 'hover-decoration',
    component: ({ children, className, ...props }) => (
      <div
        className={cn(
          'relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right',
          'after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100',
        )}
      >
        <span {...props} className={cn(className)}>
          {children}
        </span>
      </div>
    ),
  },
] as const satisfies readonly Variant[]

export type TextProps = {
  variant?: typeof variants[number]['variant']
} & React.ComponentProps<'span'> &
  Partial<MotionProps>

export function Text({
  variant = 'hover-decoration',
  className,
  ...props
}: TextProps) {
  const FALLBACK_INDEX = 0

  const variantComponent = variants.find(
    (v) => v.variant === variant,
  )?.component

  const Component = variantComponent || variants[FALLBACK_INDEX].component

  return (
    <Slot.Root className={cn('font-medium text-sm')}>
      <Component {...props} className={className} />
    </Slot.Root>
  )
}
