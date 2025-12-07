import { Layout } from '@/components'
import { getYearsOfProfessionalExperience } from '@/constants'
import { Metadata } from 'next'

const description = `Desenvolvedor com mais de ${getYearsOfProfessionalExperience()} anos de experiência, apaixonado por resolver problemas e aprender novas tecnologias e boas práticas de desenvolvimento. Atuei em diversos projetos, sempre me dedicando ao máximo para garantir a entrega de soluções eficientes e de alta qualidade.

  Ele gosta bastante de jogar, conhecer pessoas e lugares novos. Posso ter certeza que se conversar com ele, em poucos minutos já terão criado um conexão.`

export const metadata: Metadata = {
  title: 'Rafael Thayto - About',
  description,
  alternates: {
    canonical: 'https://thayto.com/about',
  },
  openGraph: {
    type: 'article',
    url: 'https://thayto.com/about',
    title: 'Sobre mim',
    description,
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

export default function AboutPage() {
  return (
    <Layout>
      <main className="max-w-6xl mx-auto shadow bg-slate-50 dark:bg-gray-800  py-6 px-4 sm:px-12 mt-6">
        <h1 className="text-xl text-slate-900 dark:text-white font-bold mt-4">
          Sobre mim
        </h1>

        <div className="mt-6">
          <p className="text-base font-serif text-slate-800 dark:text-slate-200">
            Rafael Thayto é um desenvolvedor com mais de{' '}
            {getYearsOfProfessionalExperience()} anos de experiência, apaixonado
            por resolver problemas e aprender novas tecnologias e boas práticas
            de desenvolvimento. Atuei em diversos projetos, sempre me dedicando
            ao máximo para garantir a entrega de soluções eficientes e de alta
            qualidade.
          </p>
          <p className="text-base font-serif text-slate-800 dark:text-slate-200 mt-2">
            Ele gosta bastante de jogar, conhecer pessoas e lugares novos. Posso
            ter certeza que se conversar com ele, em poucos minutos já terão
            criado um conexão.
          </p>
        </div>

        <p className="text-xl font-serif text-slate-800 dark:text-slate-200 mt-10">
          In progress... 🧱
        </p>

        <p className="text-base font-serif text-slate-800 dark:text-slate-200 mt-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione sit
          earum minima optio quisquam non! Quisquam aspernatur sit non
          necessitatibus quasi molestias tenetur neque. Ducimus molestiae quam
          consequatur cum iusto!
        </p>
      </main>
    </Layout>
  )
}
