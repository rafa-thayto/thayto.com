import Link from 'next/link'

type NextLinkProps = React.ComponentPropsWithRef<typeof Link>

interface CustomLinkProps extends NextLinkProps { }

export const CustomLink = ({
  as,
  href,
  ref: _,
  ...otherProps
}: CustomLinkProps) => {
  return <Link as={as} href={href} {...otherProps} />
}
