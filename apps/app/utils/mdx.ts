import { POSTS_PATH } from '@src/constants'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

export const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path))

export const sortPostsByDate = (posts) => {
  return posts.sort((a, b) => {
    const aDate = new Date(a.data.publishedTime).getTime()
    const bDate = new Date(b.data.publishedTime).getTime()
    return bDate - aDate
  })
}

export const getPosts = () => {
  let posts = postFilePaths.map((filePath) => {
    const source = fs.readFileSync(path.join(POSTS_PATH, filePath), 'utf-8')
    const { content, data } = matter(source)

    return {
      content,
      data,
      filePath,
    }
  })

  posts = sortPostsByDate(posts)

  return posts
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
