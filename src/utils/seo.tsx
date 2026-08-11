import { SITE_URL } from './constants'
import { Locale } from '@/i18n/config'
import { companies, CompanyLink } from '@/data/companies'

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
  'https://www.tiktok.com/@thayto_dev',
  'https://www.tiktok.com/@thayto_perfumes',
  'https://creators.spotify.com/pod/profile/devseniorscast/',
  'https://www.npmjs.com/~rafa-thayto',
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
  // x-default tells search engines which URL to serve when no locale matches;
  // it points at the default locale (pt), mirroring the sitemap's alternates.
  'x-default': `${SITE_URL}${path}`,
  pt: `${SITE_URL}${path}`,
  en: `${SITE_URL}/en${path}`,
})

// ─── Schema fragments ───────────────────────────────────────────────────────

export const PERSON_REF = { '@id': `${SITE_URL}/#person` } as const

const companyLinks = companies.flatMap((entry) =>
  'offices' in entry ? entry.offices : [entry],
)

const toOrganization = (company: CompanyLink) => ({
  '@type': 'Organization' as const,
  '@id': company.url,
  name: company.schemaName ?? company.name,
  url: company.url,
})

// Not-yet-started or dated roles use the schema.org Role pattern:
// Person.worksFor -> OrganizationRole (with startDate) -> worksFor -> Organization
export const WORKS_FOR_ORGANIZATIONS = companyLinks
  .filter((company) => company.current)
  .map((company) =>
    company.startDate
      ? {
          '@type': 'OrganizationRole' as const,
          worksFor: toOrganization(company),
          startDate: company.startDate,
        }
      : toOrganization(company),
  )

export const ALUMNI_ORGANIZATIONS = companyLinks
  .filter((company) => !company.current)
  .map(toOrganization)

export const personSummary = (locale: Locale) => ({
  '@type': 'Person' as const,
  '@id': `${SITE_URL}/#person`,
  name: 'Rafael Thayto',
  url: toCanonicalUrl(locale, '/about'),
  jobTitle: 'Senior Software Engineer',
  sameAs: [...SOCIAL_LINKS],
})

// Publisher must be an Organization: `logo` is not a valid Person property,
// and the site already declares this Organization on the home page.
export const organizationPublisher = () => ({
  '@type': 'Organization' as const,
  '@id': `${SITE_URL}/#organization`,
  name: 'Rafael Thayto',
  url: SITE_URL,
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
  isPartOf: { '@id': `${SITE_URL}/#website` },
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
