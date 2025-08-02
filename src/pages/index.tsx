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
import { ChevronRight } from 'lucide-react'
import Confetti from 'react-confetti'

const IndexPage = ({
  posts: p,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [showAnimation, setShowAnimation] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    setIsHovering(true)
    timeoutRef.current = setTimeout(() => {
      setShowAnimation(true)
      handlePhotoClick()
    }, 500)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setShowAnimation(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handlePhotoClick = () => {
    setShowConfetti(true)
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
            onClick={handlePhotoClick}
          >
            <div
              className={`absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full blur-sm transition-all duration-500 ${
                showAnimation ? 'opacity-75 animate-spin' : 'opacity-0'
              }`}
            ></div>
            <div
              className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 rounded-full transition-all duration-500 ${
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

        <section className="mt-8 text-base text-slate-800 dark:text-slate-200">
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-lg font-normal text-slate-600 dark:text-slate-400 mb-6 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
          >
            Posts
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <div className="space-y-1">
            {(() => {
              // Group posts by year
              const postsByYear =
                p?.reduce((acc, post) => {
                  const year = new Date(post.data.publishedTime).getFullYear()
                  if (!acc[year]) acc[year] = []
                  acc[year].push(post)
                  return acc
                }, {} as Record<number, typeof p>) || {}

              // Sort years in descending order
              const sortedYears = Object.keys(postsByYear)
                .map(Number)
                .sort((a, b) => b - a)

              return sortedYears.map((year) => (
                <div key={year}>
                  {postsByYear[year].map(
                    ({ data: { publishedTime, title, href } }, index) => (
                      <Link
                        key={title}
                        href={href}
                        className="group flex items-center py-2 px-3 -mx-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                        onClick={() => {
                          posthog.capture('blog-card-clicked-home', {
                            href,
                            title,
                          })
                        }}
                      >
                        <div className="w-12 flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                          {index === 0 ? year : ''}
                        </div>
                        <div className="flex-1 text-sm text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                          {title}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-200">
                          <time dateTime={publishedTime.toString()}>
                            {new Intl.DateTimeFormat('pt-BR', {
                              month: '2-digit',
                              day: '2-digit',
                            }).format(new Date(publishedTime))}
                          </time>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              ))
            })()}
          </div>
        </section>
      </main>
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 200}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          onConfettiComplete={() => {
            setShowConfetti(false)
          }}
          colors={[
            '#3B82F6',
            '#60A5FA',
            '#93C5FD',
            '#DBEAFE',
            '#1D4ED8',
            '#2563EB',
          ]}
        />
      )}
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
