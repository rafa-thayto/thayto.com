import { OG_CONTENT_TYPE, OG_SIZE, postOgImage } from '@/utils/og/card'
import { resolveOgLocale } from '@/utils/og/copy'
import { getMdxSerializedPost } from '@/utils/mdx'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Rafael Thayto - Blog post'

type Props = { params: Promise<{ locale: string; slug: string }> }

export default async function Image({ params }: Props) {
  const { locale, slug } = await params
  const validLocale = resolveOgLocale(locale)
  const { frontMatter } = await getMdxSerializedPost(slug, validLocale)
  return postOgImage(validLocale, frontMatter.title, frontMatter.tags)
}
