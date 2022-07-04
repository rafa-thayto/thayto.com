import Link from 'next/link'

interface BlogCardProps {
  title: string
  description: string
  published: string
  tags: string[]
  href: string
}

export const BlogCard = ({ title, description, tags, published, href }: BlogCardProps) => (
  <div className="max-w-sm rounded overflow-hidden shadow-lg border-gray-400 border">
    <div className="px-6 py-4">
      <Link href={href} passHref>
        <div className="cursor-pointer">
          <a rel="noopener" aria-label="Post Preview Title" href={href}>
            <h1 className="font-bold text-xl mb-2">{title}</h1>
          </a>
          <p className="text-gray-400 text-sm mb-2">{published}</p>
          <p className="text-gray-700 text-base">{description}</p>
        </div>
      </Link>
    </div>
    <div className="px-6 pt-4 pb-2">
      {tags.map(tag => (
        <a
          rel="noopener nofollow"
          key={tag}
          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >
          #{tag}
        </a>
      ))}
    </div>
  </div>
)
