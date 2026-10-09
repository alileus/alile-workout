import { useTranslations } from 'next-intl';
import type { Exercise } from '../schema';
import type { ExerciseMuscle } from '../relations';
import artwork from '../artwork.json';
import { Link } from '@/i18n/navigation';

export function ExerciseMuscles({
  muscles,
  current,
}: {
  muscles: ExerciseMuscle[];
  current?: string;
}) {
  const t = useTranslations('App');
  const specific = muscles.filter((muscle) => !muscle.id.startsWith('category:'));
  const ordered = current
    ? [...specific.filter((m) => m.id === current), ...specific.filter((m) => m.id !== current)]
    : specific;
  return (
    <ul className="exercise-muscles" aria-label={t('exerciseMuscles')}>
      {ordered.map((muscle) => (
        <li key={muscle.id}>
          {muscle.id === current || !muscle.href ? (
            <span aria-current={muscle.id === current ? 'true' : undefined}>
              {muscle.labelKey ? t(`involvement.${muscle.labelKey}`) : muscle.name}
            </span>
          ) : (
            <Link href={muscle.href} scroll={false}>
              {muscle.labelKey
                ? t(`involvement.${muscle.labelKey}`)
                : ['Biceps', 'Triceps'].includes(muscle.section ?? '') && /head/.test(muscle.id)
                  ? `${t(`sectionNames.${muscle.section}`)} · ${muscle.name}`
                  : muscle.name}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export function ExerciseContent({ exercise }: { exercise: Exercise }) {
  const t = useTranslations('App');
  return (
    <>
      <p className="muted equipment">{exercise.equipment}</p>
      <div className="exercise-layout">
        {artwork.includes(exercise.id) && (
          // Keep the traced SVG paths outside React's component tree.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="exercise-artwork"
            src={`/workouts/${exercise.id}.svg`}
            alt={t('exerciseIllustration', { exercise: exercise.name })}
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="instructions">
          <h4>{t('how')}</h4>
          <p>{exercise.instructions}</p>
          <p className="cue">{exercise.cue}</p>
        </div>
      </div>
    </>
  );
}
