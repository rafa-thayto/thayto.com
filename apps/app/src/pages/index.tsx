import {
  ArrowRightCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import { Footer, Header, IconsGroup } from '@src/components'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'

const IndexPage = () => {
  const description =
    'Software Engineer apaixonado por novas tecnologias, contruindo seu primeiro portfolio e blog <3!'

  return (
    <div className="bg-gray-100">
      <NextSeo
        title="Rafael Thayto - Home"
        description={description}
        canonical="https://thayto.com/"
        openGraph={{
          type: 'article',
          url: 'https://thayto.com/',
          title: 'Rafael Thayto - Home',
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

      <main className="container mx-auto mt-6 max-w-6xl border bg-slate-50 py-6 px-12">
        <div className="flex mt-2 items-center justify-items-center justify-center flex-col sm:flex-row">
          <div className="relative w-52 h-52 ">
            <Image
              src="/static/images/profile.jpeg"
              alt="Thayto's profile picture"
              layout="fill"
              priority
              className="rounded-full"
            />
          </div>
          <div className="sm:ml-6 mt-4 sm:mt-0 flex justify-center flex-col">
            <h1 className="text-2xl text-slate-900 font-bold">
              Rafael Thayto Tani
            </h1>
            <h2 className="text-xl text-slate-900 font-light">
              Senior Software Engineer
            </h2>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-base font-serif text-slate-800">
            Thayto é um desenvolvedor com mais de 3 anos de experiência,
            apaixonado em aprender novas tecnologia e boas práticas para
            desenvolvimento. Apesar da pouca idade ele já passou por diversos
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
        <h2 className="text-lg text-slate-900 font-bold mt-4">
          Alguns links úteis
        </h2>
        <div className="flex mt-4">
          <IconsGroup />
        </div>

        <p className="mt-8">
          Não repara na bagunça que tá esse site pq eu ainda tô construindo blz?
        </p>
        <p>
          Porém já tenho alguns posts no blog pra você dar uma conferida! ;)
        </p>

        <div className="w-36 mt-4">
          <Link href="/blog" passHref>
            <a
              href="/blog"
              className="flex justify-center items-center font-medium cursor-pointer rounded-full border text-slate-900 border-slate-900 bg-slate-50 hover:bg-yellow-50 py-2 mb-4"
            >
              Blog <ArrowRightIcon className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default IndexPage
