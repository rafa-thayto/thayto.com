import Link, { LinkProps } from 'next/link'
import { UrlObject } from 'url'

type Url = string | UrlObject

interface CustomLinkProps
  extends React.DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    React.ForwardRefExoticComponent<
      Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
        LinkProps & {
          children?: React.ReactNode
        } & React.RefAttributes<HTMLAnchorElement>
    > {
  as?: Url
}

export const CustomLink = ({
  as,
  href,
  ref: _,
  ...otherProps
}: CustomLinkProps) => {
  return <Link as={as} href={href} {...otherProps} />
}
