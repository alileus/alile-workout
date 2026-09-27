import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { englishBook, getBook } from '@/features/workout-book/data';
import { Atlas } from '@/features/anatomy/components/atlas';
import { musclePath, resolveMuscleRoute } from '@/features/anatomy/routes';
import { pageMetadata, siteUrl } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; slug: string[] }> };

export function generateStaticParams() {
  return englishBook.flatMap((group) => [
    { slug: [group.id] },
    ...group.sections.flatMap((section) =>
      section.regions.map((region) => ({ slug: [group.id, region.id] })),
    ),
  ]);
}

async function entryFor(params: Props['params']) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const book = getBook(locale);
  const entry = resolveMuscleRoute(book, slug);
  if (!entry) notFound();
  const t = await getTranslations({ locale, namespace: 'App' });
  const groupTitle = t(entry.group.id === 'back' ? 'backGroup' : entry.group.id);
  const title = entry.region ? `${groupTitle} | ${entry.region.name}` : groupTitle;
  const description = entry.region?.description || t('groupDescription', { muscle: groupTitle });
  const path = musclePath(entry.group.id, entry.region?.id);
  return { locale, book, ...entry, title, description, path };
}

export async function generateMetadata({ params }: Props) {
  const entry = await entryFor(params);
  return pageMetadata(
    entry.locale,
    entry.path,
    entry.title,
    entry.description,
    entry.region?.id,
    entry.group.id,
  );
}

export default async function MusclePage({ params }: Props) {
  const entry = await entryFor(params);
  setRequestLocale(entry.locale);
  const structured = {
    '@context': 'https://schema.org',
    '@type': entry.region ? 'Article' : 'CollectionPage',
    name: entry.title,
    headline: entry.title,
    description: entry.description,
    inLanguage: entry.locale,
    url: `${siteUrl}/${entry.locale}${entry.path}`,
    about: { '@type': 'Thing', name: entry.title },
    ...(entry.region
      ? { citation: entry.region.references }
      : {
          hasPart: entry.group.sections.flatMap((section) =>
            section.regions.map((region) => ({
              '@type': 'Article',
              name: region.name,
              url: `${siteUrl}/${entry.locale}${musclePath(entry.group.id, region.id)}`,
            })),
          ),
        }),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }}
      />
      <Atlas
        key={entry.group.id}
        book={entry.book}
        groupId={entry.group.id}
        selected={entry.region?.id ?? null}
      />
    </>
  );
}
