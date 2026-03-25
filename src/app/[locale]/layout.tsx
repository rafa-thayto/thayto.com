import { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/utils/constants'
import { SCHEMA_CONTEXT, JsonLd } from '@/utils/seo'

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  const messages = await getMessages()

  const websiteSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite' as const,
    '@id': `${SITE_URL}/#website`,
    name: 'Rafael Thayto',
    url: SITE_URL,
    inLanguage: ['pt-BR', 'en-US'],
    potentialAction: {
      '@type': 'SearchAction' as const,
      target: `${SITE_URL}/blog?tags={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <JsonLd data={websiteSchema} />
      {children}
    </NextIntlClientProvider>
  )
}
