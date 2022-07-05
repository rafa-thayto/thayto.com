import { ButtonLink } from '@thayto/ui'
import { DevTo } from '../icons/DevTo'
import { GitHub } from '../icons/GitHub'
import { LinkedIn } from '../icons/LinkedIn'
import { Medium } from '../icons/Medium'
import { TabNews } from '../icons/TabNews'

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
