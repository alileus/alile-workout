import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import type { Book, Region } from '../schema';
import { hasTranslation, suggestionUrl } from '../data';
import { exerciseRelations } from '../relations';
import { ExerciseContent, ExerciseMuscles } from './exercise-content';
import { Button } from '@/components/ui/button';
import { DisclosureIndicator } from '@/components/disclosure-indicator';
export function MovementGuide({ region, book }: { region: Region; book: Book }) {
  const t = useTranslations('App'),
    locale = useLocale() as Locale,
    translated = hasTranslation(locale, region.id);
  const relations = exerciseRelations(book);
  return (
    <article>
      <div className="eyebrow">{t('guide')}</div>
      <h2 className="guide-title">{region.name}</h2>
      <div className="guide-actions">
        <Button asChild variant="outline">
          <a href={suggestionUrl(region.id)} target="_blank" rel="noreferrer">
            {t('suggest')}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </Button>
      </div>
      {!translated && (
        <a
          className="translation-note"
          href={suggestionUrl(region.id)}
          target="_blank"
          rel="noreferrer"
        >
          {t('fallback')}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}
      <div lang={translated ? locale : 'en'} dir={translated && locale === 'ar' ? 'rtl' : 'ltr'}>
        <p className="description">{region.description}</p>
        {region.note && <p className="muted context-note">{region.note}</p>}
        {region.exercises.map((exercise, index) => (
          <section key={exercise.id} className="exercise">
            <div className="exercise-heading">
              <span className="exercise-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{exercise.name}</h3>
            </div>
            <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <ExerciseMuscles muscles={relations.get(exercise.id) ?? []} current={region.id} />
              <ExerciseContent exercise={exercise} />
            </div>
          </section>
        ))}
      </div>
      <section className="guide-references" aria-label={t('reference')}>
        <details>
          <summary>
            {t('reference')}
            <DisclosureIndicator />
          </summary>
          {region.references.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer">
              {new URL(url).hostname} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
        </details>
        {region.reviewStatus === 'draft' && <p className="review-status">{t('draft')}</p>}
      </section>
    </article>
  );
}
