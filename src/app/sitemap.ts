import type { MetadataRoute } from 'next';
import { englishBook } from '@/features/workout-book/data';
import { routing } from '@/i18n/routing';
import { siteUrl, isProduction } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProduction) return [];
  const paths = [
    '',
    '/book',
    '/contribute',
    ...englishBook.flatMap((g) => g.sections.flatMap((s) => s.regions.map((r) => `/book/${r.id}`))),
  ];
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((lang) => [lang, `${siteUrl}/${lang}${path}`]),
        ),
      },
    })),
  );
}
