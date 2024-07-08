import { ButtonLink } from '@/components'
import { DevTo, GitHub, LinkedIn, Medium, TabNews } from '@/components/Icons'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

export const IconsGroup = ({
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
  <div className="flex" {...props}>
    <ButtonLink href="https://www.linkedin.com/in/thayto/">
      <LinkedIn />
    </ButtonLink>
    <ButtonLink className="ml-4" href="https://github.com/rafa-thayto">
      <GitHub />
    </ButtonLink>
    <ButtonLink className="ml-4" href="https://dev.to/thayto/">
      <DevTo />
    </ButtonLink>
    <ButtonLink className="ml-4" href="https://www.tabnews.com.br/thayto">
      <TabNews />
    </ButtonLink>
    <ButtonLink className="ml-4" href="https://medium.com/@thayto">
      <Medium />
    </ButtonLink>
  </div>
)
