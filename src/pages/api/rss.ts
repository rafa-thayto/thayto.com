import { getPosts } from '@/utils/mdx'
import { NextApiRequest, NextApiResponse } from 'next'
import RSS from 'rss'

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const feed = new RSS({
    title: 'Rafael Thayto | Blog and Thoughts',
    description: 'Conteúdos sobre tecnologia e alguns pensamentos',
    feed_url: 'https://thayto.com/api/rss',
    site_url: 'https://thayto.com',
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
