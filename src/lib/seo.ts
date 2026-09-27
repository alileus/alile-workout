import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';
export const siteUrl = 'https://workout.alile.us';
export const isProduction = process.env.VERCEL_ENV === 'production';
export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  region?: string,
  group?: string,
): Metadata {
  const url = `${siteUrl}/${locale}${path}`;
  const image = `${siteUrl}/api/og${region ? `?region=${encodeURIComponent(region)}` : group ? `?group=${encodeURIComponent(group)}` : ''}`;
  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en${path}`,
        ar: `${siteUrl}/ar${path}`,
        ja: `${siteUrl}/ja${path}`,
        'x-default': `${siteUrl}/en${path}`,
      },
    },
    robots: { index: isProduction, follow: isProduction },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: { en: 'en_US', ar: 'ar_SA', ja: 'ja_JP' }[locale],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
