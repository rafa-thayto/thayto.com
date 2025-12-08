import { getPostsPath } from '@/constants'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { nanoid } from 'nanoid'

export type Post = {
  content: string
  data: {
    id: string
    title: string
    publishedTime: Date
    modifiedTime: Date
    description: string
    // New LLM/AI SEO fields
    keywords?: string[]
    summary?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    readingTime?: number
    tableOfContents?: boolean
    sources?: Array<{
      title: string
      url: string
      accessed?: string
    }>
    relatedPosts?: string[]
    // Existing fields
    image: {
      src: string
      placeholder?: string
      type: string
      alt?: string
      base64?: string
    }
    tags: string[]
    href: string
    reactionsLength: number
    commentsLength: number
  }
  filePath: string
  locale: string
}

export const sortPostsByDate = (posts: any) => {
  return posts.sort((a: any, b: any) => {
    const aDate = new Date(a.data.publishedTime).getTime()
    const bDate = new Date(b.data.publishedTime).getTime()
    return bDate - aDate
  })
}

// Calculate word count from MDX content (for LLM SEO)
export function calculateWordCount(content: string): number {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

export const getPosts = (locale: string): Post[] => {
  const postsPath = getPostsPath(locale)
  const postFilePaths = fs
    .readdirSync(postsPath)
    // Only include md(x) files
    .filter((path) => /\.mdx?$/.test(path))

  const files = postFilePaths.map((filePath) => {
    const source = fs.readFileSync(path.join(postsPath, filePath), 'utf-8')
    const { content, data } = matter(source)
    data.id = nanoid()

    return {
      content,
      data,
      filePath,
      locale,
    }
  })

  const posts = sortPostsByDate(files) as Post[]

  return posts
}

export const getMdxSerializedPost = async (slug: string, locale: string) => {
  const postsPath = getPostsPath(locale)
  const markdownWithMeta = fs.readFileSync(
    path.join(postsPath, `${slug}.mdx`),
    'utf-8',
  )

  const { data: frontMatter, content } = matter(markdownWithMeta)

  return {
    frontMatter,
    mdxSource: content,
  }
}

type NextPreviousType = 'previous' | 'next'

export const getPreviousOrNextPostBySlug = (
  slug: string,
  type: NextPreviousType,
  locale: string,
) => {
  const posts = getPosts(locale)
  const currentFileName = `${slug}.mdx`
  const currentPostIndex = pipe(
    posts,
    A.findIndex((post) => post.filePath === currentFileName),
    O.getOrElse(() => -1),
  )

  const counter = type === 'previous' ? 1 : -1

  const post = posts[currentPostIndex + counter]

  if (!post) return null

  const postSlug = post?.filePath.replace(/\.mdx?$/, '')

  return {
    title: post.data.title,
    slug: postSlug,
  }
}
