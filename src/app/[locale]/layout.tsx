import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { NavigationDrawer } from '@/components/navigation-drawer';
import '../globals.css';
import '@fontsource-variable/noto-sans-arabic';
import '@fontsource-variable/noto-sans-jp';
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
      <body>
        <NextIntlClientProvider>
          {children}
          <NavigationDrawer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
