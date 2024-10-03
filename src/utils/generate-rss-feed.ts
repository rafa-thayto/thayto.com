import { getPosts } from '@/utils/mdx'
import RSS from 'rss'
import fs from 'fs'

export const generateRssFeed = async () => {
  const site_url =
    process.env.LOCAL === 'true'
      ? 'http://localhost:3000'
      : 'https://thayto.com'

  const feed = new RSS({
    title: 'Rafael Thayto, Blog and Thoughts',
    description: 'Conteúdos sobre tecnologia e alguns pensamentos',
    site_url: site_url,
    feed_url: `${site_url}/rss.xml`,
    image_url: `${site_url}/favicon-32x32.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    pubDate: new Date(),
  })

  const posts = getPosts()

  posts.forEach((post) => {
    feed.item({
      title: post.data.title,
      description: post.data.description,
      url: `${site_url}/${post.data.href}`,
      date: post.data.publishedTime,
      categories: post.data.tags,
      author: 'Rafael Thayto',
    })
  })

  fs.writeFileSync('./public/rss.xml', feed.xml({ indent: true }))
}
