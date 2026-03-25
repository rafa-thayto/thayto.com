import { Metadata } from 'next'
import { SITE_URL } from '@/utils/constants'
import { Locale } from '@/i18n/config'
import { LinktreeContent } from './linktree-content'
import { TWITTER_CARD, profilePageSchema, JsonLd } from '@/utils/seo'

const description = 'Minha árvore de links'

type Props = {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Rafael Thayto - Linktree',
  description,
  alternates: {
    canonical: `${SITE_URL}/linktree`,
    types: { 'text/markdown': `${SITE_URL}/linktree` },
  },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}/linktree`,
    title: 'Rafael Thayto - Linktree',
    description,
    images: [
      {
        url: `${SITE_URL}/static/images/seo-card-linktree.png`,
        type: 'image/png',
      },
    ],
    siteName: 'Thayto.com',
  },
  twitter: TWITTER_CARD,
}

export default async function LinksPage({ params }: Props) {
  const { locale } = await params
  const validLocale = locale as Locale

  const schema = profilePageSchema(validLocale, {
    path: '/linktree',
    name: 'Rafael Thayto - Linktree',
    description,
    breadcrumbLabel: 'Linktree',
  })

  return (
    <>
      <JsonLd data={schema} />
      <LinktreeContent />
    </>
  )
}
