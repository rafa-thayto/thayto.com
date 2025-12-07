import { POSTS_PATH } from '@/constants'
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
}

export const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path))

export const sortPostsByDate = (posts: any) => {
  return posts.sort((a: any, b: any) => {
    const aDate = new Date(a.data.publishedTime).getTime()
    const bDate = new Date(b.data.publishedTime).getTime()
    return bDate - aDate
  })
}

export const getPosts = (): Post[] => {
  const files = postFilePaths.map((filePath) => {
    const source = fs.readFileSync(path.join(POSTS_PATH, filePath), 'utf-8')
    const { content, data } = matter(source)
    data.id = nanoid()

    return {
      content,
      data,
      filePath,
    }
  })

  const posts = sortPostsByDate(files) as Post[]

  return posts
}

export const getMdxSerializedPost = async (slug: string) => {
  const markdownWithMeta = fs.readFileSync(
    path.join(POSTS_PATH, `${slug}.mdx`),
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
) => {
  const posts = getPosts()
  const currentFileName = `${slug}.mdx`
  const currentPostIndex = pipe(
    getPosts(),
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
