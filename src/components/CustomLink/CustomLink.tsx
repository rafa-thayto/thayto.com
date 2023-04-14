import Link from 'next/link'
import { UrlObject } from 'url'

type Url = string | UrlObject

type NextLinkProps = React.ComponentPropsWithRef<typeof Link>

interface CustomLinkProps extends NextLinkProps {
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
