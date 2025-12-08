import { Layout } from '@/components'
import { getYearsOfProfessionalExperience } from '@/constants'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata.about' })
  const years = getYearsOfProfessionalExperience()
  const tAbout = await getTranslations({ locale, namespace: 'about.bio' })
  const description = `${tAbout('paragraph1', { years })} ${tAbout(
    'paragraph2',
  )}`

  const canonicalUrl =
    locale === 'pt' ? 'https://thayto.com/about' : 'https://thayto.com/en/about'

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        pt: 'https://thayto.com/about',
        en: 'https://thayto.com/en/about',
      },
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: t('title'),
      description: t('description'),
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      alternateLocale: locale === 'pt' ? 'en_US' : 'pt_BR',
      images: [
        {
          url: 'https://thayto.com/static/images/seo-card-default.png',
          type: 'image/png',
        },
      ],
      siteName: 'Thayto.com',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@thayto',
      creator: '@thayto',
    },
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  const years = getYearsOfProfessionalExperience()

  return (
    <Layout>
      <main className="max-w-6xl mx-auto shadow bg-slate-50 dark:bg-black  py-6 px-4 sm:px-12 mt-6">
        <h1 className="text-xl text-slate-900 dark:text-white font-bold mt-4">
          {t('title')}
        </h1>

        <div className="mt-6">
          <p className="text-base font-serif text-slate-800 dark:text-gray-100">
            {t('bio.paragraph1', { years })}
          </p>
          <p className="text-base font-serif text-slate-800 dark:text-gray-100 mt-2">
            {t('bio.paragraph2')}
          </p>
        </div>

        <p className="text-xl font-serif text-slate-800 dark:text-gray-100 mt-10">
          {t('bio.inProgress')}
        </p>

        <p className="text-base font-serif text-slate-800 dark:text-gray-100 mt-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione sit
          earum minima optio quisquam non! Quisquam aspernatur sit non
          necessitatibus quasi molestias tenetur neque. Ducimus molestiae quam
          consequatur cum iusto!
        </p>
      </main>
    </Layout>
  )
}
