import { getPosts } from '@/utils/mdx'
import { SITE_URL } from '@/utils/constants'
import { getPostsPath } from '@/constants'
import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

async function getPostContent(slug: string, locale: string): Promise<string> {
  const postsPath = getPostsPath(locale)
  const filePath = path.join(postsPath, `${slug}.mdx`)
  return fs.readFile(filePath, 'utf-8')
}

export async function GET() {
  const ptPosts = getPosts('pt')
  const enPosts = getPosts('en')

  const sections: string[] = [
    '# Rafael Thayto - Full Content',
    '',
    '> Complete blog content for LLM consumption. Written in Portuguese (BR) and English.',
    '',
    '---',
    '',
    '## Blog Posts (Portuguese)',
    '',
  ]

  for (const post of ptPosts) {
    const slug = post.filePath.replace('.mdx', '')
    const content = await getPostContent(slug, 'pt')
    sections.push(
      `### ${post.data.title}`,
      '',
      `Source: ${SITE_URL}/blog/${slug}`,
      '',
      content,
      '',
      '---',
      '',
    )
  }

  sections.push('## Blog Posts (English)', '')

  for (const post of enPosts) {
    const slug = post.filePath.replace('.mdx', '')
    const content = await getPostContent(slug, 'en')
    sections.push(
      `### ${post.data.title}`,
      '',
      `Source: ${SITE_URL}/en/blog/${slug}`,
      '',
      content,
      '',
      '---',
      '',
    )
  }

  return new NextResponse(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
