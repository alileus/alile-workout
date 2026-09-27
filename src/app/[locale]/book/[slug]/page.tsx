import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { englishBook, getRegion, hasTranslation } from '@/features/workout-book/data';
import { MovementGuide } from '@/features/workout-book/components/movement-guide';
import { DocumentShell } from '@/components/document-shell';
import { pageMetadata, siteUrl } from '@/lib/seo';
type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() {
  return englishBook.flatMap((g) =>
    g.sections.flatMap((s) => s.regions.map((r) => ({ slug: r.id }))),
  );
}
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const entry = getRegion(locale, slug);
  if (!entry) notFound();
  return pageMetadata(locale, `/book/${slug}`, entry.region.name, entry.region.description, slug);
}
export default async function RegionPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const entry = getRegion(locale, slug);
  if (!entry) notFound();
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.region.name,
    description: entry.region.description,
    inLanguage: hasTranslation(locale, slug) ? locale : 'en',
    url: `${siteUrl}/${locale}/book/${slug}`,
    about: { '@type': 'Thing', name: entry.region.name },
    citation: entry.region.references,
  };
  return (
    <DocumentShell>
      <h1 className="sr-only">{entry.region.name}</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }}
      />
      <div className="full-guide">
        <MovementGuide region={entry.region} full />
      </div>
    </DocumentShell>
  );
}
