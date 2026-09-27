'use client';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
export function LanguageSwitcher() {
  const locale = useLocale(),
    pathname = usePathname(),
    t = useTranslations('App');
  return (
    <nav className="language-switcher" aria-label={t('language')}>
      {routing.locales.map((lang) => (
        <Link
          key={lang}
          href={pathname}
          locale={lang}
          hrefLang={lang}
          lang={lang}
          aria-current={locale === lang ? 'page' : undefined}
        >
          {{ en: 'EN', ar: 'العربية', ja: '日本語' }[lang]}
        </Link>
      ))}
    </nav>
  );
}
