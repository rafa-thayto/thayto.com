import { useInterpret } from '@xstate/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import '../../styles/globals.css'
import { MyContext } from '../store/contexts'
import { myMachine } from '../store/myMachine'

const STORAGE_KEY = 'myPersistedState'

function rehydrateState() {
  // this is required because Next.js will initially load this page on the server
  if (typeof window === 'undefined') {
    return myMachine.initialState
  }
  const storage = localStorage.getItem(STORAGE_KEY)
  if (storage) {
    return JSON.parse(storage) || myMachine.initialState
  }
  return myMachine.initialState
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const service = useInterpret(myMachine, { state: rehydrateState() }, state =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state)),
  )

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
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
      <Script id="google-analytics" strategy="afterInteractive" src="/static/js/gtag.js" />
      <MyContext.Provider value={{ service }}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </MyContext.Provider>
    </>
  )
}

export default MyApp
