'use client';

import { usePathname } from '@/i18n/navigation';
import type { Book } from '@/features/workout-book/schema';
import { resolveMuscleRoute } from '../routes';
import { Atlas } from './atlas';

// Keep the artwork and its decoded images mounted as the selected route changes.
export function AtlasRoute({ book }: { book: Book }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const entry = segments[0] === 'muscles' ? resolveMuscleRoute(book, segments.slice(1)) : null;
  return <Atlas book={book} groupId={entry?.group.id} selected={entry?.region?.id} />;
}
