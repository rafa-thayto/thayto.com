'use client'

import Image from 'next/image'
import Link from 'next/link'
import posthog from 'posthog-js'
import {
  Fragment,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
  type ComponentType,
} from 'react'
import { ChevronRight, Github, Instagram, Youtube } from 'lucide-react'
import Confetti from 'react-confetti'
import { Post } from '@/utils/mdx'
import { getYearsOfProfessionalExperience } from '@/constants'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTranslations, useLocale } from 'next-intl'
import {
  companies,
  getCompanyLabel,
  CompanyLink,
  CompanyGroup,
} from '@/data/companies'
import { curiosityLinks } from '@/data/curiosity-links'

interface HomeContentProps {
  posts: Post[]
}

function TrackedLink({
  href,
  event,
  eventProps,
  children,
}: {
  href: string
  event: string
  eventProps?: Record<string, string>
  children: ReactNode
}) {
  const locale = useLocale()
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-75 transition-opacity"
      // the unlayered `a { text-decoration: inherit }` reset in styles.css
      // beats Tailwind's `underline` utility, so underline inline
      style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}
      onClick={() =>
        posthog.capture(event, { ...eventProps, url: href, locale })
      }
    >
      {children}
    </a>
  )
}

type BrandIconProps = { className?: string; style?: CSSProperties }

