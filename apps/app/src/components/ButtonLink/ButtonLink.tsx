import { PropsWithChildren } from 'react'

type ButtonLinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export const ButtonLink = ({
  children,
  ...props
}: PropsWithChildren<ButtonLinkProps>) => (
  <a
    className="p-2 ml-4 rounded border border-slate-900 hover:bg-yellow-50"
    {...props}
  >
    {children}
  </a>
)
