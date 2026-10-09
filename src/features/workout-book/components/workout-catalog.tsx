'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import type { Workout } from '../catalog';
import { Button } from '@/components/ui/button';
import { DisclosureIndicator } from '@/components/disclosure-indicator';
import { ExerciseContent, ExerciseMuscles } from './exercise-content';

const groups = ['chest', 'back', 'shoulders', 'arms', 'core', 'legs'] as const;
export function WorkoutCatalog({ workouts }: { workouts: Workout[] }) {
  const t = useTranslations('Workouts');
  const app = useTranslations('App');
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const search = query.trim().normalize('NFKC').toLocaleLowerCase();
  const matches = workouts.filter(
    (workout) =>
      (group === 'all' || workout.muscles.some((muscle) => muscle.group === group)) &&
      [
        workout.name,
        workout.equipment,
        ...workout.muscles.map((muscle) =>
          muscle.labelKey
            ? app(`involvement.${muscle.labelKey}`)
            : `${muscle.section ?? ''} ${muscle.name}`,
        ),
      ].some((text) => text.normalize('NFKC').toLocaleLowerCase().includes(search)),
  );
  return (
    <div className="workout-catalog">
      <div className="workout-controls">
        <label className="workout-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('search')}
            aria-label={t('search')}
          />
        </label>
        <div className="workout-filters" role="group" aria-label={t('filter')}>
          {['all', ...groups].map((id) => (
            <Button
              key={id}
              variant={group === id ? 'default' : 'outline'}
              aria-pressed={group === id}
              onClick={() => setGroup(id)}
            >
              {id === 'all' ? t('all') : app(id === 'back' ? 'backGroup' : id)}
            </Button>
          ))}
        </div>
        <p className="muted workout-count" role="status">
          {t('count', { count: matches.length })}
        </p>
      </div>
      <div className="workout-list">
        {matches.map((workout) => (
          <details key={workout.id} id={workout.id} className="exercise workout-entry">
            <summary className="workout-summary">
              <span>
                <span className="workout-name">{workout.name}</span>
                <span className="muted equipment">{workout.equipment}</span>
              </span>
              <DisclosureIndicator />
            </summary>
            <div className="workout-body">
              <ExerciseMuscles muscles={workout.muscles} />
              <ExerciseContent exercise={workout} />
            </div>
          </details>
        ))}
      </div>
      {matches.length === 0 && <p className="workout-empty">{t('empty')}</p>}
    </div>
  );
}
