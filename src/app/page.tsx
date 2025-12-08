import { Layout } from '@/components'
import { Metadata } from 'next'
import { getPosts } from '@/utils/mdx'
import { getYearsOfProfessionalExperience } from '@/constants'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { HomeContent } from './home-content'

const description = `Oi, sou o Rafael Thayto, prazer! :)

Atualmente tenho mais de ${getYearsOfProfessionalExperience()} anos de experiência
como desenvolvedor. Desde o inicio da minha carreira lá em 2018 (quando comecei à
atuar profissionalmente) sempre trabalhei com sistemas distribuídos, microsserviços,
microfrontends e observabilidade. Já trabalhei em grandes empresas com milhões de usuarios ativos,
empresas no Brasil, EUA e Suiça.

Aqui vocês vão encontrar alguns posts sobre tecnologia e alguns
pensamentos (tanto em inglês quanto em português).`

const blogPostingStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://thayto.com',
  url: 'https://thayto.com',
  name: 'Rafael Thayto - Home',
  description: description,
  inLanguage: 'pt-BR',
  author: {
    '@type': 'Person',
    name: 'Rafael Thayto',
    url: 'https://thayto.com',
    jobTitle: 'Senior Software Engineer',
    description: description,
  },
  image: {
    '@type': 'ImageObject',
    url: 'https://thayto.com/static/images/profile.jpg',
    width: 460,
    height: 460,
    caption: 'Rafael Thayto Profile Picture',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://thayto.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://thayto.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'LinkTree',
        item: 'https://thayto.com/linktree',
      },
    ],
  },
}

export const metadata: Metadata = {
  title: 'Rafael Thayto - Home',
  description,
  alternates: {
    canonical: 'https://thayto.com/',
  },
  openGraph: {
    type: 'article',
    url: 'https://thayto.com/',
    title: 'Rafael Thayto - Home',
    description,
    images: [
      {
        url: 'https://thayto.com/static/images/seo-card-home.png',
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

export default async function IndexPage() {
  const posts = getPosts()

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingStructuredData),
        }}
      />

      <main className="max-w-4xl mx-auto mt-6 bg-neutral-50 dark:bg-black py-6 px-4 sm:px-24">
        <HomeContent posts={posts} />
      </main>
    </Layout>
  )
}
