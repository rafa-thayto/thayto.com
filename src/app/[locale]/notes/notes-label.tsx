'use client'

import posthog from 'posthog-js'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import styles from './notes.module.css'

type NotesLabelProps = {
  // on a single note the label doubles as the way back to the index
  backFrom?: number
}

export function NotesLabel({ backFrom }: NotesLabelProps) {
  const t = useTranslations('notes')
  const locale = useLocale()

  if (backFrom === undefined) {
    return <p className={styles.label}>{t('label')}</p>
  }

  return (
    <p className={styles.label}>
      <Link
        href="/notes"
        aria-label={t('backToNotes')}
        onClick={() =>
          posthog.capture('notes-back-clicked', { number: backFrom, locale })
        }
      >
        {t('label')}
      </Link>
    </p>
  )
}
