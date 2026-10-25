import { defineRouting } from 'next-intl/routing';
export const routing = defineRouting({
  locales: ['en', 'ar', 'ja'],
  defaultLocale: 'en',
  localePrefix: 'always',
  // A language preference must remain writable by next-intl's navigation.
  localeCookie: { secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' },
});
export type Locale = (typeof routing.locales)[number];
