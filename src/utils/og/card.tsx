import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import type { Locale } from '@/i18n/config'
import { OG_COPY, OG_POST_GREETING, type OgPage } from './copy'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const COLORS = {
  background: '#02000A',
  muted: '#CCCCCE',
  headline: '#FAFAFA',
}

async function loadAssets() {
  const fontsDir = join(process.cwd(), 'src/assets/og-fonts')
  const [poppins400, poppins600, lora500Italic, profile] = await Promise.all([
    readFile(join(fontsDir, 'poppins-400.ttf')),
    readFile(join(fontsDir, 'poppins-600.ttf')),
    readFile(join(fontsDir, 'lora-500-italic.ttf')),
    readFile(join(process.cwd(), 'public/static/images/profile.jpg')),
  ])

  return {
    fonts: [
      { name: 'Poppins', data: poppins400, weight: 400 as const },
      { name: 'Poppins', data: poppins600, weight: 600 as const },
      {
        name: 'Lora',
        data: lora500Italic,
        weight: 500 as const,
        style: 'italic' as const,
      },
    ],
    profileSrc: `data:image/jpeg;base64,${profile.toString('base64')}`,
  }
}

type CardContent = {
  greeting: string
  headline: string
  tags?: string[]
}

async function renderCard({ greeting, headline, tags }: CardContent) {
  const { fonts, profileSrc } = await loadAssets()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: COLORS.background,
          fontFamily: 'Poppins',
          padding: '56px 60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: COLORS.muted,
            fontSize: 34,
          }}
        >
          <span>{greeting}</span>
          <span>:)</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              color: COLORS.headline,
              fontSize: 50,
              fontWeight: 600,
              lineHeight: 1.35,
              whiteSpace: 'pre-wrap',
            }}
          >
            {headline}
          </div>
          {tags && tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                marginTop: 28,
                color: COLORS.muted,
                fontSize: 26,
                gap: 18,
              }}
            >
              {tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {/* satori renders plain img tags only; next/image is unavailable here */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={profileSrc}
            width={118}
            height={118}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: COLORS.muted, fontSize: 32 }}>
              Rafael Thayto
            </span>
            <span
              style={{
                color: COLORS.muted,
                fontSize: 24,
                fontFamily: 'Lora',
                fontStyle: 'italic',
              }}
            >
              thayto.com
            </span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts, emoji: 'twemoji' },
  )
}

export function pageOgImage(page: OgPage, locale: Locale) {
  return renderCard(OG_COPY[page][locale])
}

export function postOgImage(locale: Locale, title: string, tags?: string[]) {
  return renderCard({
    greeting: OG_POST_GREETING[locale],
    headline: title,
    tags,
  })
}
