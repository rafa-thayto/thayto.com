import { Metadata } from 'next'
import { SITE_URL } from '@/utils/constants'
import { Locale } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'
import { LinktreeContent } from './linktree-content'
import { TWITTER_CARD, profilePageSchema, JsonLd } from '@/utils/seo'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata.linktree' })
  const description = t('description')

  return {
    title: 'Rafael Thayto - Linktree',
    description,
    alternates: {
      canonical: `${SITE_URL}/linktree`,
      types: { 'text/markdown': `${SITE_URL}/linktree.md` },
    },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/linktree`,
      title: 'Rafael Thayto - Linktree',
      description,
      siteName: 'Thayto.com',
    },
    twitter: TWITTER_CARD,
  }
}

export default async function LinksPage({ params }: Props) {
  const { locale } = await params
  const validLocale = locale as Locale
  const t = await getTranslations({ locale, namespace: 'metadata.linktree' })

  const schema = profilePageSchema(validLocale, {
    path: '/linktree',
    name: 'Rafael Thayto - Linktree',
    description: t('description'),
    breadcrumbLabel: 'Linktree',
  })

  return (
    <>
      <JsonLd data={schema} />
      <LinktreeContent />
    </>
  )
}
