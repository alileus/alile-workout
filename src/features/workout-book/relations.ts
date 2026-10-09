import type { Book } from './schema';
import involvement from '../../../content/workout-muscles.json';
import { muscleCategories, extraMuscles } from './muscle-categories';
import { musclePath } from '@/features/anatomy/routes';

export type ExerciseMuscle = {
  id: string;
  name: string;
  group: string;
  href?: string;
  labelKey?: string;
  section?: string;
};

/** A workout relates to the muscle guides that explicitly include its stable ID. */
export function guideRelations(book: Book) {
  const relations = new Map<string, ExerciseMuscle[]>();
  for (const group of book)
    for (const section of group.sections)
      for (const region of section.regions)
        for (const exercise of region.exercises) {
          const muscles = relations.get(exercise.id) ?? [];
          if (!muscles.some((muscle) => muscle.id === region.id))
            muscles.push({
              id: region.id,
              name: region.name,
              group: group.id,
              href: musclePath(group.id, region.id),
              section: section.name,
            });
          relations.set(exercise.id, muscles);
        }
  return relations;
}

/** Combine listed guides and structured secondary targets without duplicate muscle IDs. */
export function exerciseRelations(book: Book) {
  const relations = guideRelations(book);
  const regions = new Map(
    book.flatMap((g) =>
      g.sections.flatMap((s) =>
        s.regions.map(
          (r) =>
            [
              r.id,
              {
                id: r.id,
                name: r.name,
                group: g.id,
                href: musclePath(g.id, r.id),
                section: s.name,
              },
            ] as const,
        ),
      ),
    ),
  );
  for (const [workout, muscles] of relations) {
    const targets = (involvement as Record<string, string[]>)[workout] ?? [];
    // Add precise targets first, so an already-covered family is not repeated.
    for (const id of targets) {
      const muscle = regions.get(id);
      if (muscle && !muscles.some((m) => m.id === id)) muscles.push(muscle);
    }
    for (const id of targets) {
      const [kind, key] = id.split(':');
      if (kind === 'category') {
        const category = muscleCategories[key];
        if (
          !category ||
          (category.members.length &&
            category.members.every((member) => muscles.some((m) => m.id === member)))
        )
          continue;
        muscles.push({
          id,
          name: category.name,
          group: category.group,
          href: musclePath(category.group),
          labelKey: key,
        });
      } else if (kind === 'extra' && extraMuscles[key]) {
        muscles.push({ id, ...extraMuscles[key], labelKey: key });
      }
    }
  }
  return relations;
}
