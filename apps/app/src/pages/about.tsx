import { Footer, Header } from '@src/components'
import { NextSeo } from 'next-seo'

const AboutPage = () => {
  const description = `Thayto é um desenvolvedor com mais de 3 anos de experiência, apaixonado em aprender novas tecnologia e boas práticas para desenvolvimento, apesar da pouca idade ele já passou por diversos projetos onde deu seu melhor e conseguiu efetuar todas as entregas. Ele não pode ver um framework novo ou lib nova que já quer implementar, porém hoje em dia tem muito mais pé no chão e avalia os riscos de tal implementação.

  Ele gosta bastante de jogar, conhecer pessoas e lugares novos. Posso ter certeza que se conversar com ele, em poucos minutos já terão criado um conexão.`
  return (
    <div className="bg-gray-100">
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
              url: 'https://thayto.com/static/images/profile.jpeg',
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
      <Header />

      <main className="container max-w-6xl border bg-slate-50 py-6 px-4 sm:px-12 mt-6">
        <h1 className="text-xl text-slate-900 font-bold mt-4">Sobre mim</h1>
        <div className="mt-6">
          <p className="text-base font-serif text-slate-800">
            Thayto é um desenvolvedor com mais de 3 anos de experiência,
            apaixonado em aprender novas tecnologia e boas práticas para
            desenvolvimento, apesar da pouca idade ele já passou por diversos
            projetos onde deu seu melhor e conseguiu efetuar todas as entregas.
            Ele não pode ver um framework novo ou lib nova que já quer
            implementar, porém sempre e avalia os riscos antes de tal
            implementação.
          </p>
          <p className="text-base font-serif text-slate-800 mt-2">
            Ele gosta bastante de jogar, conhecer pessoas e lugares novos. Posso
            ter certeza que se conversar com ele, em poucos minutos já terão
            criado um conexão.
          </p>
        </div>

        <p className="text-xl font-serif text-slate-800 mt-10">
          In progress... 🧱
        </p>

        <p className="text-base font-serif text-slate-800 mt-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione sit
          earum minima optio quisquam non! Quisquam aspernatur sit non
          necessitatibus quasi molestias tenetur neque. Ducimus molestiae quam
          consequatur cum iusto! Officiis, minima atque unde dolorum optio
          temporibus quae delectus repellat molestias exercitationem, voluptates
          voluptatem consectetur quas aliquid recusandae tenetur quis sequi.
          Modi iusto similique ea laboriosam eaque exercitationem architecto
          est. Molestiae earum nemo impedit, mollitia commodi praesentium
          doloremque temporibus labore magni numquam deleniti, repellat velit
          ipsa quia non recusandae blanditiis laudantium laboriosam iusto. Hic
          blanditiis iure itaque voluptatibus sunt distinctio? Nemo officiis,
          molestias quas magni esse numquam suscipit voluptatibus commodi nihil
          velit fuga consequatur voluptate mollitia facere cumque iure eum
          repudiandae? Dolor quas ab sit quo corporis est. Incidunt, placeat? At
          doloremque dolor aliquam natus accusamus nostrum sequi dolorum libero
          culpa, facere enim saepe ullam inventore omnis error dignissimos
          cupiditate! Hic nesciunt cupiditate recusandae maiores dicta
          consequatur perspiciatis ducimus optio? Inventore alias fugit veniam
          ratione sit labore nemo repudiandae magnam accusantium repellendus
          pariatur molestiae, vitae sequi nobis porro eaque ab! Vel pariatur
          excepturi incidunt veritatis doloremque consectetur minus itaque eius.
          Maiores ullam consequatur earum ab eveniet obcaecati architecto et
          nesciunt quam atque doloribus ut placeat soluta tempore aliquid a
          voluptate quae impedit cumque, deleniti iure eaque saepe? Corrupti,
          natus quibusdam! Optio aperiam quisquam dolorum fugit, nemo quas illo
          quis adipisci iste animi, soluta consectetur velit id at quod
          quibusdam esse nisi quos, error hic nam itaque suscipit dignissimos.
          Quae, nesciunt. Mollitia quas temporibus eius amet cupiditate, sunt
          repellendus est libero aperiam architecto voluptatum nulla optio
          laboriosam similique rerum praesentium quos aliquam culpa? Rerum ullam
          reiciendis quas molestiae quia nisi repudiandae! Earum alias eligendi
          voluptatem sapiente sed quia, cumque necessitatibus id iure tenetur
          enim fugit aspernatur, magni corrupti nisi? Odit, debitis unde. Soluta
          ducimus voluptatibus, veritatis fugiat officiis nihil officia
          perferendis!
        </p>
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage
