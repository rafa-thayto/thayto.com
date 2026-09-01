'use client'

import posthog from 'posthog-js'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Handwriting } from '@/components/handwriting'
import { BLOB_HEIGHT, BLOB_WIDTH, blobPath, blobTransform } from '@/utils/blob'
import { NotesLabel } from './notes-label'
import styles from './notes.module.css'

type NotesIndexProps = {
  numbers: number[]
}

export function NotesIndex({ numbers }: NotesIndexProps) {
  const t = useTranslations('notes')
  const locale = useLocale()

  return (
    <main data-route="notes" className={styles.root}>
      <NotesLabel />
      {numbers.map((number, index) => (
        <Link
          key={number}
          href={`/notes/${number}`}
          className={styles.item}
          aria-label={t('noteAriaLabel', { number })}
          onClick={() =>
            posthog.capture('notes-index-note-clicked', {
              number,
              position: index,
              locale,
            })
          }
        >
          <div className={styles.stage} data-stage-index={index}>
            <svg
              aria-hidden="true"
              viewBox={`0 0 ${BLOB_WIDTH} ${BLOB_HEIGHT}`}
              xmlns="http://www.w3.org/2000/svg"
              className={styles.blob}
            >
              <path d={blobPath(number)} transform={blobTransform(number)} />
            </svg>
            <Handwriting
              text={`#${number}`}
              seed={number}
              letterSpacing={3}
              strokeWidth={2.4}
              className={styles.number}
              trigger={index === 0 ? 'load' : 'view'}
              delay={index === 0 ? 300 : 100}
              duration={700}
              stagger={90}
            />
          </div>
        </Link>
      ))}
    </main>
  )
}
