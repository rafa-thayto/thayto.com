// @ts-check
const withTM = require('next-transpile-modules')(['@thayto/ui'])

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
}

module.exports = withTM(nextConfig)
