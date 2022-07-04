import { ComponentA } from '@src/components/ComponentA'
import { ComponentB } from '@src/components/ComponentB'
import { Header } from '@src/components/Header'
import { DevTo, GitHub, LinkedIn, Medium, TabNews } from '@src/components/icons'
import { Button, ButtonLink } from '@thayto/ui'
import { NextSeo } from 'next-seo'
import Image from 'next/image'

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
    <main className="container mx-auto mt-6 px-4 pb-4">
      <div className="flex mt-2 items-center justify-items-center justify-center flex-col sm:flex-row">
        <div className="relative w-52 h-52 ">
          <Image
            src="/static/images/profile.jpeg"
            layout="fill"
            width={200}
            height={200}
            priority
            className="rounded-full"
          />
        </div>
        <div className="sm:ml-6 mt-4 sm:mt-0 flex justify-center flex-col">
          <h1 className="text-2xl text-slate-900 font-bold">Rafael Thayto Tani</h1>
          <h2 className="text-xl text-slate-900 font-light">Senior Software Engineer</h2>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-base font-serif text-slate-800">
          Thayto is a developer, passionate about learning new technologies and good development
          practices, despite his young age he has already gone through several projects where he
          gave his best and managed to make all deliveries.
        </p>
      </div>
      <h2 className="text-lg text-slate-900 font-bold mt-4">Alguns links úteis</h2>
      <div className="flex mt-4">
        <ButtonLink href="https://www.linkedin.com/in/thayto/">
          <LinkedIn />
        </ButtonLink>
        <ButtonLink href="https://github.com/rafa-thayto">
          <GitHub />
        </ButtonLink>
        <ButtonLink href="https://dev.to/thayto/">
          <DevTo />
        </ButtonLink>
        <ButtonLink href="https://www.tabnews.com.br/thayto">
          <TabNews />
        </ButtonLink>
        <ButtonLink href="https://www.linkedin.com/in/thayto/">
          <Medium />
        </ButtonLink>
      </div>

      <p className="mt-8">
        Não repara na bagunça que tá esse site pq eu ainda tô contruindo blz? antes de fazer o
        bonito tô fazendo uma arquitetura interessante pra facilitar o desenvolvimento e pra ir
        estudando também
      </p>
      <p>
        Também tem o esquema que eu ainda não criei o design nem coisas do tipo ainda então tenham
        paciência que logo menos vai ter um blog por aqui, tmj!
      </p>
      <div className="m-4 border p-2">
        <p className="font-mono">Testes com XState</p>
        <ComponentA />
        <ComponentB />
      </div>
      <Button />
    </main>
  </>
)

export default PorfolioPage
