import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getBook } from '@/features/workout-book/data';
import { AtlasRoute } from '@/features/anatomy/components/atlas-route';

export default async function AtlasLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <>
      <AtlasRoute book={getBook(locale)} />
      {children}
    </>
  );
}
