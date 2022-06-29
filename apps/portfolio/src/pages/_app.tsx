import { AppProps } from 'next/app'
import Head from 'next/head'
import '../../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Component {...pageProps} />
  </>
)

export default MyApp
