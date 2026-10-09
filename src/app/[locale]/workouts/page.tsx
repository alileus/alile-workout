import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { DocumentShell } from '@/components/document-shell';
import { getBook } from '@/features/workout-book/data';
import { workoutCatalog } from '@/features/workout-book/catalog';
import { WorkoutCatalog } from '@/features/workout-book/components/workout-catalog';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'Workouts' });
  return pageMetadata(locale, '/workouts', t('title'), t('description'));
}

export default async function Workouts({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('Workouts');
  return (
    <DocumentShell>
      <h1>{t('title')}</h1>
      <p className="workout-intro">{t('description')}</p>
      <WorkoutCatalog workouts={workoutCatalog(getBook(locale), locale)} />
    </DocumentShell>
  );
}
