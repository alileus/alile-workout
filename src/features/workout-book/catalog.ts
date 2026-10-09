import type { Book, Exercise } from './schema';
import { exerciseRelations, type ExerciseMuscle } from './relations';

export type Workout = Exercise & { muscles: ExerciseMuscle[] };

/** One entry per stable workout ID, with all participating muscle guides. */
export function workoutCatalog(book: Book, locale: string): Workout[] {
  const relations = exerciseRelations(book);
  const workouts = new Map<string, Workout>();
  for (const group of book)
    for (const section of group.sections)
      for (const region of section.regions)
        for (const exercise of region.exercises)
          if (!workouts.has(exercise.id))
            workouts.set(exercise.id, { ...exercise, muscles: relations.get(exercise.id) ?? [] });
  return [...workouts.values()].sort((a, b) => a.name.localeCompare(b.name, locale));
}
