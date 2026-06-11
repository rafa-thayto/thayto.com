'use client'

import { Command } from 'cmdk'
import {
  BookMarked,
  BookOpen,
  Cloud,
  Code2,
  FileText,
  Github,
  Home,
  Instagram,
  Languages,
  Link2,
  Linkedin,
  Mail,
  Newspaper,
  SunMoon,
  Twitter,
  User,
  Youtube,
  type LucideIcon,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import posthog from 'posthog-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from '@/i18n/routing'

// Shared sizing/colour for every leading item icon so the list reads as one
// consistent column regardless of which group an item belongs to.
const ICON_CLASS = 'h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500'

export const OPEN_COMMAND_PALETTE_EVENT = 'open-command-palette'

export type CommandPalettePost = {
  title: string
  slug: string
  tags: string[]
}

export type CommandPaletteBook = {
  id: string
  title: string
  author: string
  amazonUrl?: string
}

type CommandPaletteProps = {
  posts: CommandPalettePost[]
  books: CommandPaletteBook[]
}

const PAGES: { key: string; pathname: string; Icon: LucideIcon }[] = [
  { key: 'home', pathname: '/', Icon: Home },
  { key: 'blog', pathname: '/blog', Icon: Newspaper },
  { key: 'books', pathname: '/books', Icon: BookOpen },
  { key: 'about', pathname: '/about', Icon: User },
  { key: 'linktree', pathname: '/linktree', Icon: Link2 },
]

const EXTERNAL_LINKS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: 'GitHub', href: 'https://github.com/rafa-thayto', Icon: Github },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/thayto/',
    Icon: Linkedin,
  },
  { label: 'Twitter / X', href: 'https://x.com/thayto_dev', Icon: Twitter },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@thayto_dev',
    Icon: Youtube,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/thayto_dev/',
    Icon: Instagram,
  },
  {
    label: 'Bluesky',
    href: 'https://bsky.app/profile/thayto.dev',
    Icon: Cloud,
  },
  { label: 'Newsletter', href: 'https://thayto.substack.com/', Icon: Mail },
  { label: 'Dev.to', href: 'https://dev.to/thayto/', Icon: Code2 },
]

const isEditableTarget = (target: EventTarget | null) =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  target instanceof HTMLSelectElement ||
  (target instanceof HTMLElement && target.isContentEditable)

