import { OG_CONTENT_TYPE, OG_SIZE, noteOgImage } from '@/utils/og/card'
import { resolveOgLocale } from '@/utils/og/copy'
import { getNote, parseNoteNumber } from '@/utils/notes'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Rafael Thayto - Note'

type Props = { params: Promise<{ locale: string; number: string }> }

export default async function Image({ params }: Props) {
  const { locale, number } = await params
  const validLocale = resolveOgLocale(locale)
  const parsed = parseNoteNumber(number)
  const note = parsed === null ? null : getNote(validLocale, parsed)
  return noteOgImage(validLocale, parsed ?? 0, note?.description ?? '')
}
