import { getPosts } from '@/utils/mdx'
import { NextApiRequest, NextApiResponse } from 'next'
import RSS from 'rss'

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const site_url =
    process.env.NODE_ENV === 'production'
      ? 'https://thayto.com'
      : 'http://localhost:3000'

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
      url: `https://thayto.com/${post.data.href}`,
      date: post.data.publishedTime,
      categories: post.data.tags,
      author: 'Rafael Thayto',
    })
  })

  res.setHeader('Content-Type', 'text/xml')
  res.write(feed.xml())
  res.end()
}
