import { Lora, Poppins } from 'next/font/google'
import { Metadata } from 'next'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { GOOGLE_SITE_VERIFICATION } from '@/lib/google-site-verification'
import { Providers } from './providers'
import { Analytics } from './analytics'

import '@/styles/blog.css'
import '@/styles/globals.css'
import '@/styles/styles.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://thayto.com'),
  robots: 'index follow',
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  other: {
    'google-adsense-account': 'ca-pub-8276321032154686',
  },
  alternates: {
    types: {
      'application/rss+xml': [
        { url: 'https://thayto.com/rss.xml', title: 'RSS Feed (Português)' },
        { url: 'https://thayto.com/rss-pt.xml', title: 'RSS Feed - Português' },
        { url: 'https://thayto.com/rss-en.xml', title: 'RSS Feed - English' },
      ],
    },
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="white"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="black"
        />
      </head>
      <body className={`${poppins.variable} ${lora.variable} font-sans`}>
        <Providers>{children}</Providers>
        <Analytics />
        <VercelAnalytics />
      </body>
    </html>
  )
}
