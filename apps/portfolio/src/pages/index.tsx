import { ComponentA } from '@src/components/ComponentA'
import { ComponentB } from '@src/components/ComponentB'
import { Header } from '@src/components/Header'
import { Title } from '@src/components/Title'
import { Button } from '@thayto/ui'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'

const PorfolioPage = () => (
  <>
    <NextSeo
      title="Rafael Thayto - Home"
      description="Software Engineer apaixonado por novas tecnologias, contruindo seu primeiro portfolio e blog <3!"
      canonical="https://thayto.com/"
      openGraph={{
        url: 'https://thayto.com/',
        title: 'Rafael Thayto - Home',
        description: "Rafael Thayto's Portfolio",
        images: [
          {
            url: 'http://thayto.com/static/images/profile.jpeg',
            width: 460,
            height: 460,
            alt: 'Rafael Thayto Profile Picture',
            type: 'image/jpeg',
          },
        ],
        site_name: 'RafaelThayto',
      }}
      twitter={{
        cardType: 'summary_large_image',
        site: '@thayto',
        handle: '@thayto',
      }}
    />
    <Header />
    <main>
      <div className="flex mt-2 justify-center">
        <div className="relative">
          <Image
            src="/static/images/profile.jpeg"
            layout="fixed"
            width={200}
            height={200}
            priority
            className="rounded-full"
          />
        </div>
        <div className="ml-6">
          <h1 className="text-3xl">Rafael Thayto Tani</h1>
          <h2 className="text-2xl mt-4">Senior Software Engineer</h2>
        </div>
      </div>
      <p>Aqui vai ter uma descrição</p>
      <p>😎</p>
      <p>
        Não repara na bagunça que tá esse site pq eu ainda tô contruindo blz? antes de fazer o
        bonito tô fazendo uma arquitetura interessante pra facilitar o desenvolvimento e pra ir
        estudando também
      </p>
      <p>
        Também tem o esquema que eu ainda não criei o design nem coisas do tipo ainda então tenham
        paciência que logo menos vai ter um blog por aqui, tmj!
      </p>
      <div className="m-4">
        <Title />
        <ComponentA />
        <ComponentB />
      </div>
      <Button />
      <h2 className="text-lg">Vem ver algumas coisas que eu ainda não publiquei</h2>
      <Link href="/blog">
        <a className="text-blue-400">Link pro blog que eu ainda não publiquei nada kkkkk</a>
      </Link>
      <h2 className="text-lg">Alguns links úteis</h2>
      <a href="https://www.linkedin.com/in/thayto/" className="text-blue-400">
        LinkedIn
      </a>
      <a href="https://github.com/rafa-thayto" className="text-blue-400 ml-4">
        GitHub
      </a>
      <a href="https://dev.to/thayto" className="text-blue-400 ml-4">
        Dev.to
      </a>
      <a href="https://www.tabnews.com.br/thayto" className="text-blue-400 ml-4">
        TabNews
      </a>
      <a href="https://medium.com/@thayto" className="text-blue-400 ml-4">
        Medium
      </a>
    </main>
  </>
)

export default PorfolioPage
