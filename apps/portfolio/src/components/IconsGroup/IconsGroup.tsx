import { ButtonLink } from '@thayto/ui'
import { TabNews, Medium, LinkedIn, DevTo, GitHub } from '@src/components/Icons'

export const IconsGroup = () => (
  <div className="flex">
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
