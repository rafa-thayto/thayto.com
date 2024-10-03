import { Layout } from '@/components'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import { Post, getPosts } from '@/utils/mdx'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import posthog from 'posthog-js'

const IndexPage = ({
  posts: p,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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

      <main className="max-w-6xl mx-auto mt-6 shadow dark:shadow-black bg-slate-50 dark:bg-gray-800 py-6 px-4 sm:px-24">
        <div className="flex mt-2 items-center justify-items-center justify-center flex-col sm:flex-row">
          <div className="relative w-40 h-40 ">
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

        <section className="mt-6 flex flex-col gap-1">
          <p className="text-base font-serif text-slate-800 dark:text-slate-200">
            Oi, sou o Rafael Thayto, prazer! :)
          </p>
          <p className="text-base font-serif text-slate-800 dark:text-slate-200">
            Atualmente tenho mais de {new Date().getFullYear() - 2018} anos de
            experiência como desenvolvedor. Desde o inicio da minha carreira lá
            em 2018 (quando comecei à atuar profissionalmente) sempre trabalhei
            com sistemas distribuídos, microsserviços, microfrontends e
            observabilidade. Já trabalhei em grandes empresas com milhões de
            usuarios ativos, empresas no Brasil, EUA e Suiça.
          </p>
          <p className="text-base font-serif text-slate-800 dark:text-slate-200">
            Aqui vocês vão encontrar alguns posts sobre tecnologia e alguns
            pensamentos (tanto em inglês quanto em português).{' '}
          </p>
          <p className="text-base font-serif text-slate-800 dark:text-slate-200">
            Prometo implementar i18n em breve.
          </p>
          <p className="text-base font-serif text-slate-800 dark:text-slate-200 mt-2">
            I use VIM btw. ❤️
          </p>
        </section>
        <section className="flex justify-center my-6 text-base font-serif text-slate-800 dark:text-slate-200 flex-col">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Posts
          </h2>
          <ul>
            {p?.map(({ data: { publishedTime, title, href } }) => (
              <li key={title} className="my-2 max-w">
                <Link
                  href={href}
                  className="text-base flex !text-balance gap-1 font-serif text-slate-800 dark:text-slate-200 underlined focus:outline-none whitespace-nowrap hover:text-gray-400 dark:hover:text-slate-400 focus:text-gray-400 dark:focus:text-slate-400"
                  onClick={() => {
                    posthog.capture('blog-card-clicked-home', {
                      href,
                      title,
                    })
                  }}
                >
                  <span>
                    <time dateTime={publishedTime.toString()}>
                      {new Intl.DateTimeFormat('pt-BR', {
                        dateStyle: 'short',
                      }).format(new Date(publishedTime))}
                    </time>
                  </span>
                  <span>|</span>
                  <span className="">{title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<{
  posts: Post[]
}> = async () => {
  const posts = getPosts()

  return {
    props: {
      posts: posts,
    },
  }
}

export default IndexPage
