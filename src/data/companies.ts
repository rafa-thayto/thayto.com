export interface CompanyLink {
  name: string
  namePt?: string
  /** Clean entity name for JSON-LD, when the display name has decorations */
  schemaName?: string
  /** Current employer — emitted as worksFor instead of alumniOf in JSON-LD */
  current?: boolean
  /** ISO start date; wraps the worksFor entry in an OrganizationRole */
  startDate?: string
  url: string
}

export interface CompanyGroup {
  name: string
  offices: CompanyLink[]
}

export type CompanyEntry = CompanyLink | CompanyGroup

export const companies: CompanyEntry[] = [
  {
    name: 'BlindPay',
    url: 'https://blindpay.com/',
    current: true,
    startDate: '2026-08',
  },
  { name: 'Clerk', url: 'https://clerk.com' },
  { name: 'Nike', url: 'https://nike.com' },
  { name: 'Resend', url: 'https://resend.com' },
  { name: 'Outlit (YC W25)', schemaName: 'Outlit', url: 'https://outlit.ai' },
  { name: 'Flash', url: 'https://flashapp.com.br' },
  { name: '🦄 Creditas', schemaName: 'Creditas', url: 'https://creditas.com' },
  {
    name: 'Safra Bank',
    offices: [
      {
        name: 'NY',
        schemaName: 'Safra National Bank of New York',
        url: 'https://www.safra.com/',
      },
      {
        name: 'BR',
        schemaName: 'Banco Safra',
        url: 'https://www.safra.com.br/',
      },
      {
        name: 'Switzerland',
        namePt: 'Suíça',
        schemaName: 'J. Safra Sarasin',
        url: 'https://www.jsafrasarasin.com/',
      },
    ],
  },
  { name: 'Avanade', url: 'https://avanade.com' },
]

export function getCompanyLabel(company: CompanyLink, locale: string): string {
  return locale === 'pt' && company.namePt ? company.namePt : company.name
}
