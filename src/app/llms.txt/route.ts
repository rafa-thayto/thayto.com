import { getPosts } from '@/utils/mdx'
import { SITE_URL } from '@/utils/constants'
import { NextResponse } from 'next/server'

export async function GET() {
  const ptPosts = getPosts('pt')
  const enPosts = getPosts('en')

  const lines: string[] = [
    '# Rafael Thayto',
    '',
    '> Personal blog about software engineering, web development, and technology. Written in Portuguese (BR) and English.',
    '',
    '## Blog Posts (Portuguese)',
    '',
    ...ptPosts.map(
      (post) =>
        `- [${post.data.title}](${SITE_URL}/blog/${post.filePath.replace(
          '.mdx',
          '',
        )}.md): ${post.data.description}`,
    ),
    '',
    '## Blog Posts (English)',
    '',
    ...enPosts.map(
      (post) =>
        `- [${post.data.title}](${SITE_URL}/en/blog/${post.filePath.replace(
          '.mdx',
          '',
        )}.md): ${post.data.description}`,
    ),
    '',
    '## About',
    '',
    `- [About Rafael Thayto](${SITE_URL}/about): Senior Software Engineer, blogger, and open source contributor.`,
    '',
  ]

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
