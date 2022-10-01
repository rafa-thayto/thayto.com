import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const domainUrl = 'https://thayto.com'

  const files = fs.readdirSync(path.join('posts'))
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
}

export default handler