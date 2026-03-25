import { SITE_URL } from './constants'
import { Locale } from '@/i18n/config'

// ─── Constants ──────────────────────────────────────────────────────────────

export const SCHEMA_CONTEXT = 'https://schema.org' as const

const LOCALE_MAP: Record<Locale, { language: string; ogLocale: string }> = {
  pt: { language: 'pt-BR', ogLocale: 'pt_BR' },
  en: { language: 'en-US', ogLocale: 'en_US' },
}

export const TWITTER_HANDLE = '@thayto_dev'

export const TWITTER_CARD = {
  card: 'summary_large_image' as const,
  site: TWITTER_HANDLE,
  creator: TWITTER_HANDLE,
}

export const SOCIAL_LINKS = [
  'https://github.com/rafa-thayto',
  'https://linkedin.com/in/thayto',
  'https://x.com/thayto_dev',
  'https://youtube.com/@thayto_dev',
  'https://dev.to/thayto',
  'https://medium.com/@thayto',
  'https://bsky.app/profile/thayto.dev',
  'https://www.tabnews.com.br/thayto',
  'https://thayto.substack.com',
  'https://www.instagram.com/thayto_dev',
  'https://www.twitch.tv/thayto_dev',
] as const

export const PROFILE_IMAGE = {
  '@type': 'ImageObject' as const,
  url: `${SITE_URL}/static/images/profile.jpg`,
  width: 460,
  height: 460,
}

// ─── Locale helpers ─────────────────────────────────────────────────────────

export const toLanguageTag = (locale: Locale) => LOCALE_MAP[locale].language

export const toOgLocale = (locale: Locale) => LOCALE_MAP[locale].ogLocale

export const toAlternateOgLocale = (locale: Locale) =>
  locale === 'pt' ? LOCALE_MAP.en.ogLocale : LOCALE_MAP.pt.ogLocale

export const toLocalePath = (locale: Locale, path: string) =>
  locale === 'pt' ? path : `/en${path}`

export const toCanonicalUrl = (locale: Locale, path: string) =>
  `${SITE_URL}${toLocalePath(locale, path)}`

export const alternateLanguages = (path: string) => ({
  pt: `${SITE_URL}${path}`,
  en: `${SITE_URL}/en${path}`,
})

// ─── Schema fragments ───────────────────────────────────────────────────────

export const PERSON_REF = { '@id': `${SITE_URL}/#person` } as const

export const personSummary = (locale: Locale) => ({
  '@type': 'Person' as const,
  '@id': `${SITE_URL}/#person`,
  name: 'Rafael Thayto',
  url: toCanonicalUrl(locale, '/about'),
  jobTitle: 'Senior Software Engineer',
  sameAs: [...SOCIAL_LINKS],
})

export const personPublisher = () => ({
  '@type': 'Person' as const,
  '@id': `${SITE_URL}/#person`,
  name: 'Rafael Thayto',
  logo: { ...PROFILE_IMAGE },
})

type BreadcrumbItem = {
  name: string
  path: string
}

export const breadcrumbSchema = (locale: Locale, items: BreadcrumbItem[]) => ({
  '@type': 'BreadcrumbList' as const,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    name: item.name,
    item: toCanonicalUrl(locale, item.path),
  })),
})

type ProfilePageOptions = {
  path: string
  name: string
  description?: string
  breadcrumbLabel: string
}

export const profilePageSchema = (
  locale: Locale,
  options: ProfilePageOptions,
) => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'ProfilePage' as const,
  '@id': toCanonicalUrl(locale, options.path),
  url: toCanonicalUrl(locale, options.path),
  name: options.name,
  ...(options.description && { description: options.description }),
  inLanguage: toLanguageTag(locale),
  mainEntity: {
    ...personSummary(locale),
    image: { ...PROFILE_IMAGE },
  },
  breadcrumb: breadcrumbSchema(locale, [
    { name: 'Home', path: '/' },
    { name: options.breadcrumbLabel, path: options.path },
  ]),
})

// ─── JSX helper ─────────────────────────────────────────────────────────────
// Note: This is safe because we only serialize our own schema objects via JSON.stringify.
// No user-supplied HTML is ever injected.

export const JsonLd = ({ data }: { data: Record<string, unknown> }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
)
