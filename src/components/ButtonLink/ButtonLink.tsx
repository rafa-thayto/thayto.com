import clsx from 'clsx'
import { PropsWithChildren } from 'react'

type ButtonLinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export const ButtonLink = ({
  children,
  className,
  ...props
}: PropsWithChildren<ButtonLinkProps>) => (
  <a
    className={clsx(
      'p-2 rounded-md border transition border-slate-900 hover:bg-indigo-300 dark:hover:bg-indigo-500 bg-slate-50 dark:bg-gray-900',
      className,
    )}
    {...props}
  >
    {children}
  </a>
)
