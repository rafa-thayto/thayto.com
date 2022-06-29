import { NextSeo } from 'next-seo'
import Image from 'next/image'
import { Button } from 'ui'
import Script from 'next/script'
import Head from 'next/head'
import Link from 'next/link'

export default function Web() {
  return (
    <>
      <NextSeo
        title="Rafael Thayto - Home"
        description="Software Engineer apaixonado por novas tecnologias e contruindo seu primeiro portfolio e blog <3!"
      />
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta key="robots" name="robots" content="index follow" />
        <meta
          name="google-site-verification"
          content="sROMY6Ll7LXNivDpdIlLDY1OJGm5C1lQwA8DHhtabLo"
        />
      </Head>
      {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
      <Script
        id="google-tagmanager"
        async
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-TFB52R9T0C"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XBFX6EH2WM');
          `,
        }}
      />
      <main>
        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
          <Image src="/static/images/profile.jpeg" layout="fixed" width="200px" height="200px" />
        </div>
        <h1 className="text-3xl">Rafael Thayto Tani</h1>
        <h2 className="text-2xl mb-4">Senior Software Engineer</h2>
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
        <Button />
        <h2 className="text-lg">Vem ver algumas coisas que eu ainda não publiquei</h2>
        <Link href="/blog" className="text-blue-400">
          Link pro blog que eu ainda não publiquei nada kkkkk
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
}
