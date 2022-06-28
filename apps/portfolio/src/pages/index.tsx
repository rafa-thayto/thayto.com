import { NextSeo } from 'next-seo'
import Image from 'next/image'
import { Button } from 'ui'
import { Title } from '../components/Title'

export default function Web() {
  return (
    <>
      <NextSeo
        title="Rafael Thayto - Home"
        description="Software Engineer apaixonado por novas tecnologias e contruindo seu primeiro portfolio e blog <3!"
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
