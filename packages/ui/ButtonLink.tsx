import { FC } from 'react'

interface ButtonLinkProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {}

export const ButtonLink: FC<ButtonLinkProps> = ({ children, ...props }) => (
  <a
    className="p-2 ml-4 rounded border border-slate-900 hover:bg-yellow-50"
    {...props}
  >
    {children}
  </a>
)
