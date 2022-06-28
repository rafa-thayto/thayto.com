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
        <h2>Rafael Thayto Tani</h2>
        <h1>Senior Software Engineer</h1>
        <p>Aqui vai ter uma descrição</p>
        <Button />
        <Title />
      </main>
    </>
  )
}
