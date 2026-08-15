import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from '@/utils/og/card'
import { resolveOgLocale } from '@/utils/og/copy'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Rafael Thayto - About'

type Props = { params: Promise<{ locale: string }> }

export default async function Image({ params }: Props) {
  const { locale } = await params
  return pageOgImage('about', resolveOgLocale(locale))
}
