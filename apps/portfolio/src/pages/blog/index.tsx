import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

const Blog = () => {
  const [confettiWidth, setConfettiWidth] = useState(0)
  const [confettiHeight, setConfettiHeight] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    function handleResize() {
      setConfettiWidth(window.screen.width)
      setConfettiHeight(window.screen.height)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    setShowConfetti(true)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <NextSeo
        title="Rafael Thayto - Blog"
        description="Aqui você encontra vários artigos sobre tecnologia e carreira."
      />
      {showConfetti && (
        <Confetti
          width={confettiWidth}
          height={confettiHeight}
          recycle={false}
          numberOfPieces={800}
          tweenDuration={15000}
          gravity={0.15}
        />
      )}
      <main>
        <h1 className="text-xl">Blog</h1>
        <h2 className="text-lg">Aqui a gente vai ter um blog</h2>
        <article className="border-black border-solid border-2 mx-1 mb-2 p-1">
          <h1>Aqui tem um artigo se pá</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex voluptatibus atque
            excepturi velit eos nesciunt doloribus! Ducimus blanditiis aut quod, voluptates
            doloribus recusandae suscipit minus, ex animi quae neque rerum?
          </p>
        </article>
        <article className="border-black border-solid border-2 mx-1 mb-2 p-1">
          <h1>Como configurar o deploy do Turborepo no Netlify</h1>
          <span>Published: 21 de jun.</span>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex voluptatibus atque
            excepturi velit eos nesciunt doloribus! Ducimus blanditiis aut quod, voluptates
            doloribus recusandae suscipit minus, ex animi quae neque rerum?
          </p>
        </article>
        <article className="border-black border-solid border-2 mx-1 mb-2 p-1">
          <h1>Como 'settar' a versão default do Node usando nvm</h1>
          <span>Published: 19 de jun.</span>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex voluptatibus atque
            excepturi velit eos nesciunt doloribus! Ducimus blanditiis aut quod, voluptates
            doloribus recusandae suscipit minus, ex animi quae neque rerum?
          </p>
        </article>
      </main>
    </>
  )
}

export default Blog