const createBrandIcon = (path: string) => {
  const BrandIcon = ({ className, style }: BrandIconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
  return BrandIcon
}

const XLogo = createBrandIcon(
  'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
)

const TikTokLogo = createBrandIcon(
  'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
)

const BRAND_ICONS: Record<string, ComponentType<BrandIconProps>> = {
  'github.com': Github,
  'x.com': XLogo,
  'instagram.com': Instagram,
  'tiktok.com': TikTokLogo,
  'youtube.com': Youtube,
}

const iconForUrl = (url: string) =>
  BRAND_ICONS[new URL(url).hostname.replace(/^www\./, '')] ?? null

// the unlayered `svg { display: block }` reset in styles.css beats
// Tailwind's `inline` utility, so display goes inline via style
const brandIconStyle: CSSProperties = {
  display: 'inline',
  verticalAlign: '-0.125em',
}

const curiosityRenderers = Object.fromEntries(
  Object.entries(curiosityLinks).map(([tag, url]) => {
    const BrandIcon = iconForUrl(url)
    return [
      tag,
      (chunks: ReactNode) => (
        <TrackedLink href={url} event="curiosity-link-clicked">
          {BrandIcon && (
            <BrandIcon className="w-3.5 h-3.5 mr-1" style={brandIconStyle} />
          )}
          {chunks}
        </TrackedLink>
      ),
    ]
  }),
)

function HintTooltip({
  trigger,
  children,
}: {
  trigger: ReactNode
  children: ReactNode
}) {
  // Radix tooltips ignore touch, so control the state and toggle on tap/click.
  // preventDefault stops Radix's own click handler from re-closing it.
  const [open, setOpen] = useState(false)
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <span
          className="underline cursor-help"
          onClick={(e) => {
            e.preventDefault()
            setOpen((prev) => !prev)
          }}
        >
          {trigger}
        </span>
      </TooltipTrigger>
      <TooltipContent onPointerDownOutside={() => setOpen(false)}>
        <p>{children}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function HomeContent({ posts }: HomeContentProps) {
  const t = useTranslations('home')
  const locale = useLocale()
  const [showAnimation, setShowAnimation] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map())
  const years = getYearsOfProfessionalExperience()

  // Preload all audio files
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const soundsToPreload = [
        '/static/sounds/tap_01.wav',
        '/static/sounds/tap_02.wav',
        '/static/sounds/tap_03.wav',
      ]

      soundsToPreload.forEach((soundPath) => {
        const audio = new Audio(soundPath)
        audio.preload = 'auto'
        audioCache.current.set(soundPath, audio)
      })
    }
  }, [])

  // Audio playback helper
  const playSound = (soundPath: string, volume: number = 0.5) => {
    if (typeof window !== 'undefined') {
      const cachedAudio = audioCache.current.get(soundPath)
      if (cachedAudio) {
        // Clone the audio to allow overlapping plays
        const audio = cachedAudio.cloneNode() as HTMLAudioElement
        audio.volume = volume
        audio.play().catch(() => {
          // Ignore errors if audio can't play
        })
      } else {
        // Fallback if not preloaded
        const audio = new Audio(soundPath)
        audio.volume = volume
        audio.play().catch(() => {})
      }
    }
  }

  // Play multiple sounds in sequence
  const playSoundsSequence = (soundPaths: string[], delayMs: number = 100) => {
    soundPaths.forEach((soundPath, index) => {
      setTimeout(() => {
        playSound(soundPath)
      }, index * delayMs)
    })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    timeoutRef.current = setTimeout(() => {
      setShowAnimation(true)
      handlePhotoClick()
    }, 500)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setShowAnimation(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handlePhotoClick = () => {
    setShowConfetti(true)
  }

  const renderCompanyLink = (company: CompanyLink) => (
    <TrackedLink
      href={company.url}
      event="company-link-clicked"
      eventProps={{ company: company.name }}
    >
      {getCompanyLabel(company, locale)}
    </TrackedLink>
  )

  const renderCompanyGroup = (group: CompanyGroup) => (
    <>
      {group.name}
      {' ('}
      {group.offices.map((office, index) => (
        <Fragment key={office.name}>
          {index > 0 && ', '}
          {renderCompanyLink(office)}
        </Fragment>
      ))}
      {')'}
    </>
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <div className="flex mt-2 items-center justify-items-center justify-start flex-col sm:flex-row">
        <div
          className="relative w-20 h-20 cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handlePhotoClick}
        >
          <div
            className={`absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full blur-sm transition-all duration-500 ${
              showAnimation ? 'opacity-75 animate-spin' : 'opacity-0'
            }`}
          ></div>
          <div
            className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 rounded-full transition-all duration-500 ${
              showAnimation ? 'opacity-100 animate-spin' : 'opacity-0'
            }`}
          ></div>

          {isHovering && !showAnimation && (
            <div className="absolute -inset-2 rounded-full !border-2 !border-blue-500 !animate-pulse !opacity-60"></div>
          )}

          <div className="relative w-full h-full bg-neutral-50 dark:bg-black rounded-full p-0.5">
            <Image
              src="/static/images/profile.jpg"
              alt="Thayto's profile picture"
              fill
              sizes="80px"
              priority
              className={`rounded-full object-cover transition-transform duration-300 ${
                isHovering ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        </div>
        <div className="sm:ml-6 mt-4 sm:mt-0 flex justify-center flex-col">
          <h1 className="text-2xl text-gray-900 dark:text-white font-bold">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-300 font-light">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <section className="text-sm leading-normal font-normal font-sans mt-6 flex flex-col gap-4 text-gray-700 dark:text-gray-200">
        <p>{t('greeting')}</p>
        <p>
          {t.rich('bio.intro', {
            years,
            exp: (chunks) => (
              <HintTooltip trigger={chunks}>{t('bio.startDate')}</HintTooltip>
            ),
          })}{' '}
          <HintTooltip trigger={t('bio.companies')}>
            {companies.map((entry, index) => (
              <Fragment key={entry.name}>
                {index > 0 && ', '}
                {'offices' in entry
                  ? renderCompanyGroup(entry)
                  : renderCompanyLink(entry)}
              </Fragment>
            ))}
          </HintTooltip>{' '}
          {t('bio.location')}
        </p>
        <p>{t('bio.blog')}</p>
        <p>{t('bio.vim')}</p>
      </section>

      <section className="mt-8 text-sm leading-normal font-normal font-sans flex flex-col gap-2 text-gray-700 dark:text-gray-200">
        <h2 className="text-lg font-normal text-slate-600 dark:text-gray-400">
          {t('curiosities.title')}
        </h2>
        <p>{t.rich('curiosities.text', curiosityRenderers)}</p>
      </section>

      <section className="mt-8 text-base text-slate-800 dark:text-gray-100">
        <h2 className="mb-6">
          <Link
            href={locale === 'pt' ? '/blog' : '/en/blog'}
            className="group flex items-center gap-2 text-lg font-normal text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-100 transition-colors duration-200"
            onMouseEnter={() =>
              playSoundsSequence([
                '/static/sounds/tap_01.wav',
                '/static/sounds/tap_02.wav',
                '/static/sounds/tap_03.wav',
              ])
            }
          >
            {t('recentPosts')}
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </h2>
        <div className="space-y-1">
          {(() => {
            // Group posts by year
            const postsByYear =
              posts?.reduce((acc, post) => {
                const year = new Date(post.data.publishedTime).getFullYear()
                if (!acc[year]) acc[year] = []
                acc[year].push(post)
                return acc
              }, {} as Record<number, typeof posts>) || {}

            // Sort years in descending order
            const sortedYears = Object.keys(postsByYear)
              .map(Number)
              .sort((a, b) => b - a)

            return sortedYears.map((year) => (
              <div key={year}>
                {postsByYear[year].map(
                  ({ data: { publishedTime, title, href } }, index) => (
                    <Link
                      key={title}
                      href={href}
                      className="group flex items-center py-2 px-3 -mx-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                      onClick={() => {
                        posthog.capture('blog-card-clicked-home', {
                          href,
                          title,
                          locale,
                        })
                      }}
                    >
                      <div className="w-12 flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                        {index === 0 ? year : ''}
                      </div>
                      <div className="flex-1 text-sm text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                        {title}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-200">
                        <time dateTime={publishedTime.toString()}>
                          {new Intl.DateTimeFormat(
                            locale === 'pt' ? 'pt-BR' : 'en-US',
                            {
                              month: '2-digit',
                              day: '2-digit',
                            },
                          ).format(new Date(publishedTime))}
                        </time>
                      </div>
                    </Link>
                  ),
                )}
              </div>
            ))
          })()}
        </div>
      </section>

      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 200}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          onConfettiComplete={() => {
            setShowConfetti(false)
          }}
          colors={[
            '#3B82F6',
            '#60A5FA',
            '#93C5FD',
            '#DBEAFE',
            '#1D4ED8',
            '#2563EB',
          ]}
        />
      )}
    </>
  )
}
