import { CodeBlock, Pre, MDXImage, CustomLink } from '@/components'
import type { MDXRemote } from 'next-mdx-remote/rsc'
import type { Locale } from '@/i18n/config'
import remarkGfm from 'remark-gfm'
import remarkA11yEmoji from '@fec/remark-a11y-emoji'
import rehypeSlug from 'rehype-slug'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { h } from 'hastscript'

type MdxContext = {
  slug: string
  locale: Locale
  title: string
}

// Shared by blog posts and notes so both surfaces render code, images and
// links with the same interactive components and PostHog context.
export const getMdxComponents = ({ slug, locale, title }: MdxContext) => ({
  pre: (props: React.ComponentProps<typeof Pre>) => (
    <Pre {...props} slug={slug} locale={locale} title={title} />
  ),
  code: (props: React.ComponentProps<typeof CodeBlock>) => (
    <CodeBlock {...props} slug={slug} locale={locale} title={title} />
  ),
  img: (props: React.ComponentProps<typeof MDXImage>) => (
    <MDXImage {...props} slug={slug} locale={locale} postTitle={title} />
  ),
  Image: (props: React.ComponentProps<typeof MDXImage>) => (
    <MDXImage {...props} slug={slug} locale={locale} postTitle={title} />
  ),
  a: (props: React.ComponentProps<typeof CustomLink>) => (
    <CustomLink {...props} slug={slug} locale={locale} title={title} />
  ),
})

type RehypePlugins = NonNullable<
  NonNullable<Parameters<typeof MDXRemote>[0]['options']>['mdxOptions']
>['rehypePlugins']

const headingAnchors = [
  rehypeAutolinkHeadings,
  {
    behavior: 'prepend',
    properties: {
      ariaLabel: 'Link to this section',
      classname: ['no-underline'],
    },
    content: h('span.text-indigo-500', '# '),
  },
]

export const mdxOptions = {
  remarkPlugins: [remarkGfm, remarkA11yEmoji],
  rehypePlugins: [rehypeSlug, rehypePrismPlus, headingAnchors] as RehypePlugins,
}

// notes keep their headings bare: no "# " anchor prefix in front of them
export const noteMdxOptions = {
  remarkPlugins: [remarkGfm, remarkA11yEmoji],
  rehypePlugins: [rehypeSlug, rehypePrismPlus] as RehypePlugins,
}
