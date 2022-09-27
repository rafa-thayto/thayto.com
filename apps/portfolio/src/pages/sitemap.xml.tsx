import { GetServerSideProps } from 'next'

const Sitemap = () => null

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const domainUrl = 'https://thayto.com'
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
    <loc>${domainUrl}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${domainUrl}/blog/como-configurar-o-deploy-do-turborepo-no-netlify</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${domainUrl}/blog/como-settar-a-versao-default-do-node-usando-nvm</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${domainUrl}/linktree</loc>
    <priority>1.0</priority>
  </url>
</urlset>
`.trim()

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Content-Length', Buffer.byteLength(sitemap))
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default Sitemap
