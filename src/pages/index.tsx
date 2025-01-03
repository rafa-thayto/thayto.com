import { Layout } from '@/components'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import { Post, getPosts } from '@/utils/mdx'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import posthog from 'posthog-js'
import Head from 'next/head'
import { getYearsOfProfessionalExperience } from '@/constants'

const IndexPage = ({
  posts: p,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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

  return (
    <Layout>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(blogPostingStructuredData)}
        </script>
      </Head>
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
              url: 'https://thayto.com/static/images/seo-card-home.png',
              type: 'image/png',
            },
          ],
          site_name: 'Thayto.com',
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
            Atualmente tenho mais de {getYearsOfProfessionalExperience()} anos
            de experiência como desenvolvedor. Desde o inicio da minha carreira
            lá em 2018 (quando comecei à atuar profissionalmente) sempre
            trabalhei com sistemas distribuídos, microsserviços, microfrontends
            e observabilidade. Já trabalhei em grandes empresas com milhões de
            usuarios ativos, empresas no Brasil, EUA e Suiça.
          </p>
          <p className="text-base font-serif text-slate-800 dark:text-slate-200">
            Aqui vocês vão encontrar alguns posts sobre tecnologia e alguns
            pensamentos (tanto em inglês quanto em português).
          </p>
          <p className="text-base font-serif text-slate-800 dark:text-slate-200">
            Prometo implementar i18n em breve.
          </p>
          <p className="text-base font-serif text-slate-800 dark:text-slate-200 mt-2">
            I use VIM btw (since 2022). ❤️
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
