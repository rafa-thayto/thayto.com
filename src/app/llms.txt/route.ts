import { getPosts } from '@/utils/mdx'
import { SITE_URL } from '@/utils/constants'
import { getYearsOfProfessionalExperience } from '@/constants'
import { SOCIAL_LINKS } from '@/utils/seo'
import { getCompaniesDetail } from '@/utils/markdown-response'
import { curiosityLinks } from '@/data/curiosity-links'
import { NextResponse } from 'next/server'

const OPEN_SOURCE: [string, string][] = [
  ["Clerk's CLI", curiosityLinks.clerkCli],
  ["Resend's CLI", curiosityLinks.resendCli],
  ["Outlit's SDK", curiosityLinks.outlitSdk],
  ['MCP Apps', curiosityLinks.mcpApps],
]

export async function GET() {
  const ptPosts = getPosts('pt')
  const enPosts = getPosts('en')
  const years = getYearsOfProfessionalExperience()

  const openSource = OPEN_SOURCE.map(
    ([label, url]) => `[${label}](${url})`,
  ).join(', ')

  const lines: string[] = [
    '# Rafael Thayto',
    '',
    `> Personal site and blog of Rafael Thayto Tani, a Senior Software Engineer with over ${years} years of experience in distributed systems, microservices, microfrontends, and observability. Posts are written in Portuguese (BR) and English.`,
    '',
    `Worked at large companies with millions of active users: ${getCompaniesDetail(
      'en',
    )}.`,
    '',
    `Built [Thaytool](${curiosityLinks.thaytool}), his own tool for orchestrating AI agents. Open source contributions: ${openSource}. Published [ajusta](${curiosityLinks.ajusta}) and [mdlens](${curiosityLinks.mdlens}) on npm. Creator of the [DevSenior Cast](${curiosityLinks.podcast}) podcast.`,
    '',
    '## Pages',
    '',
    `- [Home](${SITE_URL}/index.md)`,
    `- [About](${SITE_URL}/about.md)`,
    `- [Blog](${SITE_URL}/blog.md)`,
    `- [Books](${SITE_URL}/books.md): personal library — books read, currently reading, and to-read, with star ratings`,
    `- [Hobbies](${SITE_URL}/hobbies.md)`,
    `- [Linktree](${SITE_URL}/linktree.md)`,
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
    '## Profiles',
    '',
    ...SOCIAL_LINKS.map((url) => `- ${url}`),
    '',
  ]

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
