import { hasLocale } from 'next-intl';
import { notFound, permanentRedirect } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { englishBook, getRegion } from '@/features/workout-book/data';
import { musclePath } from '@/features/anatomy/routes';
export function generateStaticParams() {
  return englishBook.flatMap((g) =>
    g.sections.flatMap((s) => s.regions.map((r) => ({ slug: r.id }))),
  );
}
export default async function LegacyGuide({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const entry = getRegion(locale, slug);
  if (!entry) notFound();
  permanentRedirect(`/${locale}${musclePath(entry.group, entry.region.id)}`);
}
