import { getPosts } from '@/utils/mdx'
import RSS from 'rss'
import fs from 'fs'
import { locales } from '@/i18n/config'

export const generateRssFeed = async () => {
  const site_url =
    process.env.LOCAL === 'true'
      ? 'http://localhost:3000'
      : 'https://thayto.com'

  for (const locale of locales) {
    const posts = getPosts(locale)
    const prefix = locale === 'pt' ? '' : 'en/'

    const feed = new RSS({
      title:
        locale === 'pt'
          ? 'Rafael Thayto, Blog e Pensamentos'
          : 'Rafael Thayto, Blog and Thoughts',
      description:
        locale === 'pt'
          ? 'Conteúdos sobre tecnologia e alguns pensamentos'
          : 'Content about technology and thoughts',
      site_url: `${site_url}/${prefix}`,
      feed_url: `${site_url}/rss-${locale}.xml`,
      image_url: `${site_url}/favicon-32x32.png`,
      language: locale === 'pt' ? 'pt-BR' : 'en-US',
      copyright: `All rights reserved ${new Date().getFullYear()}`,
      pubDate: new Date(),
    })

    posts.forEach((post) => {
      feed.item({
        title: post.data.title,
        description: post.data.description,
        url: `${site_url}/${prefix}blog/${post.filePath.replace('.mdx', '')}`,
        date: post.data.publishedTime,
        categories: post.data.tags,
        author: 'Rafael Thayto',
      })
    })

    fs.writeFileSync(`./public/rss-${locale}.xml`, feed.xml({ indent: true }))
  }

  // Copy Portuguese RSS as default rss.xml
  fs.copyFileSync('./public/rss-pt.xml', './public/rss.xml')
}
