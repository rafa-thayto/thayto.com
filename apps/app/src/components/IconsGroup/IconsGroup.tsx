import { ButtonLink } from '@src/components'
import { TabNews, Medium, LinkedIn, DevTo, GitHub } from '@src/components/Icons'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

export const IconsGroup = ({
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
  <div className="flex" {...props}>
    <ButtonLink href="https://www.linkedin.com/in/thayto/">
      <LinkedIn />
    </ButtonLink>
    <ButtonLink href="https://github.com/rafa-thayto">
      <GitHub />
    </ButtonLink>
    <ButtonLink href="https://dev.to/thayto/">
      <DevTo />
    </ButtonLink>
    <ButtonLink href="https://www.tabnews.com.br/thayto">
      <TabNews />
    </ButtonLink>
    <ButtonLink href="https://medium.com/@thayto">
      <Medium />
    </ButtonLink>
  </div>
)
