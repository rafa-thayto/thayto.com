import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { IconsGroup, Layout } from '@src/components'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'

const IndexPage = () => {
  const description =
    'Rafael Thayto, Senior Software Engineer apaixonado por novas tecnologias, bem vindo ao meu blog <3!'

  return (
    <Layout>
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

      <main className="max-w-6xl mx-auto mt-6 shadow bg-slate-50 dark:bg-gray-800 py-6 px-4 sm:px-12">
        <div className="flex mt-2 items-center justify-items-center justify-center flex-col sm:flex-row">
          <div className="relative w-52 h-52 ">
            <Image
              src="/static/images/profile.jpg"
              alt="Thayto's profile picture"
              fill
              priority
              className="rounded-full"
            />
          </div>
          <div className="sm:ml-6 mt-4 sm:mt-0 flex justify-center flex-col">
            <h1 className="text-2xl text-slate-900 dark:text-white font-bold">
              Rafael Thayto Tani
            </h1>
            <h2 className="text-xl text-slate-900 dark:text-slate-400 font-light">
              Senior Software Engineer
            </h2>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-base font-serif text-slate-800 dark:text-slate-200">
            Rafael Thayto é um desenvolvedor com mais de 5 anos de experiência,
            apaixonado por resolver problemas e aprender novas tecnologias e
            boas práticas de desenvolvimento. Atuei em diversos projetos, sempre
            me dedicando ao máximo para garantir a entrega de soluções
            eficientes e de alta qualidade.
          </p>
          <p className="text-base font-serif text-slate-800 dark:text-slate-200 mt-2">
            Ele gosta bastante de jogar, conhecer pessoas e lugares novos. Posso
            ter certeza que se conversar com ele, em poucos minutos já terão
            criado uma conexão.
          </p>
        </div>

        <p className="mt-8 text-slate-800 dark:text-slate-200">
          Não repara na bagunça que tá esse site pq eu ainda tô construindo blz?
        </p>
        <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
          Vem dar uma olhada no blog que já tenho alguns posts pra você dar uma
          conferida! ;)
        </p>

        <div className="w-36 mt-4">
          <Link
            href="/blog"
            className="flex justify-center items-center  cursor-pointer border rounded-full font-medium text-slate-900 border-slate-900 hover:bg-indigo-300 dark:hover:bg-indigo-500 bg-slate-50 dark:bg-slate-100 py-2 mb-4 transition"
          >
            <>
              Blog <ArrowRightIcon className="ml-2 h-4 w-4" />
            </>
          </Link>
        </div>

        <h2 className="text-lg text-slate-900 dark:text-white font-bold mt-10">
          Alguns links úteis
        </h2>
        <div className="flex mt-4">
          <IconsGroup />
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
