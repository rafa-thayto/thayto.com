import fs from 'fs'
import { POSTS_PATH } from '@src/constants'
import path from 'path'
import matter from 'gray-matter'

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

export const getPreviousPostBySlug = (slug) => {
  const posts = getPosts()
  const currentFileName = `${slug}.mdx`
  const currentPost = posts.find((post) => post.filePath === currentFileName)
  const currentPostIndex = posts.indexOf(currentPost)

  const post = posts[currentPostIndex + 1]
  // no prev post found
  if (!post) return null

  const previousPostSlug = post?.filePath.replace(/\.mdx?$/, '')

  return {
    title: post.data.title,
    slug: previousPostSlug,
  }
}

export const getNextPostBySlug = (slug) => {
  const posts = getPosts()
  const currentFileName = `${slug}.mdx`
  const currentPost = posts.find((post) => post.filePath === currentFileName)
  const currentPostIndex = posts.indexOf(currentPost)

  const post = posts[currentPostIndex - 1]
  // no prev post found
  if (!post) return null

  const nextPostSlug = post?.filePath.replace(/\.mdx?$/, '')

  return {
    title: post.data.title,
    slug: nextPostSlug,
  }
}
