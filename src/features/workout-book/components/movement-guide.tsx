import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Region } from '../schema';
import { hasTranslation, suggestionUrl } from '../data';
export function MovementGuide({ region, full = false }: { region: Region; full?: boolean }) {
  const t = useTranslations('App'),
    locale = useLocale() as Locale,
    translated = hasTranslation(locale, region.id);
  return (
    <article>
      <div className="eyebrow">{t('guide')}</div>
      <h2 className="guide-title">{region.name}</h2>
      {!translated && (
        <a className="translation-note" href={suggestionUrl(region.id)}>
          {t('fallback')}
        </a>
      )}
      <div lang={translated ? locale : 'en'} dir={translated && locale === 'ar' ? 'rtl' : 'ltr'}>
        <p className="description">{region.description}</p>
        {region.note && <p className="muted context-note">{region.note}</p>}
        {region.exercises.map((exercise, index) => (
          <section key={exercise.name} className="exercise">
            <div className="exercise-heading">
              <span className="exercise-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{exercise.name}</h3>
            </div>
            <p className="muted equipment">{exercise.equipment}</p>
            <div className="also-works">
              <span className="eyebrow" lang={locale}>
                {t('alsoWorks')}
              </span>
              <p>{exercise.alsoWorks}</p>
            </div>
            <details open={full || undefined}>
              <summary lang={locale}>
                {t('how')} <span>+</span>
              </summary>
              <div className="instructions">
                <p>{exercise.instructions}</p>
                <p className="cue">{exercise.cue}</p>
                <p>
                  <span lang={locale}>{t('volume')}</span> · {exercise.volume}
                </p>
              </div>
            </details>
          </section>
        ))}
      </div>
      <div className="guide-footer">
        {!full && (
          <Link href={`/book/${region.id}`}>
            {t('openPage')} <ArrowUpRight size={14} />
          </Link>
        )}
        <a href={suggestionUrl(region.id)}>
          {t('suggest')} <ArrowUpRight size={14} />
        </a>
        <details>
          <summary>{t('reference')}</summary>
          {region.references.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer">
              {new URL(url).hostname} <ArrowUpRight size={14} />
            </a>
          ))}
        </details>
        {region.reviewStatus === 'draft' && <p className="review-status">{t('draft')}</p>}
      </div>
    </article>
  );
}
