import type { Book } from '../workout-book/schema';

export function musclePath(group?: string | null, region?: string | null) {
  return group ? `/muscles/${group}${region ? `/${region}` : ''}` : '/';
}

export function resolveMuscleRoute(book: Book, slug: string[]) {
  if (slug.length < 1 || slug.length > 2) return undefined;
  const group = book.find((entry) => entry.id === slug[0]);
  if (!group) return undefined;
  const region = slug[1]
    ? group.sections.flatMap((section) => section.regions).find((entry) => entry.id === slug[1])
    : undefined;
  if (slug[1] && !region) return undefined;
  return { group, region };
}
