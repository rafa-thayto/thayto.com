import Image from 'next/image'
import {
  TabNews,
  Medium,
  LinkedIn,
  DevTo,
  GitHub,
  Twitter,
} from '@src/components/Icons'
import { Footer } from '@src/components/Footer'
import Link from 'next/link'

const LinksPage = () => (
  <div className="mx-0 pt-4 px-8">
    <header className="mb-8 mx-auto">
      <div className="relative w-44 h-44 mb-4 mx-auto">
        <Image
          src="/static/images/profile.jpeg"
          alt="Thayto's profile picture"
          layout="fill"
          priority
          className="rounded-full"
        />
      </div>
      <h1 className="text-2xl text-slate-900 font-bold text-center">
        Rafael Thayto Tani
      </h1>
    </header>
    <main className="lg:mx-72 xl:mx-96 mb-10">
      <a
        href="https://www.linkedin.com/in/thayto/"
        className="flex justify-center font-medium cursor-pointer rounded-full border border-slate-900 hover:bg-yellow-50 px-10 py-4 mb-4"
      >
        LinkedIn
        <span className="ml-4">
          <LinkedIn />
        </span>
      </a>
      <a
        href="https://twitter.com/_thayto"
        className="flex justify-center font-medium cursor-pointer rounded-full border border-slate-900 hover:bg-yellow-50 px-10 py-4 mb-4"
      >
        Twitter
        <span className="ml-4">
          <Twitter />
        </span>
      </a>
      <Link href="/blog" passHref>
        <a
          href="/blog"
          className="flex justify-center font-medium cursor-pointer rounded-full border border-slate-900 hover:bg-yellow-50 px-10 py-4 mb-4"
        >
          Blog
        </a>
      </Link>
      <a
        href="https://github.com/rafa-thayto"
        className="flex justify-center font-medium cursor-pointer rounded-full border border-slate-900 hover:bg-yellow-50 px-10 py-4 mb-4"
      >
        GitHub
        <span className="ml-4">
          <GitHub />
        </span>
      </a>
      <a
        href="https://dev.to/thayto/"
        className="flex justify-center font-medium cursor-pointer rounded-full border border-slate-900 hover:bg-yellow-50 px-10 py-4 mb-4"
      >
        Dev.to
        <span className="ml-4">
          <DevTo />
        </span>
      </a>
      <a
        href="https://www.tabnews.com.br/thayto"
        className="flex justify-center font-medium cursor-pointer rounded-full border border-slate-900 hover:bg-yellow-50 px-10 py-4 mb-4"
      >
        TabNews
        <span className="ml-4">
          <TabNews />
        </span>
      </a>
      <a
        href="https://medium.com/@thayto"
        className="flex justify-center font-medium cursor-pointer rounded-full border border-slate-900 hover:bg-yellow-50 px-10 py-4 mb-4"
      >
        Medium
        <span className="ml-4">
          <Medium />
        </span>
      </a>
    </main>
    <Footer />
  </div>
)

export default LinksPage
