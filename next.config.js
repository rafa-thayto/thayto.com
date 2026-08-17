//@ts-check

// @typescript-eslint/no-var-requires
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})
const { withPlaiceholder } = require('@plaiceholder/next')

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  // og image routes read these with fs at runtime; make sure they ship in the function bundle
  outputFileTracingIncludes: {
    '/[locale]/**': [
      './src/assets/og-fonts/*.ttf',
      './public/static/images/profile.jpg',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev-to-uploads.s3.amazonaws.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/blog/:slug.md',
        destination: '/api/blog/:slug/md',
      },
      {
        source: '/en/blog/:slug.md',
        destination: '/api/blog/:slug/md',
      },
      // AEO: expose every markdown-capable page at /<page>.md. The proxy
      // already serves these via "Accept: text/markdown", but its matcher
      // excludes dotted paths, so the .md URLs need explicit rewrites.
      // No query params here: rewrites preserve the original URL, so the
      // route handler derives page + locale from the .md pathname itself.
      ...['index', 'blog', 'books', 'linktree', 'hobbies'].flatMap((page) => [
        {
          source: `/${page}.md`,
          destination: '/api/markdown',
        },
        {
          source: `/en/${page}.md`,
          destination: '/api/markdown',
        },
      ]),
    ]
  },
  async redirects() {
    return [
      {
        source: '/links',
        destination: '/linktree',
        permanent: true,
      },
      // The about page was removed; the home page already tells the same story.
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      {
        source: '/en/about',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/about.md',
        destination: '/index.md',
        permanent: true,
      },
      {
        source: '/en/about.md',
        destination: '/en/index.md',
        permanent: true,
      },
    ]
  },
  async headers() {
    // Security Headers based on: https://nextjs.org/docs/advanced-features/security-headers
    // TODO: implement "Content-Security-Policy" section
    const securityHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
      },
    ]

    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        source: '/:path*',
        headers: securityHeaders,
      },

      // ENABLES CORS
      // {
      //   source: '/api/:path*',
      //   headers: [
      //     { key: 'Access-Control-Allow-Credentials', value: 'true' },
      //     { key: 'Access-Control-Allow-Origin', value: '*' },
      //     {
      //       key: 'Access-Control-Allow-Methods',
      //       value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      //     },
      //     {
      //       key: 'Access-Control-Allow-Headers',
      //       value:
      //         'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
      //     },
      //   ],
      // },
    ]
  },
}

module.exports = withNextIntl(
  withMDX({
    ...withPlaiceholder(nextConfig),
    // Append the default value with md extensions
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  }),
)
