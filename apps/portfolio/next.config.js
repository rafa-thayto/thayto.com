// @ts-check
const withTM = require('next-transpile-modules')(['@thayto/ui'])

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withTM(nextConfig)
