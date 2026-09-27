import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getBook } from '@/features/workout-book/data';
import { DocumentShell } from '@/components/document-shell';
import { pageMetadata } from '@/lib/seo';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'App' });
  return pageMetadata(locale, '/book', t('book'), t('description'));
}
export default async function BookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('App'),
    book = getBook(locale);
  return (
    <DocumentShell>
      <span className="eyebrow">{t('browse')}</span>
      <h1>{t('book')}</h1>
      <div className="book-grid">
        {book.map((group) => (
          <section key={group.id}>
            <h2>{t(group.id === 'back' ? 'backGroup' : group.id)}</h2>
            {group.sections.map((section) => (
              <div key={section.name}>
                <h3>
                  {t.has(`sectionNames.${section.name}`)
                    ? t(`sectionNames.${section.name}`)
                    : section.name}
                </h3>
                {section.regions.map((region) => (
                  <Link key={region.id} href={`/book/${region.id}`}>
                    {region.name} ↗
                  </Link>
                ))}
              </div>
            ))}
          </section>
        ))}
      </div>
    </DocumentShell>
  );
}
