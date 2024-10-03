import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import * as gtag from '@/lib/gtag'
import * as gtm from '@/lib/gtm'
import { MS_CLARITY_ID } from '@/lib/clarity'
import { GOOGLE_SITE_VERIFICATION } from '@/lib/google-site-verification'
import { posthog } from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

import '@/styles/blog.css'
import '@/styles/globals.css'
import '@/styles/styles.css'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  // checks that we are client-side
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug() // debug mode in development
    },
  })
}

const CustomApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
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
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="robots" content="index follow" />
      <meta
        name="google-site-verification"
        content={GOOGLE_SITE_VERIFICATION}
      />
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
      <link
        rel="alternate"
        type="application/rss+xml"
        title="RSS Feed"
        href="/rss.xml"
      />
    </Head>
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${MS_CLARITY_ID}");
        `,
      }}
    />
    <Script
      id="google-tagmanager"
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
    />
    {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
    <Script
      id="gtag-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag.GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `,
      }}
    />

    <Script
      id="gtag-base"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtm.GTM_ID}')
        `,
      }}
    />
    <PostHogProvider client={posthog}>
      <Component {...pageProps} />
    </PostHogProvider>
    <Analytics />
  </>
)

export default CustomApp
