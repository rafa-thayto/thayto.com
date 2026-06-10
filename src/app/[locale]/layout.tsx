import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
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

  // Reject unknown locales, then opt this segment into static rendering:
  // setRequestLocale lets next-intl resolve the locale from the route param at
  // build time instead of reading request headers (which forces dynamic).
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

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
