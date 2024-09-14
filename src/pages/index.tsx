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

        <section className="mt-6">
          <p className="text-base font-serif text-slate-800 dark:text-slate-200">
            Rafael Thayto é um desenvolvedor com mais de 6 anos de experiência,
            apaixonado por resolver problemas e aprender novas tecnologias e
            boas práticas de desenvolvimento. Atuei em diversos projetos, sempre
            me dedicando ao máximo para garantir a entrega de soluções
            eficientes e de alta qualidade.
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
                    posthog.capture('blog-card-clicked', {
                      href,
                      title,
                    })
                    window.umami.track('blog-card-clicked', {
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
