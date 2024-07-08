/* eslint-disable @next/next/no-page-custom-font */
import { Head, Html, Main, NextScript } from 'next/document'
import { GTM_ID } from '@/lib/gtm'

const CustomDocument = () => (
  <Html lang="pt-BR" className="dark">
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Lora&family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <body>
      {/* <!-- Google Tag Manager (noscript) --> */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      {/* <!-- End Google Tag Manager (noscript) --> */}
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default CustomDocument
