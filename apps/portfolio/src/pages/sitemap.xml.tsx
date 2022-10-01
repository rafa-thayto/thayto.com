import fs from 'fs'
import path from 'path'
import { GetServerSideProps } from 'next'

const Sitemap = () => null

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const domainUrl = 'https://thayto.com'
  console.error('fs.readdir(path.join(/))', fs.readdirSync(path.join('/')))
  console.error('fs.readdir(path.join(..))', fs.readdirSync(path.join('..')))
  console.error(
    'fs.readdir(path.join(../..))',
    fs.readdirSync(path.join('..', '..')),
  )
  console.error('fs.readdir(path.join())', fs.readdirSync(path.join('')))

  const files = fs.readdirSync(path.join('blog'))
  console.log(files)
  const files2 = fs.readdirSync(path.join(''))
  console.log(files2)

  const postsFilenames = files.map(filename => filename.replace('.mdx', ''))

  const postsUrlMaps = postsFilenames.reduce(
    (mappedUrls, filename) =>
      `${mappedUrls}
  <url>
    <loc>${domainUrl}/blog/${filename}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
    '  ',
  )

  const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="https://www.sitemaps.org/schemas/sitemap/0.9 https://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
  <url>
    <loc>${domainUrl}</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domainUrl}/linktree</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domainUrl}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>${postsUrlMaps}
</urlset>
`.trim()

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Content-Length', Buffer.byteLength(sitemap))
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default Sitemap
