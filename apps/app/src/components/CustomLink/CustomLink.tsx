import Link from 'next/link'
import { UrlObject } from 'url'

type Url = string | UrlObject

interface CustomLinkProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  as?: Url
}

export const CustomLink = ({ as, href, ...otherProps }: CustomLinkProps) => {
  return (
    <Link as={as} href={href}>
      <a {...otherProps} />
    </Link>
  )
}
