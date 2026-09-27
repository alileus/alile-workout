import { hasLocale } from 'next-intl';
import { notFound, permanentRedirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

// Keep existing bookmarks working; the atlas is the only browsing entry point.
export default async function BookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  permanentRedirect(`/${locale}`);
}
