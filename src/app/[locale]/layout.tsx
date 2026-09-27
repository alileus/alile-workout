import type { Viewport } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { routing } from '@/i18n/routing';
import { NavigationDrawer } from '@/components/navigation-drawer';
import '../globals.css';
import fonts from '@/generated/fonts.json';
export const viewport: Viewport = {
  themeColor: '#161513',
  colorScheme: 'dark',
  viewportFit: 'cover',
};
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
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
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="dark">
      <head>
        {fonts[locale].preload.map((href) => (
          <link
            key={href}
            rel="preload"
            href={href}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
        {fonts[locale].stylesheet && <link rel="stylesheet" href={fonts[locale].stylesheet} />}
      </head>
      <body>
        <NextIntlClientProvider>
          {children}
          <NavigationDrawer />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
