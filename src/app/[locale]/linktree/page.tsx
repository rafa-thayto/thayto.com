import { Metadata } from 'next'
import { LinktreeContent } from './linktree-content'

const description = 'Minha árvore de links'

export const metadata: Metadata = {
  title: 'Rafael Thayto - Linktree',
  description,
  alternates: {
    canonical: 'https://thayto.com/linktree',
  },
  openGraph: {
    type: 'article',
    url: 'https://thayto.com/linktree',
    title: 'Rafael Thayto - Linktree',
    description,
    images: [
      {
        url: 'https://thayto.com/static/images/seo-card-linktree.png',
        type: 'image/png',
      },
    ],
    siteName: 'Thayto.com',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thayto',
    creator: '@thayto',
  },
}

export default function LinksPage() {
  return <LinktreeContent />
}