export const CommandPalette = ({ posts, books }: CommandPaletteProps) => {
  const [open, setOpen] = useState(false)
  const t = useTranslations('commandPalette')
  const locale = useLocale()
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

  // Mirror `open` so the mount-only keydown handler can read the latest state
  // without re-subscribing or moving side effects into a StrictMode-double
  // -invoked setState updater. The handler only fires on user input, well after
  // this effect has committed the current value.
  const openRef = useRef(open)
  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'k' || (!e.metaKey && !e.ctrlKey)) return

      // Already open → always toggle closed. Focus is trapped in our own
      // search input, which counts as an editable target below, so we must
      // short-circuit that guard or a second Cmd+K would never close it.
      if (openRef.current) {
        e.preventDefault()
        setOpen(false)
        return
      }

      // Closed → don't hijack Cmd+K while the user is typing in another field.
      if (isEditableTarget(e.target)) return

      e.preventDefault()
      posthog.capture('command-palette-opened', { via: 'keyboard' })
      setOpen(true)
    }

    const onOpenEvent = () => {
      posthog.capture('command-palette-opened', { via: 'button' })
      setOpen(true)
    }

    document.addEventListener('keydown', onKeyDown)
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpenEvent)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpenEvent)
    }
  }, [])

  const runAndClose = useCallback((action: () => void) => {
    setOpen(false)
    action()
  }, [])

  const navigate = (href: string) => {
    posthog.capture('command-palette-navigate', { href })
    router.push(href)
  }

  // Books have no per-book page: open the Amazon affiliate link when present
  // (matching BookCard), otherwise fall back to the library page.
  const openBook = (book: CommandPaletteBook) => {
    if (book.amazonUrl) {
      posthog.capture('command-palette-book', { id: book.id, via: 'amazon' })
      window.open(book.amazonUrl, '_blank', 'noopener,noreferrer')
      return
    }
    posthog.capture('command-palette-book', { id: book.id, via: 'page' })
    router.push('/books')
  }

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark')
    const newTheme = isDark ? 'light' : 'dark'

    posthog.capture('switch-theme', {
      from: isDark ? 'dark-to-light' : 'light-to-dark',
      via: 'command-palette',
    })

    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
    window.dispatchEvent(new Event('themeChange'))
  }

  const switchLocale = () => {
    const newLocale = locale === 'pt' ? 'en' : 'pt'
    posthog.capture('command-palette-switch-locale', { to: newLocale })
    router.replace(
      // @ts-expect-error -- pathname/params always match the current route,
      // so we can skip next-intl's compile-time route validation here.
      { pathname, params },
      { locale: newLocale },
    )
  }

  const openExternal = (href: string) => {
    posthog.capture('command-palette-external-link', { href })
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label={t('title')}
      overlayClassName="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
      contentClassName="fixed z-[70] left-1/2 top-24 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2"
      loop
    >
      <div
        className="overflow-hidden rounded-2xl border border-white/30 bg-white/90 shadow-2xl shadow-black/20 ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/80 dark:ring-white/10"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <Command.Input
          placeholder={t('placeholder')}
          className="w-full border-b border-gray-200/70 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none placeholder:text-gray-400 dark:border-white/10 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
        <Command.List className="max-h-[60vh] overflow-y-auto overscroll-contain p-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-gray-400 dark:[&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-item]]:flex [&_[cmdk-item]]:cursor-pointer [&_[cmdk-item]]:items-center [&_[cmdk-item]]:gap-2 [&_[cmdk-item]]:rounded-lg [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]]:text-sm [&_[cmdk-item]]:text-gray-700 dark:[&_[cmdk-item]]:text-gray-200 [&_[cmdk-item][data-selected=true]]:bg-gray-100 dark:[&_[cmdk-item][data-selected=true]]:bg-white/10">
          <Command.Empty className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {t('noResults')}
          </Command.Empty>

          <Command.Group heading={t('pages')}>
            {PAGES.map((page) => (
              <Command.Item
                key={page.key}
                value={`page-${page.key} ${t(`page.${page.key}`)}`}
                onSelect={() => runAndClose(() => navigate(page.pathname))}
              >
                <page.Icon className={ICON_CLASS} aria-hidden="true" />
                {t(`page.${page.key}`)}
              </Command.Item>
            ))}
          </Command.Group>

          {posts.length > 0 && (
            <Command.Group heading={t('posts')}>
              {posts.map((post) => (
                <Command.Item
                  key={post.slug}
                  value={`post-${post.slug} ${post.title} ${post.tags.join(
                    ' ',
                  )}`}
                  onSelect={() =>
                    runAndClose(() => navigate(`/blog/${post.slug}`))
                  }
                >
                  <FileText className={ICON_CLASS} aria-hidden="true" />
                  <span className="truncate">{post.title}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {books.length > 0 && (
            <Command.Group heading={t('books')}>
              {books.map((book) => (
                <Command.Item
                  key={book.id}
                  value={`book-${book.id} ${book.title} ${book.author}`}
                  onSelect={() => runAndClose(() => openBook(book))}
                >
                  <BookMarked className={ICON_CLASS} aria-hidden="true" />
                  <span className="truncate">{book.title}</span>
                  <span className="ml-auto truncate pl-2 text-xs text-gray-400 dark:text-gray-500">
                    {book.author}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading={t('actions')}>
            <Command.Item
              value="action-toggle-theme dark light theme"
              onSelect={() => runAndClose(toggleTheme)}
            >
              <SunMoon className={ICON_CLASS} aria-hidden="true" />
              {t('toggleTheme')}
            </Command.Item>
            <Command.Item
              value="action-switch-language idioma language pt en"
              onSelect={() => runAndClose(switchLocale)}
            >
              <Languages className={ICON_CLASS} aria-hidden="true" />
              {locale === 'pt' ? t('switchToEnglish') : t('switchToPortuguese')}
            </Command.Item>
          </Command.Group>

          <Command.Group heading={t('links')}>
            {EXTERNAL_LINKS.map((link) => (
              <Command.Item
                key={link.href}
                value={`link-${link.label}`}
                onSelect={() => runAndClose(() => openExternal(link.href))}
              >
                <link.Icon className={ICON_CLASS} aria-hidden="true" />
                <span className="flex-1">{link.label}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ↗
                </span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
        <div className="flex items-center justify-end gap-3 border-t border-gray-200/70 px-4 py-2 text-xs text-gray-400 dark:border-white/10 dark:text-gray-500">
          <span>
            <kbd className="rounded border border-gray-300 px-1 dark:border-gray-600">
              ↑↓
            </kbd>{' '}
            {t('hintNavigate')}
          </span>
          <span>
            <kbd className="rounded border border-gray-300 px-1 dark:border-gray-600">
              ↵
            </kbd>{' '}
            {t('hintSelect')}
          </span>
          <span>
            <kbd className="rounded border border-gray-300 px-1 dark:border-gray-600">
              esc
            </kbd>{' '}
            {t('hintClose')}
          </span>
        </div>
      </div>
    </Command.Dialog>
  )
}
