import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'

import '@src/styles/styles.css'
import '@src/styles/globals.css'

const CustomApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="robots" content="index follow" />
      <meta
        name="google-site-verification"
        content="sROMY6Ll7LXNivDpdIlLDY1OJGm5C1lQwA8DHhtabLo"
      />
    </Head>
    <Script
      id="google-tagmanager"
      strategy="afterInteractive"
      src="https://www.googletagmanager.com/gtag/js?id=G-TFB52R9T0C"
    />
    {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
    <Script
      id="google-analytics"
      strategy="afterInteractive"
      src="/static/js/gtag.js"
    />
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      src="/static/js/clarity.js"
    />
    <Component {...pageProps} />
  </>
)

export default CustomApp
