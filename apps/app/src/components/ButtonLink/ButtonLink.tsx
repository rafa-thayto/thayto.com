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
      'p-2 rounded border border-slate-900 hover:bg-yellow-50 bg-slate-50',
      className,
    )}
    {...props}
  >
    {children}
  </a>
)
