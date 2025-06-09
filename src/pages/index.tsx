import { Layout } from '@/components'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import { Post, getPosts } from '@/utils/mdx'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import posthog from 'posthog-js'
import Head from 'next/head'
import { getYearsOfProfessionalExperience } from '@/constants'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useState, useEffect, useRef } from 'react'

const IndexPage = ({
  posts: p,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [showAnimation, setShowAnimation] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    setIsHovering(true)
    timeoutRef.current = setTimeout(() => {
      setShowAnimation(true)
    }, 1000)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setShowAnimation(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

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

      <main className="max-w-4xl mx-auto mt-6 bg-neutral-50 dark:bg-slate-800 py-6 px-4 sm:px-24">
        <div className="flex mt-2 items-center justify-items-center justify-start flex-col sm:flex-row">
          <div
            className="relative w-20 h-20 cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-sm transition-all duration-500 ${
                showAnimation ? 'opacity-75 animate-spin' : 'opacity-0'
              }`}
            ></div>
            <div
              className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ${
                showAnimation ? 'opacity-100 animate-spin' : 'opacity-0'
              }`}
            ></div>

            {isHovering && !showAnimation && (
              <div className="absolute -inset-2 rounded-full !border-2 !border-blue-500 !animate-pulse !opacity-60"></div>
            )}

            <div className="relative w-full h-full bg-neutral-50 dark:bg-slate-800 rounded-full p-0.5">
              <Image
                src="/static/images/profile.jpg"
                alt="Thayto's profile picture"
                fill
                priority
                className={`rounded-full object-cover transition-transform duration-300 ${
                  isHovering ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          </div>
          <div className="sm:ml-6 mt-4 sm:mt-0 flex justify-center flex-col">
            <h1 className="text-2xl text-gray-900 dark:text-white font-bold">
              Rafael Thayto Tani
            </h1>
            <h2 className="text-xl text-gray-500 dark:text-gray-300 font-light">
              Senior Software Engineer
            </h2>
          </div>
        </div>

        <section className="text-sm font-normal font-sans mt-6 flex flex-col gap-4 text-gray-700 dark:text-gray-200">
          <p>Oi, sou o Rafael Thayto, prazer! :)</p>
          <p>
            Atualmente tenho mais de {getYearsOfProfessionalExperience()} anos
            de experiência como desenvolvedor. Desde o inicio da minha carreira
            lá em 2018 (quando comecei à atuar profissionalmente) sempre
            trabalhei com sistemas distribuídos, microsserviços, microfrontends
            e observabilidade. Já trabalhei em{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="underline cursor-help">grandes empresas</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Nike, Flash, Creditas, Safra Bank (NY, BR, Sarasin), Avanade
                </p>
              </TooltipContent>
            </Tooltip>{' '}
            com milhões de usuarios ativos, empresas no Brasil, EUA e Suiça.
          </p>
          <p>
            Aqui vocês vão encontrar alguns posts sobre tecnologia e alguns
            pensamentos (tanto em inglês quanto em português).
          </p>
          <p>I use VIM btw (since 2022). ❤️</p>
        </section>
        <section className="flex justify-center my-6 text-base text-slate-800 dark:text-slate-200 flex-col">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Posts
          </h2>
          <ul>
            {p?.map(({ data: { publishedTime, title, href } }) => (
              <li key={title} className="my-2 max-w">
                <Link
                  href={href}
                  className="text-sm flex !text-balance font-light gap-1 text-gray-800 dark:text-gray-200 underlined focus:outline-none whitespace-nowrap hover:text-gray-400 dark:hover:text-gray-400 focus:text-gray-400 dark:focus:text-gray-400"
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
