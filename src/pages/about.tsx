import { Layout } from '@src/components'
import { NextSeo } from 'next-seo'

const AboutPage = () => {
  const description = `Thayto é um desenvolvedor com mais de 3 anos de experiência, apaixonado em aprender novas tecnologia e boas práticas para desenvolvimento, apesar da pouca idade ele já passou por diversos projetos onde deu seu melhor e conseguiu efetuar todas as entregas. Ele não pode ver um framework novo ou lib nova que já quer implementar, porém hoje em dia tem muito mais pé no chão e avalia os riscos de tal implementação.

  Ele gosta bastante de jogar, conhecer pessoas e lugares novos. Posso ter certeza que se conversar com ele, em poucos minutos já terão criado um conexão.`
  return (
    <Layout>
      <NextSeo
        title="Rafael Thayto - About"
        description={description}
        canonical="https://thayto.com/about"
        openGraph={{
          type: 'article',
          url: 'https://thayto.com/about',
          title: 'Sobre mim',
          description,
          images: [
            {
              url: 'https://thayto.com/static/images/profile.jpg',
              width: 460,
              height: 460,
              alt: 'Rafael Thayto Profile Picture',
              type: 'image/jpeg',
            },
          ],
          site_name: 'Thayto',
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: '@thayto',
          handle: '@thayto',
        }}
      />

      <main className="max-w-6xl mx-auto shadow bg-slate-50 dark:bg-gray-800  py-6 px-4 sm:px-12 mt-6">
        <h1 className="text-xl text-slate-900 dark:text-white font-bold mt-4">
          Sobre mim
        </h1>

        <div className="mt-6">
          <p className="text-base font-serif text-slate-800 dark:text-slate-200">
            Thayto é um desenvolvedor com mais de 3 anos de experiência,
            apaixonado em aprender novas tecnologia e boas práticas para
            desenvolvimento, apesar da pouca idade ele já passou por diversos
            projetos onde deu seu melhor e conseguiu efetuar todas as entregas.
            Ele não pode ver um framework novo ou lib nova que já quer
            implementar, porém sempre e avalia os riscos antes de tal
            implementação.
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

export default AboutPage
