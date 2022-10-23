//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nrwl/next/plugins/with-nx')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfigNx = {
  nx: {
    svgr: false,
  },
}

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
}

module.exports = withNx({
  ...nextConfigNx,
  ...withMDX({
    ...nextConfig,
    // Append the default value with md extensions
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  }),
})
