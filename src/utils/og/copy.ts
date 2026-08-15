import { defaultLocale, locales, type Locale } from '@/i18n/config'

export const resolveOgLocale = (locale: string): Locale =>
  locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale

export const OG_PAGES = [
  'home',
  'about',
  'blog',
  'posts',
  'books',
  'hobbies',
  'linktree',
] as const

export type OgPage = (typeof OG_PAGES)[number]

export type OgCopy = {
  greeting: string
  headline: string
}

export const OG_COPY: Record<OgPage, Record<Locale, OgCopy>> = {
  home: {
    en: {
      greeting: 'Hi, nice to meet you!',
      headline:
        "I'm Rafael Thayto,\nSenior Software Engineer\nand VIM/Neovim user ❤️ (since 2022)",
    },
    pt: {
      greeting: 'Oi, prazer!',
      headline:
        'Eu sou o Rafael Thayto,\nSenior Software Engineer\ne usuário de VIM/Neovim ❤️ (desde 2022)',
    },
  },
  about: {
    en: {
      greeting: 'About me',
      headline: 'A little about who I am\nand how I got here',
    },
    pt: {
      greeting: 'Sobre mim',
      headline: 'Um pouco sobre quem eu sou\ne como cheguei até aqui',
    },
  },
  blog: {
    en: {
      greeting: 'Check out this Blog',
      headline: 'Here you can find ideas, insights,\nexperiences and much more',
    },
    pt: {
      greeting: 'Dá uma olhada no Blog',
      headline:
        'Aqui você encontra ideias, insights,\nexperiências e muito mais',
    },
  },
  posts: {
    en: {
      greeting: 'Posts',
      headline: 'All my posts\nin one place',
    },
    pt: {
      greeting: 'Posts',
      headline: 'Todos os meus posts\nnum lugar só',
    },
  },
  books: {
    en: {
      greeting: 'Books',
      headline: 'My personal library:\nread, reading\nand want to read',
    },
    pt: {
      greeting: 'Livros',
      headline: 'Minha biblioteca pessoal:\nlidos, lendo\ne quero ler',
    },
  },
  hobbies: {
    en: {
      greeting: 'Hobbies',
      headline: 'Things I like to do\noutside of code',
    },
    pt: {
      greeting: 'Hobbies',
      headline: 'Coisas que eu gosto de fazer\nfora do código',
    },
  },
  linktree: {
    en: {
      greeting: 'Linktree',
      headline: "I've gathered all my links in this place",
    },
    pt: {
      greeting: 'Linktree',
      headline: 'Juntei todos os meus links aqui',
    },
  },
}
